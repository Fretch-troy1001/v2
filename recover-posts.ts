import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables (VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
    process.exit(1);
}

// Use Service Role Key for administrative updates
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function recoverPosts() {
    console.log('--- Recovering Legacy Untagged Posts ---');

    try {
        // 1. Identify posts missing tags
        const { data: untagged, error: fetchError } = await supabase
            .from('daily_feeds')
            .select('id, content, post_type, event')
            .or('post_type.is.null,event.is.null');

        if (fetchError) {
            console.error('❌ Error fetching untagged posts:', fetchError.message);
            return;
        }

        if (!untagged || untagged.length === 0) {
            console.log('✅ No untagged posts found.');
            return;
        }

        console.log(`Found ${untagged.length} untagged posts. Tagging as "professional" and "B Inspection"...`);

        // 2. Bulk update (using ID array)
        const { error: updateError } = await supabase
            .from('daily_feeds')
            .update({
                post_type: 'professional',
                event: 'B Inspection'
            })
            .in('id', untagged.map(p => p.id));

        if (updateError) {
            console.error('❌ Error updating posts:', updateError.message);
        } else {
            console.log('🎉 Successfully recovered and tagged posts.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

recoverPosts();
