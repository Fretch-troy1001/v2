-- Paste this into your Supabase SQL Editor to create the daily_feeds table
CREATE TABLE IF NOT EXISTS daily_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    image_base64 TEXT,
    author VARCHAR(255) DEFAULT 'Turbine Engineer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Because we are inserting Base64 data directly into a text column, 
-- and not using Supabase Storage, we don't need to configure RLS storage policies.
-- Let's ensure RLS is disabled on the table to make it easy for our app to read/write using anon key.
ALTER TABLE daily_feeds DISABLE ROW LEVEL SECURITY;

-- Add image_url column for Supabase Storage support
ALTER TABLE daily_feeds ADD COLUMN IF NOT EXISTS image_url TEXT;
