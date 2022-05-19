namespace NetCoreUserProject.Models.Dtos
{
    public class UserDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime DateCreated { get; set; }

        public string Token { get; set; }
    }
}
