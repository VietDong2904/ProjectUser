using AutoMapper;
using NetCoreUserProject.Models.AuthModel;
using NetCoreUserProject.Models.Dtos;
using NetCoreUserProject.Models.Entities;

namespace NetCoreUserProject.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, RegisterRequest>().ReverseMap();
            CreateMap<User, UserUpdateDto>().ReverseMap();
        }
    }
}
