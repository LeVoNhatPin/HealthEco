# =========================
# BUILD STAGE
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy toàn bộ backend solution
COPY . .

# Restore solution
RUN dotnet restore HealthEco_BackEnd.sln

# Publish API
RUN dotnet publish HealthEco.API/HealthEco.API.csproj -c Release -o /app/publish

# =========================
# RUNTIME STAGE
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "HealthEco.API.dll"]
