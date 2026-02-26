import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
    console.log('--- Inspecting Supabase Table: daily_feeds ---');

    try {
        // Attempt to select one row with the new columns
        const { data, error } = await supabase
            .from('daily_feeds')
            .select('id, post_type, event')
            .limit(1);

        if (error) {
            if (error.message.includes('column "post_type" does not exist') || error.message.includes('column "event" does not exist')) {
                console.error('❌ MIGRATION REQUIRED: The columns "post_type" or "event" are missing from the daily_feeds table.');
                console.log('Please run the updated SQL in init-feeds.sql in your Supabase SQL Editor.');
            } else {
                console.error('❌ Error checking schema:', error.message);
            }
        } else {
            console.log('✅ SCHEMA VERIFIED: Columns "post_type" and "event" exist.');
            console.log('Data sample:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkSchema();
