using AngularApp_Auth.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularApp_Auth.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        //Creating Roles for our Application 
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(
                new { Id = "1", Name = "Admin", NormalizeName = "ADMIN" },
                new { Id = "2", Name = "Customer", NormalizeName = "CUSTOMER" },
                new { Id = "3", Name = "Moderator", NormalizeName = "MODERATOR" }
                );
        }

        public DbSet<ProductModel> Products { get; set; }
    }
}
