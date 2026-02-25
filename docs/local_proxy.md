# Local Proxy Backend (`server.ts`)

## Rationale
The application uses a local Node/Express proxy backend to solve two main issues:
1. **CORS Isolation**: Browsers often block direct cross-domain requests to n8n webhooks. The proxy acts as a trusted middleman.
2. **Credential Obfuscation**: It keeps sensitive webhook URLs and API patterns hidden within the backend environment.

## Design
The server runs on port `3000` (differentiating it from the standard Vite port `5173`).

## Webhook Calling Pattern
Endpoints in the server (e.g., `/api/submit-valve`) follow this logic:
1. Extract request body params.
2. Format them into query strings.
3. Call the external production n8n webhook via `node-fetch`.
4. Return the data payload as sanitized HTML or JSON to the React frontend.

## Adding New Routes
To add a new tool or calculator:
1. Define a new endpoint in `server.ts`.
2. Map it to the corresponding n8n production webhook string.
3. Export the endpoint for use by the frontend UI components.

---
> [!IMPORTANT]
> Ensure the development server is always started via `tsx server.ts` (proxied dev command) as defined in `package.json`.
