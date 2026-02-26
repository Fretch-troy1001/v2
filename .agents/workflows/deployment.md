---
description: Secure deployment and secret management for Vercel.
---

This workflow ensures that deployments to Vercel follow security best practices as outlined in the project directives.

1. Verify that all sensitive keys are excluded from the codebase and stored in `.env` (local) or Vercel Project Secrets (production).
   - Expected keys: `VITE_SUPABASE_URL`, `ANON_KEY`, `GEMINI_API_KEY`.
2. Ensure the BFF (Backend-for-Frontend) Express server is updated if new API endpoints or proxies are needed.
3. Check for any static webhook URLs and verify they are correctly proxied through `server.ts`.
// turbo
4. Run the Vercel deployment:
   - Use `npx vercel --prod` for production deployments or `npx vercel` for previews.
5. Update `docs/changelog.md` and `docs/project_status.md` immediately following a successful deployment.
