# Capstone Tech Stack Tutorial

A comprehensive tutorial for building a full-stack application using .NET, Vue.js, and PostgreSQL.

## Tech Stack Overview

This tutorial demonstrates how to build a modern web application using:

- **Backend**: [.NET 9.0](https://dotnet.microsoft.com/en-us/) - Cross-platform framework for building APIs
- **Frontend**: [Vue.js 3](https://vuejs.org/) - Progressive JavaScript framework for building user interfaces  
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Advanced open-source relational database

## Project Structure

```
capstone-tech-stack-tutorial/
├── backend/              # .NET Web API project
├── frontend/             # Vue.js application
├── database/             # PostgreSQL scripts and migrations
├── docker/               # Docker configuration files
└── docs/                 # Additional documentation
```

## Quick Start

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

### Getting Started

**🚀 For detailed setup instructions, see [Getting Started Guide](./docs/00-getting-started.md)**

**Quick Docker Setup:**
```bash
git clone https://github.com/AverageAlli/capstone-tech-stack-tutorial.git
cd capstone-tech-stack-tutorial
docker-compose up -d
```

**Manual Setup:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/AverageAlli/capstone-tech-stack-tutorial.git
   cd capstone-tech-stack-tutorial
   ```

2. **Set up the database**
   ```bash
   # Start PostgreSQL (if using Docker)
   docker run --name tutorial-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   
   # Or use your local PostgreSQL installation
   # Create database: tutorial_db
   ```

3. **Run the backend**
   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```

4. **Run the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/swagger

## What You'll Learn

- Setting up a .NET Web API with Entity Framework Core
- Creating a responsive Vue.js frontend with Composition API
- Connecting PostgreSQL database with proper migrations
- Implementing CRUD operations across the full stack
- API authentication and authorization
- Frontend state management with Pinia
- Containerizing the application with Docker
- Best practices for full-stack development

## Tutorial Sections

📚 **Complete Learning Path:**

1. [**Getting Started**](./docs/00-getting-started.md) - Complete setup guide with troubleshooting
2. [**Backend Setup**](./docs/01-backend-setup.md) - Creating the .NET Web API
3. [**Frontend Setup**](./docs/03-frontend-setup.md) - Vue.js application development
4. [**Deployment**](./docs/06-deployment.md) - Docker and production deployment

### Quick Reference

- **Backend Development**: Detailed .NET Web API creation with PostgreSQL
- **Frontend Development**: Modern Vue.js with TypeScript and Pinia
- **Database Integration**: Entity Framework Core with PostgreSQL
- **Containerization**: Complete Docker setup for all services
- **Production Ready**: CORS, error handling, validation, and documentation

## Sample Application

This tutorial builds a **Task Management System** that demonstrates:
- User registration and authentication
- CRUD operations for tasks
- Real-time updates
- Responsive design
- RESTful API design

## Contributing

Feel free to submit issues and pull requests to improve this tutorial.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.