const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function migrate() {
    console.log('Ensuring feed-images bucket exists...');
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('feed-images', {
        public: true,
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
}

migrate();
