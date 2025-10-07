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

                // Gradio format: {"data": [{"sentiment": "positive", "score": 0.99, ...}]}
                if (doc.RootElement.TryGetProperty("data", out var dataElement))
                {
                    if (dataElement.ValueKind == JsonValueKind.Array && dataElement.GetArrayLength() > 0)
                    {
                        var firstItem = dataElement[0];

                        // firstItem could be an object or a string
                        if (firstItem.ValueKind == JsonValueKind.Object)
                        {
                            if (firstItem.TryGetProperty("sentiment", out var sentimentProp) &&
                                firstItem.TryGetProperty("score", out var scoreProp))
                            {
                                var sentiment = sentimentProp.GetString()?.ToLower() ?? "neutral";
                                var score = scoreProp.GetDouble();
                                return (sentiment, Math.Round(score, 2));
                            }
                        }
                        else if (firstItem.ValueKind == JsonValueKind.String)
                        {
                            // Bazen string olarak markdown dönebilir, onu parse edelim
                            var markdown = firstItem.GetString() ?? "";
                            return ParseMarkdownResponse(markdown);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing Gradio response");
            }
            return null;
        }

        private (string sentiment, double score)? ParseMarkdownResponse(string markdown)
        {
            try
            {
                // Markdown format: "😊 **Sentiment:** POSITIVE\n\n📊 **Confidence Score:** 0.9998"
                var sentimentMatch = System.Text.RegularExpressions.Regex.Match(
                    markdown, @"\*\*Sentiment:\*\*\s*(\w+)",
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                var scoreMatch = System.Text.RegularExpressions.Regex.Match(
                    markdown, @"\*\*(?:Confidence\s+)?Score:\*\*\s*([\d.]+)");

                if (sentimentMatch.Success && scoreMatch.Success)
                {
                    var sentiment = sentimentMatch.Groups[1].Value.ToLower();
                    var score = double.Parse(scoreMatch.Groups[1].Value);
                    return (sentiment, Math.Round(score, 2));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing markdown response");
            }
            return null;
        }

        private (string sentiment, double score) GetMockSentiment(string text)
        {
            _logger.LogInformation("Using MOCK sentiment analysis (fallback)");

            var lowerText = text.ToLower();

            var positiveWords = new[] {
                "good", "great", "happy", "excellent", "wonderful", "amazing",
                "love", "perfect", "best", "awesome", "fantastic", "brilliant",
                "güzel", "harika", "mükemmel", "süper", "mutlu", "seviyorum",
                "ok", "fine", "nice", "gonna"
            };

            var negativeWords = new[] {
                "bad", "sad", "angry", "terrible", "awful", "hate",
                "worst", "horrible", "disappointing", "poor", "disgusting",
                "kötü", "üzgün", "kızgın", "berbat", "nefret"
            };

            int positiveCount = positiveWords.Count(word => lowerText.Contains(word));
            int negativeCount = negativeWords.Count(word => lowerText.Contains(word));

            if (positiveCount > negativeCount)
            {
                double score = Math.Min(0.7 + (positiveCount * 0.1), 0.99);
                return ("positive", Math.Round(score, 2));
            }
            else if (negativeCount > positiveCount)
            {
                double score = Math.Max(0.3 - (negativeCount * 0.1), 0.01);
                return ("negative", Math.Round(score, 2));
            }
            else
            {
                return ("neutral", 0.5);
            }
        }
    }
}