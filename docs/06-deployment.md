# Deployment Guide

This guide covers deploying the Task Management application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start with Docker

### Option 1: Full Stack with Docker Compose

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AverageAlli/capstone-tech-stack-tutorial.git
   cd capstone-tech-stack-tutorial
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/swagger
   - PostgreSQL: localhost:5432

### Option 2: Manual Setup

1. **Start PostgreSQL**:
   ```bash
   docker run --name tutorial-postgres \
     -e POSTGRES_DB=tutorial_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Run Backend**:
   ```bash
   cd backend/TaskManagementApi
   dotnet restore
   dotnet run
   ```

3. **Run Frontend**:
   ```bash
   cd frontend/task-management-app
   npm install
   npm run dev
   ```

## Docker Compose Configuration

The `docker-compose.yml` file defines three services:

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: tutorial_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend/TaskManagementApi
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Database=tutorial_db;Username=postgres;Password=password"
    ports:
      - "5000:8080"
    depends_on:
      - postgres

  frontend:
    build: ./frontend/task-management-app
    ports:
      - "5173:80"
    depends_on:
      - backend
```

## Environment Variables

### Backend (.NET)

- `ConnectionStrings__DefaultConnection`: PostgreSQL connection string
- `ASPNETCORE_ENVIRONMENT`: Set to `Development` or `Production`

### Frontend (Vue.js)

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Production Deployment

### 1. Environment Setup

Create production environment files:

**Backend** (`appsettings.Production.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-postgres-host;Database=tutorial_db;Username=your-user;Password=your-password;SSL Mode=Require"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=https://your-api-domain.com/api
```

### 2. Docker Production Build

**Backend Dockerfile**:
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["TaskManagementApi.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaskManagementApi.dll"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Cloud Deployment Options

#### Azure Container Instances

1. **Build and push images**:
   ```bash
   # Build images
   docker build -t tutorial-backend ./backend/TaskManagementApi
   docker build -t tutorial-frontend ./frontend/task-management-app
   
   # Tag for Azure Container Registry
   docker tag tutorial-backend youracr.azurecr.io/tutorial-backend:latest
   docker tag tutorial-frontend youracr.azurecr.io/tutorial-frontend:latest
   
   # Push to registry
   docker push youracr.azurecr.io/tutorial-backend:latest
   docker push youracr.azurecr.io/tutorial-frontend:latest
   ```

2. **Deploy to ACI**:
   ```bash
   az container create \
     --resource-group tutorial-rg \
     --name tutorial-app \
     --file docker-compose-azure.yml
   ```

#### AWS ECS

1. **Create task definition**
2. **Set up ECS service**
3. **Configure load balancer**
4. **Set up RDS for PostgreSQL**

#### Google Cloud Run

1. **Build and push to Google Container Registry**
2. **Deploy services to Cloud Run**
3. **Set up Cloud SQL for PostgreSQL**

## Health Checks

### Backend Health Check

Add to `Program.cs`:
```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection"));

app.MapHealthChecks("/health");
```

### Frontend Health Check

Nginx configuration includes health endpoint:
```nginx
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## Monitoring and Logging

### Application Insights (Azure)

Add to backend:
```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

### Logging Configuration

**Structured logging** with Serilog:
```csharp
builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));
```

## Security Considerations

### HTTPS/TLS

- Use HTTPS in production
- Configure TLS termination at load balancer
- Update CORS origins for production domains

### Database Security

- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups

### Environment Variables

- Never commit secrets to version control
- Use Azure Key Vault, AWS Secrets Manager, or similar
- Rotate credentials regularly

## Performance Optimization

### Database

- Connection pooling (configured automatically in EF Core)
- Database indexes on frequently queried columns
- Query optimization

### Frontend

- Gzip compression (configured in nginx)
- Static asset caching
- CDN for static resources

### Backend

- Response compression
- Output caching for read-heavy endpoints
- Connection pooling

## Backup and Recovery

### Database Backup

```bash
# Backup
docker exec tutorial-postgres pg_dump -U postgres tutorial_db > backup.sql

# Restore
docker exec -i tutorial-postgres psql -U postgres tutorial_db < backup.sql
```

### Full System Backup

- Database dumps
- Application configuration
- Container images
- Static assets

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check connection string
   - Verify database is running
   - Check network connectivity

2. **CORS Errors**:
   - Verify frontend URL in CORS configuration
   - Check browser developer tools

3. **Container Won't Start**:
   - Check logs: `docker logs container-name`
   - Verify environment variables
   - Check port conflicts

### Useful Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart backend

# Scale services
docker-compose up -d --scale backend=2

# Stop and remove everything
docker-compose down -v
```

## Cost Optimization

- Use appropriate instance sizes
- Implement auto-scaling
- Monitor resource usage
- Set up billing alerts
- Use reserved instances for predictable workloads