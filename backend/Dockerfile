# Use SDK image to build the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY Ecommerce.sln ./
COPY Ecommerce.API/Ecommerce.API.csproj Ecommerce.API/
COPY Ecommerce.Application/Ecommerce.Application.csproj Ecommerce.Application/
COPY Ecommerce.Domain/Ecommerce.Domain.csproj Ecommerce.Domain/
COPY Ecommerce.Infrastructure/Ecommerce.Infrastructure.csproj Ecommerce.Infrastructure/
COPY Ecommerce.Persistence/Ecommerce.Persistence.csproj Ecommerce.Persistence/

RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish Ecommerce.API/Ecommerce.API.csproj -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Create directory for uploads
RUN mkdir -p /app/wwwroot/uploads

# Expose port (Render/Docker standard)
EXPOSE 8080

ENTRYPOINT ["dotnet", "Ecommerce.API.dll"]
