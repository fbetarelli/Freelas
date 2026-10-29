# API reference

This is the API documentation entry point. Open [the Redoc reference](./openapi/reference.html) directly from this checkout to browse routes, parameters, schemas, statuses, and examples offline. The [OpenAPI JSON](./openapi/openapi.json) is the machine-readable source for other tools. With Node.js 24 or newer, regenerate both artifacts and this route index with `npm run docs:build -w apps/api` from the repository root.

The HTML is a read-only explorer and does not connect to an API endpoint. Login sets a JWT in an `HttpOnly` cookie named `token`; browsers send that cookie on protected requests. The OpenAPI security scheme describes this cookie, but this offline page does not need an Authorize value.

Error responses are documented by status and the `{ "message": string }` shape. Message text is not a stable API contract.

## Routes

### auth

| Method | Path | Summary | Auth |
|---|---|---|---|
| POST | `/login` | Log in | Public |
| POST | `/register` | Register an account | Public |
| POST | `/logout` | Log out | Public |

### user

| Method | Path | Summary | Auth |
|---|---|---|---|
| GET | `/me` | Get the current user | Cookie |
| PATCH | `/edit-user` | Edit the current user | Cookie |

### clients

| Method | Path | Summary | Auth |
|---|---|---|---|
| GET | `/clients` | List clients | Cookie |
| POST | `/clients` | Create a client | Cookie |
| GET | `/clients/{id}` | Get a client | Cookie |
| PATCH | `/clients/{id}` | Edit a client | Cookie |
| DELETE | `/clients/{id}` | Delete a client | Cookie |

### jobs

| Method | Path | Summary | Auth |
|---|---|---|---|
| GET | `/clients/{id}/jobs` | List jobs for a client | Cookie |
| POST | `/clients/{id}/jobs` | Create a job for a client | Cookie |
| GET | `/jobs` | List jobs | Cookie |
| GET | `/jobs/{id}` | Get a job | Cookie |
| PATCH | `/jobs/{id}` | Edit a job | Cookie |
| DELETE | `/jobs/{id}` | Delete a job | Cookie |

### materials

| Method | Path | Summary | Auth |
|---|---|---|---|
| GET | `/jobs/{id}/materials` | List materials for a job | Cookie |
| POST | `/jobs/{id}/materials` | Add material to a job | Cookie |
| PATCH | `/materials/{id}` | Edit material | Cookie |
| DELETE | `/materials/{id}` | Delete material | Cookie |

### payments

| Method | Path | Summary | Auth |
|---|---|---|---|
| GET | `/jobs/{id}/payments` | List payments for a job | Cookie |
| POST | `/jobs/{id}/payments` | Add payment to a job | Cookie |
| PATCH | `/payment/{id}` | Edit payment | Cookie |
| DELETE | `/payment/{id}` | Delete payment | Cookie |

### dashboard

| Method | Path | Summary | Auth |
|---|---|---|---|
| GET | `/dashboard` | Get dashboard data | Cookie |

## Examples

These illustrative values are generated from examples in the OpenAPI document. IDs and dates are sample data.

### Register an account

`POST /register` request:

```json
{
  "username": "Ada Lovelace",
  "login": "ada@example.com",
  "password": "secure-pass"
}
```

`201` response:

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "username": "Ada Lovelace",
  "login": "ada@example.com"
}
```

### Create a client

`POST /clients` request:

```json
{
  "name": "Acme",
  "address": "123 Main Street",
  "contact": "555-0100"
}
```

`201` response:

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "name": "Acme",
  "address": "123 Main Street",
  "contact": "555-0100",
  "userId": "11111111-1111-4111-8111-111111111111"
}
```

### Create a job for a client

`POST /clients/{id}/jobs` request:

```json
{
  "jobDate": "2026-01-15",
  "descr": "Website design",
  "payed": false,
  "totalValue": 250
}
```

`201` response:

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "jobDate": "15/01/2026",
  "descr": "Website design",
  "payed": "Aguardando Pagamento",
  "totalValue": "250,00",
  "clientId": "22222222-2222-4222-8222-222222222222",
  "userId": "11111111-1111-4111-8111-111111111111"
}
```
