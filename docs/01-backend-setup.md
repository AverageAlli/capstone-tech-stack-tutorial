# Backend Setup - .NET Web API

This guide walks you through setting up the .NET Web API backend for the Task Management application.

## Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- Code editor (Visual Studio, VS Code, or JetBrains Rider)

## Project Structure

```
backend/TaskManagementApi/
├── Controllers/
│   └── TasksController.cs          # REST API endpoints
├── Data/
│   └── TaskDbContext.cs           # Entity Framework context
├── Models/
│   └── TaskItem.cs                # Data models
├── Program.cs                     # Application entry point
├── TaskManagementApi.csproj       # Project file with dependencies
└── appsettings.json              # Configuration
```

## Step 1: Create the Project

```bash
cd backend
dotnet new webapi -n TaskManagementApi
cd TaskManagementApi
```

## Step 2: Add Required Packages

Add the following NuGet packages to support PostgreSQL, Entity Framework, and authentication:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package Swashbuckle.AspNetCore
```

Or update your `.csproj` file:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.9" />
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.0" />
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.1" />
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.9" />
  <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="8.2.0" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="7.1.0" />
</ItemGroup>
```

## Step 3: Configure Database Connection

Update `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=tutorial_db;Username=postgres;Password=password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

## Step 4: Create the Data Model

Define your task entity in `Models/TaskItem.cs`:

```csharp
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
```

## Step 5: Set Up Entity Framework Context

Create `Data/TaskDbContext.cs`:

```csharp
public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options) : base(options)
    {
    }

    public DbSet<TaskItem> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure entity properties and relationships
        // Add indexes for performance
        // Seed sample data
    }
}
```

## Step 6: Configure Services in Program.cs

Update `Program.cs` to configure services:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173", "http://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add OpenAPI/Swagger
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Step 7: Create API Controller

Implement CRUD operations in `Controllers/TasksController.cs`:

```csharp
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    // GET: api/tasks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    
    // GET: api/tasks/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    
    // POST: api/tasks
    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
    
    // PUT: api/tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem task)
    
    // DELETE: api/tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
}
```

## Step 8: Database Setup

1. **Start PostgreSQL** (using Docker):
   ```bash
   docker run --name tutorial-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE tutorial_db;
   ```

3. **Run the Application**:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```

The database will be created automatically when the application starts.

## Step 9: Test the API

1. **Access Swagger UI**: http://localhost:5000/swagger
2. **Test endpoints**:
   - GET `/api/tasks` - List all tasks
   - POST `/api/tasks` - Create a new task
   - GET `/api/tasks/{id}` - Get a specific task
   - PUT `/api/tasks/{id}` - Update a task
   - DELETE `/api/tasks/{id}` - Delete a task

## API Features

- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Filtering**: Filter tasks by completion status, category, and priority
- **Statistics**: Get task completion statistics
- **Categories**: List available task categories
- **Validation**: Model validation with data annotations
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Configured for frontend integration
- **OpenAPI Documentation**: Auto-generated API documentation

## Next Steps

1. [Database Configuration](./02-database-setup.md)
2. [Frontend Setup](./03-frontend-setup.md)
3. [API Integration](./04-api-integration.md)