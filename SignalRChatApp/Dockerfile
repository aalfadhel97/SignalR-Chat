# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copy the project file and restore dependencies
COPY SignalRChatApp/*.csproj ./SignalRChatApp/
WORKDIR /app/SignalRChatApp
RUN dotnet restore

# Copy the remaining source code and build the app
COPY SignalRChatApp/. ./
RUN dotnet publish -c Release -o /app/publish

# Use the official ASP.NET Core runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "SignalRChatApp.dll"]