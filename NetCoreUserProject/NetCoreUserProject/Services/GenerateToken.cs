using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NetCoreUserProject.Models;
using NetCoreUserProject.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NetCoreUserProject.Services
{
    public class GenerateToken
    {
        private readonly JwtConfig _jwtConfig;

        public GenerateToken(IOptions<JwtConfig> jwtConfig)
        {
            _jwtConfig = jwtConfig.Value;
        }

        public string CreateToken(User user)
        {
            var jwtSecurityHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtConfig.Key);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(JwtRegisteredClaimNames.NameId, user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("UserId", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = jwtSecurityHandler.CreateToken(tokenDescriptor);
            return jwtSecurityHandler.WriteToken(token);
        }
    }
}
