using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AngularApp_Auth.Helpers;
using AngularApp_Auth.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AngularApp_Auth.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
            private readonly UserManager<IdentityUser> _userManager;
            private readonly SignInManager<IdentityUser> _signManager;
            private readonly AppSettings _appSettings;

            public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IOptions<AppSettings> appSettings)
            {
                _userManager = userManager;
                _signManager = signInManager;
                _appSettings = appSettings.Value;
            }

            [HttpPost("[action]")]
            public async Task<IActionResult> Register([FromBody]RegisterViewModel formdata)
            {
                //holding all errors related to registration
                List<string> errorList = new List<string>();

                var user = new IdentityUser
                {
                    Email = formdata.Email,
                    UserName = formdata.Username,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await _userManager.CreateAsync(user, formdata.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "Customer");
                    //Sending confirmation email

                    return Ok(new { username = user.UserName, email = user.Email, status = 1, message = "Registration Successful" });
                }

                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                        errorList.Add(error.Description);
                    }
                }

                return BadRequest(new JsonResult(errorList));

            }


            //Login Method
            [HttpPost("[action]")]
            public async Task<IActionResult> Login([FromBody] LoginViewModel formdata)
            {
                var user = await _userManager.FindByNameAsync(formdata.Username);

                var roles = await _userManager.GetRolesAsync(user);

                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));

                double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);

                if (user != null && await _userManager.CheckPasswordAsync(user, formdata.Password))
                {
                    //confirmation of email
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var tokenDescription = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[] {
                        new Claim(JwtRegisteredClaimNames.Sub, formdata.Username),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.Now.ToString()),
                    }),

                        SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                        Issuer = _appSettings.Site,
                        Audience = _appSettings.Audience,
                        Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                    };

                    //Generate token
                    var token = tokenHandler.CreateToken(tokenDescription);
                    return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, username = user.UserName, userrRole = roles.FirstOrDefault() });

                }

                //return error
                ModelState.AddModelError("", "Usernane/[Password was not Found");
                return Unauthorized(new { LoginError = "Please Check the login Credentials - Invalid Username/Password was entered" });
            }


        
    }
}
