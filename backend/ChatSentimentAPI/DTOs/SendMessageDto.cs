using System.ComponentModel.DataAnnotations;

namespace ChatSentimentAPI.DTOs
{
    public class SendMessageDto
    {
        [Required(ErrorMessage = "UserId is required.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Content is required.")]
        [StringLength(1000, MinimumLength = 1, ErrorMessage = "Content cannot be longer than 1000 characters.")]
        public string Content { get; set; } = string.Empty;
    }
}
