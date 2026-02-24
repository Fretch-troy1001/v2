import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
    const valves = ['MCV', 'MSV', 'ISV', 'OCV'];
    for (const valveId of valves) {
        console.log(`\n--- Components for ${valveId} ---`);
        const { data, error } = await supabase
            .from('Turbine Valves Component database')
            .select('component_id, component_name, material')
            .eq('valve_id', valveId)
            .order('component_id', { ascending: true });

        if (error) {
            console.error(`Error fetching ${valveId}:`, error.message);
            continue;
        }

        if (data) {
            data.forEach(c => {
                console.log(`[${c.component_id}] ${c.component_name} (${c.material})`);
            });
        }
    }
}

run();
