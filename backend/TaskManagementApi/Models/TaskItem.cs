using System.ComponentModel.DataAnnotations;

namespace TaskManagementApi.Models;

public class TaskItem
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    public bool IsCompleted { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedAt { get; set; }
    
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    
    [StringLength(50)]
    public string? Category { get; set; }
    
    public DateTime? DueDate { get; set; }
}

public enum TaskPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}