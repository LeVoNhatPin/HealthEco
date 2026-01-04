FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["HealthEco.API/HealthEco.API.csproj", "HealthEco.API/"]
COPY ["HealthEco.Application/HealthEco.Application.csproj", "HealthEco.Application/"]
COPY ["HealthEco.Core/HealthEco.Core.csproj", "HealthEco.Core/"]
COPY ["HealthEco.Infrastructure/HealthEco.Infrastructure.csproj", "HealthEco.Infrastructure/"]

RUN dotnet restore "HealthEco.API/HealthEco.API.csproj"

COPY . .

WORKDIR "/src/HealthEco.API"
RUN dotnet build "HealthEco.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
RUN dotnet publish "HealthEco.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HealthEco.API.dll"]
