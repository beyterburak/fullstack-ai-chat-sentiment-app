------

title: Sentiment Analysis APItitle: Sentiment Analysis API

emoji: 🌍emoji: 🌍

colorFrom: bluecolorFrom: blue

colorTo: cyancolorTo: cyan

sdk: gradiosdk: gradio

sdk_version: 4.44.0sdk_version: 4.44.0

app_file: app.pyapp_file: app.py

pinned: falsepinned: false

license: mitlicense: mit

------



# 🌍 Multilingual Sentiment Analysis API# 🌍 Multilingual Sentiment Analysis API



**AI duygu analizi - 58 dil desteği (Türkçe, İngilizce dahil)****AI-powered sentiment analysis supporting 58+ languages including Turkish and English.**



---## 🚀 Model



## 🚀 Model- **Name:** `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`

- **Type:** XLM-RoBERTa (Cross-lingual)

- **Model:** `cardiffnlp/twitter-xlm-roberta-base-sentiment-multilingual`- **Training Data:** Twitter (casual language)

- **Type:** XLM-RoBERTa (Cross-lingual)- **Classes:** Positive, Neutral, Negative

- **Classes:** Positive, Neutral, Negative- **Accuracy:** ~92% (multilingual test set)

- **Accuracy:** ~92%

## 🌐 Supported Languages

---

Turkish, English, Arabic, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, and 46 more...

## 🌐 Desteklenen Diller

## 📡 API Usage

Turkish, English, Arabic, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean ve 46 dil daha...

### Web Interface

---

https://beyterburak-sentiment-analysis-api.hf.space

## 📡 API Kullanımı

### Programmatic API

### Web Interface

https://beyterburak-sentiment-analysis-api.hf.space```python

from gradio_client import Client

### Python

```pythonclient = Client("https://beyterburak-sentiment-analysis-api.hf.space/")

from gradio_client import Clientresult = client.predict("Bu harika! 🎉", api_name="/analyze")

print(result)

client = Client("https://beyterburak-sentiment-analysis-api.hf.space/")```

result = client.predict("Bu harika! 🎉", api_name="/analyze")

print(result)### cURL

```

```bash

### cURLcurl -X POST https://beyterburak-sentiment-analysis-api.hf.space/call/analyze \

```bash  -H "Content-Type: application/json" \

curl -X POST https://beyterburak-sentiment-analysis-api.hf.space/call/analyze \  -d '{"data": ["Bu harika bir deneyim! 😊"]}'

  -H "Content-Type: application/json" \```

  -d '{"data": ["Bu harika! 😊"]}'

```## 📊 Response Format



---```json

{

## 📊 Response Format  "sentiment": "positive",

  "score": 0.9534,

```json  "scores": {

{    "positive": 0.9534,

  "sentiment": "positive",    "neutral": 0.0321,

  "score": 0.9534,    "negative": 0.0145

  "scores": {  }

    "positive": 0.9534,}

    "neutral": 0.0321,```

    "negative": 0.0145

  }## 🛠️ Local Development

}

``````bash

# Install dependencies

---pip install -r requirements.txt



## 🛠️ Local Development# Run Gradio app

python app.py

```bash```

pip install -r requirements.txt

python app.pyServer starts at: http://127.0.0.1:7860

```
