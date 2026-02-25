import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrate() {
    console.log('Starting migration...');

    // 1. Add image_url column to daily_feeds
    // We can't use regular JS client for ALTER TABLE easily without SQL endpoint
    // But we can check if it exists by trying to select it or using RPC if available.
    // However, the easiest way for a one-off is to try an insert and catch error, 
    // or use the SQL Editor in Supabase UI.

    // 2. Create Storage Bucket
    console.log('Ensuring feed-images bucket exists...');
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('feed-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
    });

    if (bucketError) {
        if (bucketError.message.includes('already exists')) {
            console.log('Bucket "feed-images" already exists.');
        } else {
            console.error('Error creating bucket:', bucketError.message);
        }
    } else {
        console.log('Bucket "feed-images" created successfully.');
    }

    console.log('Migration steps (Storage) complete.');
    console.log('Note: To add the image_url column, please run this SQL in Supabase:');
    console.log('ALTER TABLE daily_feeds ADD COLUMN IF NOT EXISTS image_url TEXT;');
}

migrate();
