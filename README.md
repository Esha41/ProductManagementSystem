# Products Service

Production-grade .NET 8 Products Web API with JWT security, unit/integration tests, React frontend, and an event-driven architecture diagram.

## Solution overview

| Component | Description |
|-----------|-------------|
| `ProductsService.Api` | ASP.NET Core Web API (health, auth, products) |
| `ProductsService.Application` | Business logic and DTOs |
| `ProductsService.Domain` | Domain entities |
| `ProductsService.Infrastructure` | EF Core + SQLite persistence |
| `frontend/products-ui` | React + TypeScript UI |
| `docs/architecture.md` | Event-driven microservices diagram |

## API endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | Anonymous | Health check |
| POST | `/api/auth/login` | Anonymous | Obtain JWT access token |
| GET | `/api/products` | JWT | List all products |
| GET | `/api/products?colour=Red` | JWT | Filter products by colour |
| POST | `/api/products` | JWT | Create a product |

### Demo credentials

- Username: `admin`
- Password: `P@ssw0rd!`

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

## Run locally

### 1. Start the API

```bash
cd src/ProductsService.Api
dotnet run --launch-profile https
```

Swagger UI: `https://localhost:7243/swagger`

### 2. Start the React frontend

```bash
cd frontend/products-ui
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### 3. Run tests

```bash
dotnet test
```

## Architecture

See [docs/architecture.md](docs/architecture.md) for the distributed event-driven architecture diagram showing how Products integrates with Orders, Payments, and an event bus.

## Project structure

```
ProductsService/
├── src/
│   ├── ProductsService.Api/
│   ├── ProductsService.Application/
│   ├── ProductsService.Domain/
│   └── ProductsService.Infrastructure/
├── tests/
│   ├── ProductsService.UnitTests/
│   └── ProductsService.IntegrationTests/
├── frontend/products-ui/
└── docs/
```

## Design decisions

- **Clean architecture** separates domain, application, infrastructure, and API concerns.
- **JWT Bearer authentication** secures product endpoints while keeping health anonymous.
- **SQLite + EF Core** provides lightweight persistence suitable for local development and integration tests.
- **xUnit + FluentAssertions + Moq** cover unit and integration testing.
- **React + Vite** delivers a simple, typed frontend for API consumption.

## GitHub

Push this repository to a public GitHub repo and share the link with the reviewer.

```bash
git init
git add .
git commit -m "Add Products Service coding test solution"
git branch -M main
git remote add origin https://github.com/<your-username>/products-service.git
git push -u origin main
```
