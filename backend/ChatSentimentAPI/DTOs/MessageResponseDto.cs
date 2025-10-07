namespace ChatSentimentAPI.DTOs
{
    public class MessageResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Nickname { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Sentiment { get; set; } = string.Empty;
        public double SentimentScore { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
