# 🚀 Full-Stack AI Chat Sentiment Analyzer

> **FullStack + AI Stajyer Projesi** - Gerçek zamanlı sohbet ve AI duygu analizi

Kullanıcıların mesajlaşabildiği, her mesajın AI tarafından **pozitif/nötr/negatif** analiz edildiği web + mobil uygulama.

---

## 🌐 Demo Links

| Platform | URL |
|----------|-----|
| **Web App** | [fullstack-ai-chat-sentiment-app.vercel.app](https://fullstack-ai-chat-sentiment-app.vercel.app) |
| **Backend API** | [Swagger Docs](https://fullstack-ai-chat-sentiment-app.onrender.com/swagger) |
| **AI Service** | [HuggingFace Space](https://beyterburak-sentiment-analysis-api.hf.space) |

---

## 🚀 Teknoloji Stack

- **Frontend:** React 18 + Vite + Tailwind CSS → Vercel
- **Backend:** .NET 8 Web API + SQLite + EF Core → Render.com
- **AI Service:** Python Gradio + XLM-RoBERTa (58 dil) → HuggingFace Spaces
- **Mobile:** React Native CLI (Android APK)

---

## ✨ Özellikler

- ✅ **Kullanıcı Girişi:** Sadece nickname ile kayıt
- ✅ **Mesajlaşma:** Gerçek zamanlı mesaj gönderme/listeleme  
- ✅ **AI Duygu Analizi:** Otomatik pozitif/nötr/negatif analiz
- ✅ **58 Dil Desteği:** Türkçe, İngilizce dahil çok dilli
- ✅ **Offline Support:** Mobile app cache mekanizması
- ✅ **İstatistikler:** Kullanıcı ve duygu bazlı raporlar

---

## 🛠️ Kurulum

### Backend (.NET 8)

```bash
cd backend/ChatSentimentAPI
dotnet restore
dotnet ef database update
dotnet run
# API: https://localhost:7211/swagger
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
# Web: http://localhost:5173
```

### AI Service (Python)

```bash
cd ai-service
pip install -r requirements.txt
python app.py
# Gradio: http://127.0.0.1:7860
```

### Mobile (React Native)

```bash
cd mobile
npm install
npm run android
# APK build: npm run build:apk
```

---

## 🤖 AI Araçları Kullanımı

### Elle Yazılan Kod ✍️

**Frontend & Backend tamamına yakını elle yazıldı:**
- React components (ChatRoom, MessageList, Login)
- .NET API controllers
- Database context (EF Core)
- API client (Axios)

### AI ile Yazılan Kod 🤖

**AI Service & Mobile kısımlarında yardım alındı:**
- Python Gradio interface (app.py)
- React Native offline support hooks
- Android native configuration

### Kullanılan AI Araçları

| **GitHub Copilot** |
| **ChatGPT GPT-4.1** |
| **Claude Sonnet 4.5** |
| **Google Gemini 2.0** |
| **DeepSeek** | 

**AI Katkısı:** ~25% (AI Service + Mobile)  
**Elle Yazılan:** ~75% (Frontend + Backend)

---

## 📅 Geliştirme Süreci

**3 günlük plan:**

- **Gün 1:** Backend API + Database + AI model entegrasyonu
- **Gün 2:** Frontend web app + Deployment (Vercel, Render, HF)
- **Gün 3:** Mobile app + APK build + Documentation

### Karşılaşılan Zorluklar

| Zorluk | Çözüm |
|--------|-------|
| Render cold start (50s) | Frontend loading state + retry logic |
| HF Space slow first request | Mock sentiment fallback |
| React Native path length | Project path kısaltma |
| CORS errors | Backend AllowAll CORS policy |

---

## 📚 Dosya Yapısı

```
fullstack-ai-chat/
├── frontend/          # React web app
├── backend/           # .NET 8 API
├── ai-service/        # Python Gradio
└── mobile/            # React Native
```

**Detaylı dokümantasyon:**
- [Backend README](backend/README.md)
- [AI Service README](ai-service/README.md)
- [Mobile README](mobile/README.md)

---

## 👨‍💻 Geliştirici

**Burak Beyter**  
- GitHub: [@beyterburak](https://github.com/beyterburak)
- Repository: [fullstack-ai-chat-sentiment-app](https://github.com/beyterburak/fullstack-ai-chat-sentiment-app)
