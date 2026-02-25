# Feature-Specific Reference Docs

## 1. Daily Feeds Engine (`HomeTab.tsx`)
**Purpose:** Replaces standard data dashboards with an informal, chronological intelligence pipeline tailored for on-ground outage inspections.

**How it Works:**
*   A user authors text in the React textarea and uploads an image via the `<input type="file">`.
*   The FileReader API instantly transforms the image into a Base64 string.
*   The system invokes `createDailyFeed()` from `src/services/supabase.ts`, writing the text and Base64 encoded image directly into the PostgreSQL `daily_feeds` array.
*   The component polls `getDailyFeeds()` on mount and after submission, automatically injecting new visual updates.

**Important Hooks / Mechanics:**
*   To bypass creating complex Storage Buckets during prototyping, Base64 was explicitly used for the `image_base64` column handling.
*   Table `daily_feeds` requires RLS disabled or correctly formatted rules to allow anonymous inserts from the Vite environment.

---

## 2. Local Backend Proxy (`server.ts`)
**Purpose:** Solves Cross-Origin Resource Sharing (CORS) security mechanisms enforced by browsers when trying to access n8n webhooks, while also keeping actual webhook UUIDs unexposed in the bundled frontend code.

**How it Works:**
*   It operates an uncompiled NodeJS Express instance listening on Port 3000.
*   When a user clicks "Calculate" in a frontend component (like `SealRingCalculator.tsx`), `HomeTab` sends a secure POST to local `/api/submit-[tool-name]`.
*   The Express API constructs URL search params (`?casingId=...&value=...`), attaches them to the hardcoded DuckDNS n8n webhook URI, fetching from n8n securely over HTTP GET.
*   It parses the resulting payload (html, json, or text) and ships it back natively to be parsed into the `DangerouslySetInnerHTML` response block on the interface.

---

## 3. Interactive Diagrams (`ValveTab.tsx`)
**Purpose:** Provides a technical breakdown overlay mapping actual physical locations of components and planes on turbine hardware blueprints.

**How it Works:**
*   A static hero image (e.g., `icv-diagram.jpg`) acts as the background.
*   An array of coordinates and hover regions (`turbine_ui_metadata`) are aligned and joined tightly with component constraints mapped from the engineering backend data sets.
*   Framer Motion components provide the visual hover pulsing dots. Selecting a dot polls Supabase via caching to quickly load the associated tolerances and component limits.
