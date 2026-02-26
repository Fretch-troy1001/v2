-- Paste this into your Supabase SQL Editor to create or update the daily_feeds table

-- 1. Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    image_base64 TEXT,
    author VARCHAR(255) DEFAULT 'Guest Engineer',
    post_type TEXT DEFAULT 'professional',
    event TEXT DEFAULT 'B Inspection',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add missing columns for existing tables (MIGRATION)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_feeds' AND column_name='post_type') THEN
        ALTER TABLE daily_feeds ADD COLUMN post_type TEXT DEFAULT 'professional';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_feeds' AND column_name='event') THEN
        ALTER TABLE daily_feeds ADD COLUMN event TEXT DEFAULT 'B Inspection';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_feeds' AND column_name='image_url') THEN
        ALTER TABLE daily_feeds ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 3. Security (Disable RLS for this internal tool)
ALTER TABLE daily_feeds DISABLE ROW LEVEL SECURITY;
