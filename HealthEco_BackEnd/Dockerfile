# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY HealthEco.API/HealthEco.API.csproj HealthEco.API/
COPY HealthEco.Application/HealthEco.Application.csproj HealthEco.Application/
COPY HealthEco.Infrastructure/HealthEco.Infrastructure.csproj HealthEco.Infrastructure/
COPY HealthEco.Core/HealthEco.Core.csproj HealthEco.Core/

RUN dotnet restore "HealthEco.API/HealthEco.API.csproj"

# Copy everything and build
COPY . .
WORKDIR "/src/HealthEco.API"
RUN dotnet build "HealthEco.API.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "HealthEco.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "HealthEco.API.dll"]