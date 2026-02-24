import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createFeed() {
    const content = "During our Unit 2 valve inspections, we detected Hexavalent Chromium (Cr VI) after removing the insulation on the MSV, MCV, and OLV components. We have safely barricaded the area for decontamination and postponed valve stroking activities to February 23rd to prioritize personnel safety and accommodate the forced air cooling process. Meanwhile, offsite pre-machining of the replacement valve seal rings continues to progress on schedule.";

    try {
        const { data, error } = await supabase
            .from('daily_feeds')
            .insert([
                { content, author: 'NotebookLM AI Assistant' }
            ]);

        if (error) {
            console.error("❌ Failed to insert feed. Ensure the daily_feeds table exists in Supabase.", error.message);
            process.exit(1);
        }
        console.log("✅ Successfully inserted feed post from NotebookLM!");
    } catch (err) {
        console.error("❌ Error inserting feed:", err);
    }
}

createFeed();
