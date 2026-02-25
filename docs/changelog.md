# Changelog — GNPD Turbine Systems Webapp

> **Instructions for Claude:** Append a new entry here whenever you finish implementing a feature or fixing a significant bug. Use the format below. Keep entries concise — one line per change is enough.

---

## [Unreleased / Current]

### Added
- **Daily Feeds System** — Implemented a glossy, magazine-style Daily Feeds dashboard replacing the older layout. Includes a rich post composer allowing text input and Base64 image attachment.
- **Production Deployment** — Successfully deployed the app to Vercel with environment variable protection and secure API proxying.
- **Authentication & Security** — Integrated Supabase Auth with public/secret key isolation. Implemented auto-confirmed engineer accounts.
- **Local Deployment** — Verified local server health at port 3000 and established the "Engineer Learning Log" for snag tracking.
- **Supabase Integration** — Fully integrated frontend and backend with a Supabase PostgreSQL instance. Added initialization scripts (`init-feeds.sql`, `seed-icv.ts`).
- **Live Webhooks** — Migrated engineering calculation tools from test endpoints (`webhook-test`) to live n8n production endpoints (`webhook`).
- **Interactive Valve Diagrams** — Added interactive hotspots mapping to specific hardware components using Supabase coordinates and static overlay mapping.
- **AI Integration Context** — Tested NotebookLM MCP automated report generation and direct pipeline insertion into the Daily Feeds system.
- **CLAUDE.md** — Created permanent Claude session memory file in project root.
- **docs/ folder** — Structured documentation split into `architecture.md`, `changelog.md`, `project_status.md`, and feature-specific reference docs.
- **.env.example** — Recreated environment variable template covering all 8 env vars grouped by usage context.

### Changed
- **Branding Overhaul** — Complete replacement of the legacy "Nexus" branding with the official "GNPD" branding. Renamed tabs ("Daily Diary" → "Daily Feeds").
- **UI/UX** — Extensive style overhaul adopting an Apple-like premium design language: Framer Motion, glassmorphism (`backdrop-blur`), subtle glowing gradients, `Outward` / `Inter` typography.

### Fixed
- Resolved localhost port assignment issues — app now runs on `:3000` (Express) not `:5173` (Vite default).
- Fixed Supabase connection warnings by prefixing environment variables with `VITE_` for client-side access.

---

## [Template for Future Entries]

```
## [YYYY-MM-DD] or [Feature Name]

### Added
- Short description of new feature or capability.

### Changed
- Short description of what was modified and why.

### Fixed
- Short description of bug fixed.
```
