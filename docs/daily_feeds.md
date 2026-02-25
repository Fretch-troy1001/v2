# Daily Feeds Documentation

## Overview
The Daily Feeds system provides a glossy, magazine-style interface for logging engineering observations and diagnostics during outages.

## Technical Implementation
- **Frontend**: `src/components/HomeTab.tsx`
- **Database Table**: `daily_feeds` (Supabase)

## Schema
- **id**: (UUID) Primary Key
- **content**: (TEXT) The textual feed content
- **image_base64**: (TEXT) Inline Base64 encoded image data
- **author**: (VARCHAR) Default: 'Turbine Engineer'
- **created_at**: (TIMESTAMP) Automatically set on insertion

## Image Handling
Currently, images are converted to Base64 on the client-side using `FileReader` and stored directly in the `image_base64` text column. This allows for rapid prototyping without the immediate need for Supabase Storage buckets.

## Row Level Security (RLS)
As defined in `init-feeds.sql`, RLS is currently disabled for this table to facilitate easy testing and interaction via the service-level or anonymous API keys.

---
> [!NOTE]
> For long-term production use, migrating `image_base64` to Supabase Storage is recommended to keep the database size manageable.
