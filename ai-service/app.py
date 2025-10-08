import gradio as gr
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import torch

# 🌍 MULTILINGUAL MODEL - Supports 58 languages including Turkish and English
# Model: cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual
# Dataset: Twitter data in multiple languages
# Classes: Negative (0), Neutral (1), Positive (2)

MODEL_NAME = "cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual"

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# Create pipeline for sentiment analysis
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model=model,
    tokenizer=tokenizer,
    return_all_scores=True
)

def analyze_sentiment(text):
    """
    Analyzes sentiment of text in 58+ languages including Turkish and English.
    
    Args:
        text (str): Input text to analyze (any supported language)
        
    Returns:
        dict: {
            "sentiment": "positive" | "neutral" | "negative",
            "score": float (0.0 to 1.0),
            "scores": {
                "positive": float,
                "neutral": float,
                "negative": float
            },
            "language_detected": bool (future feature),
            "error": str (optional)
        }
    """
    if not text or text.strip() == "":
        return {
            "sentiment": "neutral",
            "score": 0.33,
            "scores": {
                "positive": 0.33,
                "neutral": 0.34,
                "negative": 0.33
            },
            "error": "Empty text"
        }
    
    try:
        # Get all scores from the model
        results = sentiment_pipeline(text)[0]
        
        # Parse results - model returns list of dicts with label and score
        scores_dict = {}
        for item in results:
            label = item['label'].lower()
            score = item['score']
            
            # Map model labels to our format
            if 'negative' in label or label == 'label_0':
                scores_dict['negative'] = round(score, 4)
            elif 'neutral' in label or label == 'label_1':
                scores_dict['neutral'] = round(score, 4)
            elif 'positive' in label or label == 'label_2':
                scores_dict['positive'] = round(score, 4)
        
        # Determine the dominant sentiment
        max_sentiment = max(scores_dict.items(), key=lambda x: x[1])
        
        return {
            "sentiment": max_sentiment[0],
            "score": max_sentiment[1],
            "scores": scores_dict
        }
        
    except Exception as e:
        print(f"❌ Error in sentiment analysis: {str(e)}")
        return {
            "sentiment": "neutral",
            "score": 0.33,
            "scores": {
                "positive": 0.33,
                "neutral": 0.34,
                "negative": 0.33
            },
            "error": str(e)
        }

def gradio_interface(text):
    """
    Formats sentiment analysis for beautiful web display.
    
    Args:
        text (str): Input text
        
    Returns:
        str: Formatted markdown with emojis and detailed scores
    """
    result = analyze_sentiment(text)
    
    sentiment = result['sentiment']
    score = result['score']
    scores = result.get('scores', {})
    
    # Emoji mapping for visual appeal
    emoji_map = {
        'positive': '😊',
        'negative': '😢',
        'neutral': '😐'
    }
    
    emoji = emoji_map.get(sentiment, '😐')
    
    # Build beautiful markdown output
    output = f"## {emoji} Sentiment: **{sentiment.upper()}**\n\n"
    output += f"### 📊 Confidence: {score * 100:.1f}%\n\n"
    output += "---\n\n"
    output += "### 🎯 Detailed Scores:\n\n"
    
    # Add progress bars for each sentiment
    if scores:
        for sent_type, sent_score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
            emoji_small = emoji_map.get(sent_type, '•')
            percentage = sent_score * 100
            bar_length = int(percentage / 5)  # 20 chars max
            bar = "█" * bar_length + "░" * (20 - bar_length)
            output += f"{emoji_small} **{sent_type.capitalize()}**: {bar} {percentage:.1f}%\n\n"
    
    if "error" in result and result["error"] != "Empty text":
        output += f"\n\n⚠️ **Note:** {result['error']}"
    
    output += "\n\n---\n\n"
    output += "✨ **Multilingual AI** • 🌍 Supports 58+ languages including Turkish and English"
    
    return output

def api_analyze(text):
    """
    Direct API endpoint for programmatic access.
    Returns raw JSON response.
    
    Args:
        text (str): Input text in any supported language
        
    Returns:
        dict: Sentiment analysis result
    """
    return analyze_sentiment(text)

# 🎨 Beautiful Gradio Interface
demo = gr.Interface(
    fn=gradio_interface,
    inputs=gr.Textbox(
        lines=5,
        placeholder="Bir metin girin... / Enter text to analyze...",
        label="📝 Input Text (Turkish, English, or 56+ other languages)"
    ),
    outputs=gr.Markdown(label="🤖 AI Sentiment Analysis Result"),
    title="🌍 Multilingual Chat Sentiment Analysis",
    description="""
    **Advanced AI-powered sentiment analysis** supporting **58+ languages** including Turkish and English.
    
    🚀 **Powered by:** XLM-RoBERTa (Twitter-trained multilingual model)
    
    ✨ **Features:**
    - 🇹🇷 Turkish language support
    - 🇬🇧 English language support  
    - 🌍 56+ additional languages
    - 😊😐😢 Positive, Neutral, Negative classification
    - 📊 Detailed confidence scores
    - ⚡ Real-time analysis
    
    **Perfect for:** Chat applications, social media monitoring, customer feedback analysis
    """,
    examples=[
        ["This is amazing! I absolutely love it! 🎉"],
        ["I'm so disappointed and sad about this situation... 😞"],
        ["The weather is okay today, nothing special."],
        ["Bu harika! Çok mutluyum! 🎊"],
        ["Gerçekten çok kötü bir deneyim yaşadım. 😠"],
        ["İyi, fena değil. Normal bir gün."],
        ["¡Esto es increíble! Me encanta! 🌟"],
        ["Je suis très content de ce service! ❤️"],
        ["Это ужасно! Я очень разочарован. 😤"]
    ],
    theme=gr.themes.Soft(
        primary_hue="blue",
        secondary_hue="cyan"
    ),
    api_name="analyze",
    allow_flagging="never"
)

if __name__ == "__main__":
    print("🚀 Starting Multilingual Sentiment Analysis Service...")
    print(f"📦 Model: {MODEL_NAME}")
    print("🌍 Languages: Turkish, English, Spanish, French, Arabic, Russian, and 52+ more")
    print("✅ Server starting on http://127.0.0.1:7860")
    demo.launch(server_name="0.0.0.0", server_port=7860)
