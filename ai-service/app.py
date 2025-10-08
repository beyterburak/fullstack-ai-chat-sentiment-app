import gradio as gr
from transformers import pipeline

# Lightweight and fast sentiment analysis model - optimized for real-time chat applications
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_sentiment(text):
    """
    Analyzes the sentiment of given text and returns emotion result.
    
    Args:
        text (str): Input text to analyze
        
    Returns:
        dict: Contains sentiment label, confidence score, and optional error message
    """
    if not text or text.strip() == "":
        return {
            "sentiment": "neutral",
            "score": 0.5,
            "error": "Empty text"
        }
    
    try:
        # Get prediction from the model
        result = sentiment_pipeline(text)[0]
        
        label = result['label'].lower()
        score = result['score']
        
        # Map model labels to our standardized format
        if 'pos' in label:
            sentiment = 'positive'
        elif 'neg' in label:
            sentiment = 'negative'
            score = 1.0 - score  # Invert score for negative sentiment to maintain consistency
        else:
            sentiment = 'neutral'
        
        return {
            "sentiment": sentiment,
            "score": round(score, 4)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "sentiment": "neutral",
            "score": 0.5,
            "error": str(e)
        }

def gradio_interface(text):
    """
    Formats sentiment analysis result for web interface display.
    
    Args:
        text (str): Input text to analyze
        
    Returns:
        str: Formatted markdown output with emoji and sentiment information
    """
    result = analyze_sentiment(text)
    
    sentiment = result['sentiment']
    score = result['score']
    
    # Add appropriate emoji for visual feedback
    emoji_map = {
        'positive': '😊',
        'negative': '😞',
        'neutral': '😐'
    }
    
    emoji = emoji_map.get(sentiment, '😐')
    
    output = f"{emoji} **Sentiment:** {sentiment.upper()}\n\n"
    output += f"📊 **Confidence Score:** {score}"
    
    if "error" in result and result["error"] != "Empty text":
        output += f"\n\n⚠️ Note: {result['error']}"
    
    return output

def api_analyze(text):
    """
    Direct API endpoint function that returns raw JSON response.
    This function can be called programmatically by external services.
    
    Args:
        text (str): Input text to analyze
        
    Returns:
        dict: Raw sentiment analysis result in JSON format
    """
    return analyze_sentiment(text)

# Gradio web interface configuration
demo = gr.Interface(
    fn=gradio_interface,
    inputs=gr.Textbox(
        lines=3,
        placeholder="Enter text to analyze sentiment...",
        label="Input Text"
    ),
    outputs=gr.Markdown(label="Sentiment Analysis Result"),
    title="🤖 AI Chat Sentiment Analysis Service",
    description="Real-time sentiment analysis powered by DistilBERT transformer model. Designed for chat applications with fast response times and multilingual support.",
    examples=[
        ["This is amazing! I love it!"],
        ["I'm so sad and disappointed."],
        ["The weather is okay today."],
        ["This product is terrible, worst purchase ever!"],
        ["Great service, highly recommend!"],
        ["Bu harika!"],
        ["Çok kötü bir deneyim."]
    ],
    theme=gr.themes.Soft(),
    api_name="analyze"
)

if __name__ == "__main__":
    demo.launch()