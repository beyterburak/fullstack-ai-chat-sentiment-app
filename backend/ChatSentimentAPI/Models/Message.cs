namespace ChatSentimentAPI.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string Sentiment { get; set; } = "neutral"; // positive, negative, neutral
        public double SentimentScore { get; set; } = 0.0;
        public DateTime Timestamp { get; set; }

        public User? User { get; set; }
    }
}
