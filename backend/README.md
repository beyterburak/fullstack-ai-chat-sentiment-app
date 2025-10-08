# 🔧 Backend API - .NET 8

> Chat mesaj depolama ve AI duygu analizi entegrasyonu

---

## 🚀 Tech Stack

- .NET 8 Web API
- SQLite + Entity Framework Core
- Swagger/OpenAPI
- Render.com deployment

---

## 🛠️ Kurulum

```bash
cd backend/ChatSentimentAPI
dotnet restore
dotnet ef database update
dotnet run
```

**API:** https://localhost:7211/swagger

---

## 📡 API Endpoints

### Kullanıcı Kaydı
```http
POST /api/users/register
Content-Type: application/json

{
  "nickname": "john_doe"
}
```

### Mesaj Gönder (AI Analizi ile)
```http
POST /api/messages
Content-Type: application/json

{
  "userId": 1,
  "content": "Bu harika! 😊"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "content": "Bu harika! 😊",
  "sentiment": "positive",
  "score": 0.95,
  "timestamp": "2025-10-09T12:34:56Z"
}
```

### Mesajları Getir
```http
GET /api/messages?username=john_doe&limit=50
```

---

## 🗄️ Database

**SQLite schema:**

- **Users:** id, nickname, createdAt
- **Messages:** id, userId, content, sentiment, score, timestamp

```bash
# Migration oluştur
dotnet ef migrations add MigrationName

# Database güncelle
dotnet ef database update
```

---

## 🤖 AI Service Entegrasyonu

**SentimentService.cs:**
- HuggingFace API çağrısı
- Response parsing
- Mock fallback (AI unavailable durumunda)

```csharp
public async Task<(string, double)> AnalyzeSentimentAsync(string text)
{
    var response = await _httpClient.PostAsync(apiUrl, jsonContent);
    return ParseGradioResponse(responseContent).Value;
}
```

---

## 🌍 Deployment (Render.com)

**Build Command:**
```bash
dotnet publish -c Release -o out
```

**Start Command:**
```bash
cd out && dotnet ChatSentimentAPI.dll
```

**Environment Variables:**
```
ASPNETCORE_ENVIRONMENT=Production
HuggingFace__ApiUrl=https://beyterburak-sentiment-analysis-api.hf.space/call/analyze
```

**Live API:** https://fullstack-ai-chat-sentiment-app.onrender.com

---

## 📝 Kod Hakimiyeti

**Elle yazılan dosyalar:**
- `Data/AppDbContext.cs` - Database context
- `Program.cs` - Middleware configuration
- `appsettings.json` - Configuration
