using System.ComponentModel.DataAnnotations;

namespace NetCoreUserProject.Models.AuthModel
{
    public class LoginRequest
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
