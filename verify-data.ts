import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
    console.log('--- Verifying daily_feeds Data ---');
    const { data, error } = await supabase
        .from('daily_feeds')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log(`Total posts found: ${data?.length || 0}`);

    if (data && data.length > 0) {
        data.forEach((post: any, index: number) => {
            console.log(`[${index}] ID: ${post.id}`);
            console.log(`    Content: ${post.content.substring(0, 50)}...`);
            console.log(`    Type: ${post.post_type} | Event: ${post.event}`);
            console.log(`    Created At: ${post.created_at}`);
            console.log('---------------------------');
        });
    }
}

verifyData();
