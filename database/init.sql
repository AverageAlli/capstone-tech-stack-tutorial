-- PostgreSQL setup script for Task Management Tutorial
-- This script creates the database and initial schema

-- Create database (run this as postgres superuser)
-- CREATE DATABASE tutorial_db;

-- Connect to tutorial_db and run the following:

-- Create tasks table (this will be handled by Entity Framework migrations)
-- But here's the manual schema for reference:

/*
CREATE TABLE IF NOT EXISTS Tasks (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(1000),
    "IsCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompletedAt" TIMESTAMP WITH TIME ZONE,
    "Priority" INTEGER NOT NULL DEFAULT 2,
    "Category" VARCHAR(50),
    "DueDate" TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "IX_Tasks_IsCompleted" ON "Tasks" ("IsCompleted");
CREATE INDEX IF NOT EXISTS "IX_Tasks_CreatedAt" ON "Tasks" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_Tasks_Category" ON "Tasks" ("Category");

-- Insert sample data
INSERT INTO "Tasks" ("Title", "Description", "Category", "Priority", "CreatedAt") VALUES
('Setup Development Environment', 'Install and configure .NET, Vue.js, and PostgreSQL', 'Development', 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('Learn Vue.js Composition API', 'Study Vue 3 Composition API and best practices', 'Learning', 2, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('Implement User Authentication', 'Add JWT-based authentication to the API', 'Development', 3, CURRENT_TIMESTAMP);
*/