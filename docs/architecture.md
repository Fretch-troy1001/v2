# Turbine Systems Webapp - Architecture

## High-Level System Design

The Turbine Systems Webapp is a modern, premium web application built to assist engineers with tracking daily feeds, inspecting interactive turbine valve diagrams, and utilizing various engineering calculative tools. The system employs a "frontend-heavy" with a lightweight local proxy backend and relies heavily on Backend-as-a-Service (BaaS) for data persistence.

### Technology Stack
*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS v4, Framer Motion (for premium glassmorphism and animations), Lucide React (icons)
*   **Backend Proxy:** Express (Node.js) via `server.ts`
*   **Database & BaaS:** Supabase (PostgreSQL)
*   **External Automations:** n8n webhooks

## Supabase Schema & Tables

The following tables are central to the application's data layer:

| Table Name | Description | Key Columns |
|---|---|---|
| `daily_feeds` | Stores engineering notes and images for the magazine view. | `id`, `content`, `image_base64`, `author`, `created_at` |
| `turbine_ui_metadata` | Hotspot coordinates and component mappings for interactive diagrams. | `id`, `diagram_id`, `component_id`, `x_pos`, `y_pos` |
| `valves` | Engineering specifications, tolerances, and design limits. | `id`, `component_id`, `name`, `nominal_od`, `tolerance_class` |
| `planes` | Specific measurement locations (Plane B, C, etc.) for hardware. | `id`, `valve_id`, `plane_name`, `target_dimension` |

## Folder Structure

```text
Turbine-Systems-Webapp/
├── src/
│   ├── components/
│   │   ├── tools/          # Engineering calculator components
│   │   │   ├── bearing-position-calculator.tsx
│   │   │   ├── icv-clamping-ring-calculator.tsx
│   │   │   ├── iso-tolerance-calculator.tsx
│   │   │   └── valve-lock-weld-calculator.tsx
│   │   ├── ui/             # Reusable UI elements (Dialog, Input, Label, ValveForm)
│   │   ├── HomeTab.tsx     # Glossy magazine-style Daily Feeds
│   │   ├── ToolsTab.tsx    # Hub for engineering utilities
│   │   └── ValveTab.tsx    # Interactive diagram viewer and hotspot logic
│   ├── services/
│   │   └── supabase.ts     # Supabase client initialization and API service functions
│   ├── App.tsx             # Main layout, routing, and navigation sidebar
│   ├── main.tsx            # React application entry point
│   ├── index.css           # Global stylesheets, Tailwind imports, custom CSS variables
│   └── types.ts            # TypeScript interface definitions
├── public/                 # Static assets (interactive diagram images like icv-diagram.jpg)
├── server.ts               # Express server for API route proxying and dev server middleware
├── seed-icv.ts             # Script to populate Supabase with initial valve/component data
├── init-feeds.sql          # SQL schema definition for the daily_feeds table
└── docs/                   # (Optional) Subfolder for additional extensive documentation
```

## Data Flow & Component Interaction

1.  **Frontend to Supabase (Direct BaaS Connection)**
    *   **Daily Feeds:** `HomeTab.tsx` directly calls functions in `src/services/supabase.ts` (`getDailyFeeds`, `createDailyFeed`). These functions use the Supabase anon key to securely query the `daily_feeds` PostgreSQL table. Image data is converted to Base64 in the browser and stored alongside the text content.
    *   **Interactive Diagrams:** `ValveTab.tsx` fetches engineering specifications and coordinate mappings from Supabase tables (e.g., `turbine_ui_metadata`, valve tracking tables).

2.  **Frontend to Local Backend Proxy (`server.ts`)**
    *   Because n8n webhooks might not support direct CORS from a browser, or to obscure webhook URLs, the frontend calculators (e.g., `SealRingCalculator` in `src/components/tools/`) send HTTP `POST` requests to local endpoints defined in `server.ts` (e.g., `/api/submit-valve`).

3.  **Local Backend to External Automations (n8n)**
    *   The `server.ts` Express application receives requests from the frontend, formats the data into URL search parameters, and makes out-bound `GET` requests to external n8n production webhooks (`https://troy-n8n-2026.duckdns.org/webhook/...`).
    *   The backend retrieves the computed string or HTML from n8n and passes it back to the React frontend for display to the user.
