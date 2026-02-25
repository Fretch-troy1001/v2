# Changelog

All notable changes to the Turbine Systems Webapp are documented in this file.

## [Unreleased / Current]

### Added
*   **Daily Feeds System**: Implemented a glossy, magazine-style "Daily Feeds" dashboard replacing the older layout. Includes a rich post composer allowing text input and Base64 image attachment.
*   **Supabase Integration**: Fully integrated frontend and backend with a Supabase PostgreSQL instance. Added initialization scripts (`init-feeds.sql`, `seed-icv.ts`).
*   **Live Webhooks**: Migrated engineering calculation tools from test endpoints (`webhook-test`) to live n8n production endpoints (`webhook`).
*   **Interactive Valve Diagrams**: Added interactive hotspots mapping to specific hardware components using Supabase coordinates and static overlay mapping.
*   **AI Integration Context**: Tested NotebookLM MCP automated report generation and direct pipeline insertion into the Daily Feeds system.
*   **Project Documentation**: Created `architecture.md`, `changelog.md`, `project_status.md`, and `feature_reference.md`.
*   **V2 Repository**: Migrated the complete, finalized codebase to a new repository named `v2`.

### Changed
*   **Branding Overhaul**: Complete replacement of the legacy "Nexus" branding with the official "GNPD" branding. Renamed tabs ("Daily Diary" to "Daily Feeds").
*   **UI/UX**: Extensive style overhaul adopting an "Apple-like" premium design language, making heavy use of Framer Motion, glassmorphism (`backdrop-blur`), subtle glowing gradients, and specific typography (`Outward` / `Inter`).

### Fixed
*   Resolved localhost port assignment issues (pointing users to the `server.ts` `:3000` port rather than Vite's default `:5173`).
*   Fixed Supabase connection warnings by prefixing environment variables correctly with `VITE_` for client-side access.
