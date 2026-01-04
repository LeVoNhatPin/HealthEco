using Microsoft.EntityFrameworkCore;
using HealthEco.Core.Entities;
using HealthEco.Core.Entities.Enums;

namespace HealthEco.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Role)
                    .HasConversion<string>()
                    .HasMaxLength(20);
            });
        }
    }
}