using System.Text;
using System.Text.Json;

namespace ChatSentimentAPI.Services
{
    public class SentimentService : ISentimentService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<SentimentService> _logger;

        public SentimentService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<SentimentService> logger)
        {
            _httpClient = httpClient;
            _httpClient.Timeout = TimeSpan.FromSeconds(15);
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<(string sentiment, double score)> AnalyzeSentimentAsync(string text)
        {
            var apiUrl = _configuration["HuggingFace:ApiUrl"];

            if (string.IsNullOrEmpty(apiUrl))
            {
                _logger.LogWarning("HuggingFace API URL not configured, using mock analysis");
                return GetMockSentiment(text);
            }

            try
            {
                _logger.LogInformation("Calling Hugging Face API: {Url}", apiUrl);

                // Gradio 4.x API format
                var requestBody = new
                {
                    data = new object[] { text }
                };

                var jsonContent = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(apiUrl, jsonContent);
                var responseContent = await response.Content.ReadAsStringAsync();

                _logger.LogInformation("API Response Status: {StatusCode}", response.StatusCode);
                _logger.LogInformation("API Response Body: {Response}", responseContent);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("HuggingFace API failed with {StatusCode}, using mock",
                        response.StatusCode);
                    return GetMockSentiment(text);
                }

                // Parse response
                var result = ParseGradioResponse(responseContent);

                if (result.HasValue)
                {
                    _logger.LogInformation("AI Analysis: sentiment={Sentiment}, score={Score}",
                        result.Value.sentiment, result.Value.score);
                    return result.Value;
                }

                _logger.LogWarning("Could not parse API response, using mock");
                return GetMockSentiment(text);
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Timeout calling Hugging Face API");
                return GetMockSentiment(text);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Hugging Face API");
                return GetMockSentiment(text);
            }
        }

        private (string sentiment, double score)? ParseGradioResponse(string jsonResponse)
        {
            try
            {
                var doc = JsonDocument.Parse(jsonResponse);

                // Gradio 4.x format: {"data": [{"sentiment": "positive", "score": 0.99, "scores": {...}}]}
                // or: {"data": ["markdown string"]}
                if (doc.RootElement.TryGetProperty("data", out var dataElement))
                {
                    if (dataElement.ValueKind == JsonValueKind.Array && dataElement.GetArrayLength() > 0)
                    {
                        var firstItem = dataElement[0];

                        // Case 1: Object with sentiment data (API endpoint)
                        if (firstItem.ValueKind == JsonValueKind.Object)
                        {
                            if (firstItem.TryGetProperty("sentiment", out var sentimentProp) &&
                                firstItem.TryGetProperty("score", out var scoreProp))
                            {
                                var sentiment = sentimentProp.GetString()?.ToLower() ?? "neutral";
                                var score = scoreProp.GetDouble();
                                
                                // Log detailed scores if available (new multilingual model)
                                if (firstItem.TryGetProperty("scores", out var scoresProp))
                                {
                                    _logger.LogInformation("Detailed scores: {Scores}", scoresProp.ToString());
                                }
                                
                                return (sentiment, Math.Round(score, 2));
                            }
                        }
                        // Case 2: String (markdown format - web interface response)
                        else if (firstItem.ValueKind == JsonValueKind.String)
                        {
                            var markdown = firstItem.GetString() ?? "";
                            return ParseMarkdownResponse(markdown);
                        }
                    }
                }

                _logger.LogWarning("Unexpected Gradio response format: {Response}", jsonResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing Gradio response: {Response}", jsonResponse);
            }
            return null;
        }

        private (string sentiment, double score)? ParseMarkdownResponse(string markdown)
        {
            try
            {
                // New multilingual model format:
                // "## 😊 Sentiment: **POSITIVE**\n\n### 📊 Confidence: 99.8%\n\n..."
                
                // Try new format first
                var sentimentMatch = System.Text.RegularExpressions.Regex.Match(
                    markdown, @"##\s*[^\s]+\s*Sentiment:\s*\*\*(\w+)\*\*",
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                var scoreMatch = System.Text.RegularExpressions.Regex.Match(
                    markdown, @"###\s*📊\s*Confidence:\s*([\d.]+)%");

                if (sentimentMatch.Success && scoreMatch.Success)
                {
                    var sentiment = sentimentMatch.Groups[1].Value.ToLower();
                    var scorePercent = double.Parse(scoreMatch.Groups[1].Value);
                    var score = scorePercent / 100.0; // Convert percentage to 0-1 range
                    
                    _logger.LogInformation("Parsed from markdown (new format): {Sentiment} ({Score})", 
                        sentiment, score);
                    
                    return (sentiment, Math.Round(score, 2));
                }

                // Try old format as fallback
                // "😊 **Sentiment:** POSITIVE\n\n📊 **Confidence Score:** 0.9998"
                sentimentMatch = System.Text.RegularExpressions.Regex.Match(
                    markdown, @"\*\*Sentiment:\*\*\s*(\w+)",
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                scoreMatch = System.Text.RegularExpressions.Regex.Match(
                    markdown, @"\*\*(?:Confidence\s+)?Score:\*\*\s*([\d.]+)");

                if (sentimentMatch.Success && scoreMatch.Success)
                {
                    var sentiment = sentimentMatch.Groups[1].Value.ToLower();
                    var score = double.Parse(scoreMatch.Groups[1].Value);
                    
                    _logger.LogInformation("Parsed from markdown (old format): {Sentiment} ({Score})", 
                        sentiment, score);
                    
                    return (sentiment, Math.Round(score, 2));
                }
                
                _logger.LogWarning("Could not parse markdown format: {Markdown}", markdown.Substring(0, Math.Min(100, markdown.Length)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing markdown response");
            }
            return null;
        }

        private (string sentiment, double score) GetMockSentiment(string text)
        {
            _logger.LogWarning("⚠️ Using MOCK sentiment analysis (AI API not available)");

            if (string.IsNullOrWhiteSpace(text))
            {
                return ("neutral", 0.50);
            }

            var lowerText = text.ToLower();

            // Enhanced keyword lists with Turkish and English support
            var positiveWords = new[] {
                // English positive
                "good", "great", "happy", "excellent", "wonderful", "amazing",
                "love", "perfect", "best", "awesome", "fantastic", "brilliant",
                "nice", "fine", "beautiful", "superb", "outstanding", "magnificent",
                "delightful", "pleased", "glad", "joyful", "thank", "thanks",
                // Turkish positive
                "güzel", "harika", "mükemmel", "süper", "mutlu", "seviyorum",
                "teşekkür", "teşekkürler", "çok iyi", "bayıldım", "muhteşem",
                "fevkalade", "olağanüstü", "şahane", "müthiş", "harikulade"
            };

            var negativeWords = new[] {
                // English negative
                "bad", "sad", "angry", "terrible", "awful", "hate",
                "worst", "horrible", "disappointing", "poor", "disgusting",
                "annoying", "frustrated", "upset", "unhappy", "depressed",
                "miserable", "pathetic", "useless", "waste", "fail", "failed",
                // Turkish negative
                "kötü", "üzgün", "kızgın", "berbat", "nefret", "berbat",
                "rezalet", "felaket", "bıktım", "sinirliyim", "mutsuz",
                "hüsran", "hayal kırıklığı", "zavallı", "işe yaramaz", "boşa"
            };

            var neutralWords = new[] {
                // English neutral
                "okay", "ok", "fine", "normal", "average", "moderate",
                "acceptable", "adequate", "fair", "standard", "typical",
                // Turkish neutral
                "idare eder", "fena değil", "normal", "orta", "eh işte",
                "olabilir", "şöyle böyle", "ne iyi ne kötü"
            };

            // Count occurrences with word boundary matching
            int positiveCount = positiveWords.Count(word => 
                System.Text.RegularExpressions.Regex.IsMatch(lowerText, $@"\b{word}\b"));
            
            int negativeCount = negativeWords.Count(word => 
                System.Text.RegularExpressions.Regex.IsMatch(lowerText, $@"\b{word}\b"));
            
            int neutralCount = neutralWords.Count(word => 
                System.Text.RegularExpressions.Regex.IsMatch(lowerText, $@"\b{word}\b"));

            // Check for exclamation marks (excitement indicator)
            int exclamationCount = text.Count(c => c == '!');
            
            // Check for emojis (basic detection)
            bool hasPositiveEmoji = text.Contains("😊") || text.Contains("😀") || 
                                   text.Contains("🎉") || text.Contains("❤️") ||
                                   text.Contains("👍") || text.Contains("✨");
            
            bool hasNegativeEmoji = text.Contains("😢") || text.Contains("😞") || 
                                   text.Contains("😠") || text.Contains("😤") ||
                                   text.Contains("👎") || text.Contains("💔");

            bool hasNeutralEmoji = text.Contains("😐") || text.Contains("🤔") ||
                                  text.Contains("😶");

            // Emoji bonuses
            if (hasPositiveEmoji) positiveCount += 2;
            if (hasNegativeEmoji) negativeCount += 2;
            if (hasNeutralEmoji) neutralCount += 1;

            // Calculate scores
            int totalKeywords = positiveCount + negativeCount + neutralCount;

            _logger.LogInformation("Mock analysis: positive={Positive}, negative={Negative}, neutral={Neutral}, exclamations={Exclamations}",
                positiveCount, negativeCount, neutralCount, exclamationCount);

            // Determine sentiment
            if (totalKeywords == 0)
            {
                // No keywords found - analyze text length and punctuation
                if (exclamationCount > 1)
                {
                    return ("positive", 0.65); // Multiple exclamations usually positive
                }
                return ("neutral", 0.50);
            }

            // Calculate ratios
            double positiveRatio = (double)positiveCount / totalKeywords;
            double negativeRatio = (double)negativeCount / totalKeywords;
            double neutralRatio = (double)neutralCount / totalKeywords;

            // Determine dominant sentiment
            if (positiveRatio > negativeRatio && positiveRatio > neutralRatio)
            {
                // Positive sentiment
                double baseScore = 0.60;
                double bonus = Math.Min(positiveCount * 0.08, 0.35);
                double exclamationBonus = Math.Min(exclamationCount * 0.02, 0.05);
                double score = Math.Min(baseScore + bonus + exclamationBonus, 0.98);
                
                return ("positive", Math.Round(score, 2));
            }
            else if (negativeRatio > positiveRatio && negativeRatio > neutralRatio)
            {
                // Negative sentiment
                double baseScore = 0.40;
                double penalty = Math.Min(negativeCount * 0.08, 0.35);
                double score = Math.Max(baseScore - penalty, 0.02);
                
                return ("negative", Math.Round(score, 2));
            }
            else
            {
                // Neutral sentiment
                double score = 0.50;
                
                // Slight adjustment based on other sentiments
                if (positiveCount > negativeCount)
                {
                    score = 0.55 + Math.Min(positiveCount * 0.05, 0.15);
                }
                else if (negativeCount > positiveCount)
                {
                    score = 0.45 - Math.Min(negativeCount * 0.05, 0.15);
                }
                
                return ("neutral", Math.Round(score, 2));
            }
        }
    }
}