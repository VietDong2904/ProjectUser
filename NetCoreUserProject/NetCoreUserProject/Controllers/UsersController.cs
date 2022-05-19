using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NetCoreUserProject.Models;
using NetCoreUserProject.Models.AuthModel;
using NetCoreUserProject.Models.Dtos;
using NetCoreUserProject.Models.Entities;
using NetCoreUserProject.Models.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System;

namespace NetCoreUserProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly JwtConfig _jwtConfig;
        private readonly IMapper _mapper;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager,IOptions<JwtConfig> jwtConfig, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _jwtConfig = jwtConfig.Value;
        }
        [HttpPost("RegisterUser")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                var user = _mapper.Map<User>(registerRequest);
                user.DateCreated = DateTime.UtcNow;
                user.DateModified = DateTime.UtcNow;

                var result = await _userManager.CreateAsync(user, registerRequest.Password);
                if (result.Succeeded)
                {
                    return Ok(new ResponseModel(ResponseCode.Ok, "New user register successful", result));
                }
                return BadRequest(new ResponseModel(ResponseCode.Error, "invalid", result.Errors.Select(x => x.Description).ToList()));
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUserAsync()
        {
            try
            {
                var users = _userManager.Users;
                var usersDto = users.Select(x => new UserDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    UserName = x.UserName,
                    Email = x.Email,
                    DateCreated = x.DateCreated
                }).ToList();
                return Ok(new ResponseModel(ResponseCode.Ok, "New user register successful", usersDto));
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetUserById/{userId}")]
        public async Task<IActionResult> GetUserByIdAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                return Ok(new ResponseModel(ResponseCode.Ok, $"Get user has Id {userId} successful", user));
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("GetUserByUsername/{userName}")]
        public async Task<List<User>> GetUserByUserNameAsync(string userName)
        {
            try
            {
                var users = _userManager.Users;
                var kq = from user in users
                         where user.UserName.ToUpper().Contains(userName.ToUpper().Trim())
                         select user;
                return kq.ToList();
                //var user = await _userManager.FindByNameAsync(userName);
                //return Ok(new ResponseModel(ResponseCode.Ok, $"Get user has Id {userName} successful", kq));
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpPut("UpdateUser/{userId}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<object> PutAsync(string userId, UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                _mapper.Map(userUpdateDto, user);
                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new ResponseModel(ResponseCode.Ok, $"Update user has Id {userId} successful", user));
                }
                return BadRequest(new ResponseModel(ResponseCode.Error, "Error", null));
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpDelete("DeleteUser/{userId}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<object> DeleteAsync(string userId)
        {
            try
            {
                //var test = User.Claims.FirstOrDefault(x => x.Type == "UserId").Value;
                var user = await _userManager.FindByIdAsync(userId);
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new ResponseModel(ResponseCode.Ok, $"Remove user has Id {userId} successful", null));
                }
                return BadRequest(new ResponseModel(ResponseCode.Error, "Error", null));
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }

        [HttpPost("Login")]
        public async Task<object> LoginAsync(LoginRequest loginRequest)
        {
            try
            {
                if (string.IsNullOrEmpty(loginRequest.UserName) || string.IsNullOrEmpty(loginRequest.Password))
                {
                    return BadRequest(new ResponseModel(ResponseCode.Error, "Username or password can not empty", null));
                }
                else
                {
                    var result = await _signInManager.PasswordSignInAsync(loginRequest.UserName, loginRequest.Password, false, false);
                    if (result.Succeeded)
                    {
                        var user = await _userManager.FindByNameAsync(loginRequest.UserName);
                        var userDto = new UserDto() { FullName = user.FullName, Email = user.Email, UserName = user.UserName, Token = CreateToken(user) };

                        return Ok(new ResponseModel(ResponseCode.Ok, "Login successful", userDto));
                    }
                    return BadRequest(new ResponseModel(ResponseCode.Error, "Invalid username or password", null));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseModel(ResponseCode.Error, ex.Message, null));
            }
        }


        [NonAction]
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
