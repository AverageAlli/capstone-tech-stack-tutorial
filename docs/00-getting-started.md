# Getting Started - Complete Setup Guide

This guide provides step-by-step instructions to get the complete Task Management application running on your local machine.

## 🚀 Quick Start

### Prerequisites Checklist

- [ ] [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [ ] [Node.js 18+](https://nodejs.org/)
- [ ] [PostgreSQL 15+](https://www.postgresql.org/download/) or [Docker](https://www.docker.com/)
- [ ] [Git](https://git-scm.com/)

### Option 1: Docker Setup (Recommended)

The fastest way to get started is using Docker:

```bash
# 1. Clone the repository
git clone https://github.com/AverageAlli/capstone-tech-stack-tutorial.git
cd capstone-tech-stack-tutorial

# 2. Start all services with Docker Compose
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/swagger
```

### Option 2: Manual Setup

If you prefer to run each component separately:

#### Step 1: Database Setup

**Using Docker (Recommended):**
```bash
docker run --name tutorial-postgres \
  -e POSTGRES_DB=tutorial_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

**Using Local PostgreSQL:**
```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE tutorial_db;
```

#### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend/TaskManagementApi

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run
```

The backend will be available at:
- API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

#### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend/task-management-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## 🧪 Testing the Application

### 1. API Testing

Use the Swagger UI at http://localhost:5000/swagger to test API endpoints:

1. **GET /api/tasks** - List all tasks (should return sample data)
2. **POST /api/tasks** - Create a new task:
   ```json
   {
     "title": "My First Task",
     "description": "Testing the API",
     "priority": 2,
     "category": "Testing"
   }
   ```
3. **GET /api/tasks/stats** - View task statistics

### 2. Frontend Testing

1. Open http://localhost:5173
2. You should see the Task Management interface
3. Try creating a new task using the "+ Add Task" button
4. Test editing and deleting tasks
5. Use the filters to filter tasks by status and category

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js 3      │    │   .NET 9.0      │    │  PostgreSQL 15  │
│   Frontend      │───▶│   Web API       │───▶│   Database      │
│   (Port 5173)   │    │   (Port 5000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack Components

**Frontend (Vue.js)**
- Vue 3 with Composition API
- TypeScript for type safety
- Pinia for state management
- Axios for API communication
- Responsive CSS design

**Backend (.NET)**
- ASP.NET Core Web API
- Entity Framework Core for data access
- PostgreSQL with Npgsql provider
- Swagger/OpenAPI documentation
- CORS enabled for frontend integration

**Database (PostgreSQL)**
- Task storage with relationships
- Indexes for performance
- Sample data for testing

## 📁 Project Structure

```
capstone-tech-stack-tutorial/
├── README.md                       # Main documentation
├── docker-compose.yml              # Docker orchestration
├── backend/
│   └── TaskManagementApi/
│       ├── Controllers/             # API endpoints
│       ├── Models/                  # Data models
│       ├── Data/                    # Database context
│       └── Program.cs               # Application setup
├── frontend/
│   └── task-management-app/
│       ├── src/
│       │   ├── components/          # Vue components
│       │   ├── stores/              # Pinia stores
│       │   ├── services/            # API services
│       │   ├── types/               # TypeScript types
│       │   └── views/               # Page components
│       └── .env                     # Environment config
├── database/
│   └── init.sql                     # Database initialization
└── docs/
    ├── 01-backend-setup.md          # Backend guide
    ├── 03-frontend-setup.md         # Frontend guide
    └── 06-deployment.md             # Deployment guide
```

## 🔧 Development Workflow

### Backend Development

```bash
# Run with hot reload
dotnet watch run

# Run tests (if you add them)
dotnet test

# Format code
dotnet format
```

### Frontend Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Database Management

```bash
# Connect to database
docker exec -it tutorial-postgres psql -U postgres -d tutorial_db

# View tables
\dt

# Query tasks
SELECT * FROM "Tasks";
```

## 🌟 Key Features

### Task Management
- ✅ Create, read, update, delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Set task priorities (Low, Medium, High, Critical)
- ✅ Organize tasks by categories
- ✅ Set due dates

### User Interface
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time task statistics
- ✅ Filter tasks by status and category
- ✅ Modal forms for task creation/editing
- ✅ Visual priority indicators

### Technical Features
- ✅ RESTful API design
- ✅ Type-safe TypeScript
- ✅ Reactive state management
- ✅ Error handling and loading states
- ✅ API documentation with Swagger
- ✅ CORS configuration
- ✅ Docker containerization

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error:**
```
Failed to connect to 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running and connection string is correct.

**CORS Error in Browser:**
```
Access to XMLHttpRequest at 'http://localhost:5000' blocked by CORS policy
```
**Solution:** Verify frontend URL is included in CORS configuration in `Program.cs`.

**Frontend Build Errors:**
```
Cannot find module '@/types/task'
```
**Solution:** Check file paths and TypeScript configuration.

### Getting Help

1. Check the [documentation](./docs/) for detailed guides
2. Review error messages in browser console and terminal
3. Verify all services are running on correct ports
4. Check Docker logs: `docker-compose logs -f`

## 🎯 Next Steps

### Learning Path

1. **Explore the Code**: Understand how components interact
2. **Add Features**: Try implementing new functionality
3. **Learn Patterns**: Study the architecture patterns used
4. **Deploy**: Try deploying to a cloud platform

### Suggested Enhancements

- Add user authentication with JWT
- Implement real-time updates with SignalR
- Add task attachments and comments
- Create a mobile app version
- Add email notifications
- Implement task sharing between users

### Additional Resources

- [Vue.js Documentation](https://vuejs.org/guide/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy coding! 🎉**

If you found this tutorial helpful, please consider giving it a star on GitHub and sharing it with others who might benefit from learning about full-stack development with .NET, Vue.js, and PostgreSQL.