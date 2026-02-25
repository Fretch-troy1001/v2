# Feature Reference: Daily Feeds Engine

**Component:** `src/components/HomeTab.tsx`
**Service:** `src/services/supabase.ts` → `getDailyFeeds()`, `createDailyFeed()`
**Database Table:** `daily_feeds` (Supabase PostgreSQL)

---

## Purpose

The Daily Feeds system replaces traditional, static data dashboards with an informal, chronological intelligence pipeline. It is designed for on-ground turbine engineers to log real-time observations, inspection results, and photos during an outage.

---

## How It Works

1. **Authoring**: Users enter text in the "Create Post" section of the `HomeTab`.
2. **Image Processing**: When an image is selected, the browser's `FileReader` API instantly transforms it into a **Base64** string.
3. **Submission**: The system invokes `createDailyFeed()`, passing the text and the Base64 string.
4. **Persistence**: Data is written directly into the `daily_feeds` table in Supabase.
5. **Polling**: The component fetches the latest feeds on mount and after every successful post, ensuring the "magazine" view is always current.

---

## Database Schema (`daily_feeds`)

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary Key (Auto-generated) |
| `content` | TEXT | The body of the post. |
| `image_base64` | TEXT | Inline image data (avoids complexity of storage buckets). |
| `author` | VARCHAR | Defaults to 'Turbine Engineer'. |
| `created_at` | TIMESTAMPTZ | Creation timestamp for chronological ordering. |

---

## Technical Notes

### Image Handling (Base64 vs Storage)
To accelerate development, we chose **Base64 string storage** within the PostgreSQL table itself. 
- **Pro**: Zero configuration for storage buckets; instantaneous implementation.
- **Con**: Increases database size significantly over time.
- **Future Scale**: Migrating to Supabase Storage and storing only the public URL in the DB is the recommended Phase 5 optimization.

### Row Level Security (RLS)
The table is currently initialized with **RLS disabled**. 
- **Rationale**: Simplifies the integration of AI-generated summaries (via NotebookLM) and allows quick testing across different local environments.
- **To Secure**: Enable RLS and create `INSERT` policies restricted to authenticated engineering roles.

---

## Expansion Methodology
To add features like "Post Tagging" or "Resolution Status":
1. Update the Supabase table schema via the dashboard or `init-feeds.sql`.
2. Update the `DailyFeed` interface in `src/types.ts`.
3. Modify the `createDailyFeed` call in `HomeTab.tsx` to include the new fields.
