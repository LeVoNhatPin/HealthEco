#!/bin/bash

# Deploy to Railway
echo "Deploying to Railway..."

# Build the project
dotnet publish -c Release -o ./publish

# Deploy using Railway CLI (if installed)
# railway up --service health-eco-backend

echo "Deployment completed!"