# Feature Reference: Daily Feeds Engine

**Component:** `src/components/HomeTab.tsx`
**Service:** `src/services/supabase.ts` → `getDailyFeeds()`, `createDailyFeed()`, `updateDailyFeed()`
**Database Table:** `daily_feeds` (Supabase PostgreSQL)

---

## Purpose

The Daily Feeds system replaces traditional, static data dashboards with an informal, chronological intelligence pipeline. It is designed for on-ground turbine engineers to log real-time observations, inspection results, and photos during an outage.

---

## How It Works

1. **Authoring**: Users enter text in the "Create Post" section or click **Edit** on an existing entry.
2. **Image Processing**: Images are transformed into a **Base64** string via `FileReader` and optimized.
3. **Submission**: The system invokes `createDailyFeed()` for new entries or `updateDailyFeed()` for edits.
4. **Persistence**: Data is written directly into the `daily_feeds` table in Supabase.
5. **Polling**: The component re-fetches feeds after every successful post or edit.
6. **Navigation**: Users can swap between days using **Arrow Keys** or UI arrows.

---

## Database Schema (`daily_feeds`)

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary Key (Auto-generated) |
| `content` | TEXT | The body of the post. |
| `image_base64` | TEXT | Inline image data (optimized to 1200px wide). |
| `author` | VARCHAR | Logged-in user email or 'Guest Engineer'. |
| `post_type` | VARCHAR | 'professional' or 'social' (Defaults to professional). |
| `event` | VARCHAR | 'B Inspection', 'Boiler Outage', 'Gen Overhaul'. |
| `created_at` | TIMESTAMPTZ | Creation timestamp (supports custom back-dating). |

---

## Technical Notes

### Image Optimization (1200px Strategy)
To maintain high performance without a storage bucket:
1. **Resizing**: In `HomeTab.tsx`, images are drawn into a `canvas` and restricted to `max-width: 1200px`.
2. **Compression**: The canvas is exported as `image/jpeg` with a **0.6 quality** factor.
3. **Storage**: The resulting Base64 string is stored in the `image_base64` column.

### Feed UI Layout (Text-First)
Following mobile-first scanability best practices:
- **Caption First**: The text content is displayed above the image to ensure technical logs are processed before purely visual confirmation.
- **Micro-Animations**: Uses `framer-motion` for slide-in transitions and hover effects on feed cards.

### Row Level Security (RLS)
The table is currently initialized with **RLS disabled**. 
- **Rationale**: Simplifies the integration of AI-generated summaries (via NotebookLM) and allows quick testing across different local environments.
- **To Secure**: Enable RLS and create `INSERT` policies restricted to authenticated engineering roles.

---

## Expansion Methodology
To add features like "Post Tagging" or "Resolution Status":
1. **Database**: Update the Supabase `daily_feeds` table schema via the dashboard.
2. **Types**: Update the `DailyFeed` interface in `src/types.ts`.
3. **Services**: Modify `src/services/supabase.ts` (specifically `createDailyFeed`) to handle the new parameters.
4. **UI**: Update the filter state and dropdown in `HomeTab.tsx` (sticky top bar).
