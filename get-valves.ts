import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
    console.log('Fetching unique valve IDs...');
    try {
        const { data, error } = await supabase
            .from('Turbine Valves Component database')
            .select('valve_id');

        if (error) {
            console.error('Database Error:', error.message);
            return;
        }

        if (!data) {
            console.log('No data returned.');
            return;
        }

        const valveIds = [...new Set(data.map(item => item.valve_id))];
        console.log('Valve IDs found:', valveIds);
    } catch (err) {
        console.error('Unhandled Error:', err);
    }
}

run();
