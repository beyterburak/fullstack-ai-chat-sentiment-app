using ChatSentimentAPI.Data;
using ChatSentimentAPI.DTOs;
using ChatSentimentAPI.Models;
using ChatSentimentAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatSentimentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ISentimentService _sentimentService;
        private readonly ILogger<MessagesController> _logger;

        public MessagesController(
            AppDbContext context,
            ISentimentService sentimentService,
            ILogger<MessagesController> logger)
        {
            _context = context;
            _sentimentService = sentimentService;
            _logger = logger;
        }

        // POST: api/messages
        [HttpPost]
        public async Task<ActionResult<MessageResponseDto>> SendMessage([FromBody] SendMessageDto dto)
        {
            try
            {
                var user = await _context.Users.FindAsync(dto.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                _logger.LogInformation("Analyzing sentiment for message from user {UserId}", dto.UserId);
                var (sentiment, score) = await _sentimentService.AnalyzeSentimentAsync(dto.Content);

                var message = new Message
                {
                    UserId = dto.UserId,
                    Content = dto.Content,
                    Sentiment = sentiment,
                    SentimentScore = score,
                    Timestamp = DateTime.UtcNow
                };

                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Message saved: ID={Id}, Sentiment={Sentiment}, Score={Score}",
                    message.Id, sentiment, score);

                var response = new MessageResponseDto
                {
                    Id = message.Id,
                    UserId = message.UserId,
                    Nickname = user.Nickname,
                    Content = message.Content,
                    Sentiment = message.Sentiment,
                    SentimentScore = message.SentimentScore,
                    Timestamp = message.Timestamp
                };

                return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, new { message = "An error occurred while sending message." });
            }
        }

        // GET: api/messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageResponseDto>>> GetAllMessages(
            [FromQuery] int? userId = null,
            [FromQuery] int limit = 50)
        {
            try
            {
                var query = _context.Messages
                    .Include(m => m.User)
                    .AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(m => m.UserId == userId.Value);
                }

                var messages = await query
                    .OrderByDescending(m => m.Timestamp)
                    .Take(limit)
                    .Select(m => new MessageResponseDto
                    {
                        Id = m.Id,
                        UserId = m.UserId,
                        Nickname = m.User!.Nickname,
                        Content = m.Content,
                        Sentiment = m.Sentiment,
                        SentimentScore = m.SentimentScore,
                        Timestamp = m.Timestamp
                    })
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting messages");
                return StatusCode(500, new { message = "An error occurred while retrieving messages." });
            }
        }

        // GET: api/messages/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageResponseDto>> GetMessage(int id)
        {
            try
            {
                var message = await _context.Messages
                    .Include(m => m.User)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (message == null)
                {
                    return NotFound(new { message = "Message not found." });
                }

                var response = new MessageResponseDto
                {
                    Id = message.Id,
                    UserId = message.UserId,
                    Nickname = message.User!.Nickname,
                    Content = message.Content,
                    Sentiment = message.Sentiment,
                    SentimentScore = message.SentimentScore,
                    Timestamp = message.Timestamp
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting message {MessageId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving message." });
            }
        }

        // DELETE: api/messages/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            try
            {
                var message = await _context.Messages.FindAsync(id);

                if (message == null)
                {
                    return NotFound(new { message = "Message not found." });
                }

                _context.Messages.Remove(message);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Message deleted: ID={Id}", id);

                return Ok(new { message = "Message deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting message {MessageId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting message." });
            }
        }

        // GET: api/messages/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetSentimentStats([FromQuery] int? userId = null)
        {
            try
            {
                var query = _context.Messages.AsQueryable();

                if (userId.HasValue)
                {
                    query = query.Where(m => m.UserId == userId.Value);
                }

                var stats = await query
                    .GroupBy(m => m.Sentiment)
                    .Select(g => new
                    {
                        Sentiment = g.Key,
                        Count = g.Count(),
                        AverageScore = g.Average(m => m.SentimentScore)
                    })
                    .ToListAsync();

                var totalMessages = await query.CountAsync();

                return Ok(new
                {
                    TotalMessages = totalMessages,
                    SentimentBreakdown = stats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sentiment stats");
                return StatusCode(500, new { message = "An error occurred while retrieving stats." });
            }
        }
    }
}