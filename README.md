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

1. [Backend Setup](./docs/01-backend-setup.md) - Creating the .NET Web API
2. [Database Configuration](./docs/02-database-setup.md) - PostgreSQL integration
3. [Frontend Setup](./docs/03-frontend-setup.md) - Vue.js application
4. [API Integration](./docs/04-api-integration.md) - Connecting frontend to backend
5. [Authentication](./docs/05-authentication.md) - User authentication flow
6. [Deployment](./docs/06-deployment.md) - Docker and production deployment

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