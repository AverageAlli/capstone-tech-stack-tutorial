using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Models;

namespace TaskManagementApi.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure TaskItem entity
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Index for better query performance
            entity.HasIndex(e => e.IsCompleted);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.Category);
        });

        // Seed some sample data
        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem
            {
                Id = 1,
                Title = "Setup Development Environment",
                Description = "Install and configure .NET, Vue.js, and PostgreSQL",
                Category = "Development",
                Priority = TaskPriority.High,
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new TaskItem
            {
                Id = 2,
                Title = "Learn Vue.js Composition API",
                Description = "Study Vue 3 Composition API and best practices",
                Category = "Learning",
                Priority = TaskPriority.Medium,
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            },
            new TaskItem
            {
                Id = 3,
                Title = "Implement User Authentication",
                Description = "Add JWT-based authentication to the API",
                Category = "Development",
                Priority = TaskPriority.High,
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}