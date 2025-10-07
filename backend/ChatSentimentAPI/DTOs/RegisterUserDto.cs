using System.ComponentModel.DataAnnotations;

namespace ChatSentimentAPI.DTOs
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "Nickname is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Nickname cannot be longer than 50 characters.")]
        public string Nickname { get; set; } = string.Empty;
    }
}
