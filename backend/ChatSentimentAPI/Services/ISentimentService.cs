namespace ChatSentimentAPI.Services
{
    public interface ISentimentService
    {
        Task<(string sentiment, double score)> AnalyzeSentimentAsync(string text);
    }
}
