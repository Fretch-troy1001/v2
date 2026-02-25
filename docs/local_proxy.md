# Feature Reference: Local Proxy Backend

**Core File:** `server.ts` (Express/Node.js)
**Port:** `3000`
**Dependencies:** `express`, `cors`, `node-fetch`, `tsx`

---

## Purpose

The Local Proxy (or "Backend Engine") serves as a secure gateway between the web frontend and external engineering automation workflows (n8n). It is critical for two reasons:

1. **CORS Bypass**: Modern browsers block frontends from calling n8n webhooks directly if the domains don't match. The proxy, running on Node.js, is not subject to these browser security restrictions.
2. **Endpoint Management**: It abstracts the actual n8n webhook UUIDs, making the frontend code cleaner and more secure.

---

## Architecture

The server behaves as a **Transparent Relay**:
1. **Request**: The React frontend (via `ToolsTab.tsx`) sends a `POST` to `http://localhost:3000/api/submit-[tool]`.
2. **Processing**: The proxy extracts the data (e.g., casing IDs, measurements) and constructs a query string.
3. **Execution**: The proxy fetches data from the hardcoded n8n production URI (DuckDNS).
4. **Response**: The result (often a pre-formatted HTML string or a JSON object) is returned to the browser.

---

## Webhook Call Patterns

```typescript
// Pattern used in server.ts
app.post("/api/submit-valve", async (req, res) => {
  const { casingId, nominalOD } = req.body;
  const targetUrl = `https://troy-n8n.duckdns.org/webhook/...?id=${casingId}&od=${nominalOD}`;
  const response = await fetch(targetUrl);
  const data = await response.text();
  res.send(data);
});
```

---

## Adding New Routes

When a new engineering calculator is added to the **Tools Tab**:
1. **Backend**: Add a new `app.post` route in `server.ts` that points to the specific n8n webhook provided by the automation team.
2. **Frontend**: In the calculator component, ensure the fetch call points to `http://localhost:3000/api/[new-route]`.
3. **Vite Proxy**: Ensure `vite.config.ts` or the development environment is aware that API calls should be routed through port 3000.

---

## Development vs Production
- **Dev**: Run using `tsx server.ts`. This allows hot-reloading and integrated Vite middleware.
- **Prod**: The server is designed to serve the `dist/` folder statically while still exposing the `/api/` endpoints.

---
> [!IMPORTANT]
> Always use `webhook/` (Production) instead of `webhook-test/` (Test) in the `targetUrl` to ensure engineering data is persisted in the official logs.
