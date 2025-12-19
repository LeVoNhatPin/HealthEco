# Dockerfile mới - ĐƠN GIẢN, KHÔNG CACHE
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy TOÀN BỘ project thay vì từng file
COPY . .

# Restore dependencies (sẽ restore tất cả projects)
RUN dotnet restore

# Publish chỉ API project
RUN dotnet publish "HealthEco.API/HealthEco.API.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "HealthEco.API.dll"]