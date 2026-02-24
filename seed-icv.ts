import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Table Constants
const TABLE_COMPONENTS = 'Turbine Valves Component database';
const TABLE_PLANES = 'Turbine Tolerance fit table';

// We use the ANNON_KEY config that was placed in .env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FALLBACK_SPECS = [
    { item_id: 'ICV_0', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 0, component_name: 'Valve Casing', material: 'GX12CrMoVNbN9-1' },
    { item_id: 'ICV_1', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 1, component_name: 'Intermediate Piece', material: 'X10CrMoVNb9-1' },
    { item_id: 'ICV_2', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 2, component_name: 'Valve Lock', material: 'X10CrMoVNb9-1' },
    { item_id: 'ICV_3', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 3, component_name: 'Diffuser', material: 'X10CrMoVNb9-1' },
    { item_id: 'ICV_4a', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 4, component_name: 'Valve spindle', material: 'X22CrMoV12-1' },
    { item_id: 'ICV_4b', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 4, component_name: 'Valve Spindle (Head)', material: 'X10CrMoVNb9-1' },
    { item_id: 'ICV_5', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 5, component_name: 'Steam Strainer', material: 'X22CrMoV12-1' },
    { item_id: 'ICV_6', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 6, component_name: 'Segment ring', material: 'X19CrMoNbVN11-1' },
    { item_id: 'ICV_7', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 7, component_name: 'Clamping ring', material: 'X19CrMoNbVN11-1' },
    { item_id: 'ICV_8', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 8, component_name: 'Seal Ring', material: 'Nimonic80A' },
    { item_id: 'ICV_9', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 9, component_name: 'Piston Ring', material: 'Nimonic80A' },
    { item_id: 'ICV_10', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 10, component_name: 'Guide Bushing', material: 'Stellite 6' },
    { item_id: 'ICV_11', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 11, component_name: 'Gland', material: 'X19CrMoNbVN11-1' },
    { item_id: 'ICV_12', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 12, component_name: 'Valve Stem Packing', material: 'Graphite' },
    { item_id: 'ICV_21', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 21, component_name: 'Stop ring', material: 'X19CrMoNbVN11-1' }
];

const FALLBACK_PLANES = [
    { clearance_id: 'ICV_plane_A', valve_id: 'ICV', plane: 'A', shaft_item_id: 1, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary d8-e7', min_clearance: 0.2, max_clearance: 0.47, 'operating_allowance(mm)': 0.53 },
    { clearance_id: 'ICV_plane_B', valve_id: 'ICV', plane: 'B', shaft_item_id: 2, hole_item_id: 1, 'Interface type': 'Locating, bolted, stationary d8-e7', min_clearance: 0.2, max_clearance: 0.47, 'operating_allowance(mm)': 0.53 },
    { clearance_id: 'ICV_plane_C', valve_id: 'ICV', plane: 'C', shaft_item_id: 3, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary d8-e7', min_clearance: 0.2, max_clearance: 0.47, 'operating_allowance(mm)': 0.53 },
    { clearance_id: 'ICV_plane_D', valve_id: 'ICV', plane: 'D', shaft_item_id: 4, hole_item_id: 2, 'Interface type': 'Guiding sliding e7-g6', min_clearance: 0.1, max_clearance: 0.15, 'operating_allowance(mm)': 0.2 },
    { clearance_id: 'ICV_plane_E', valve_id: 'ICV', plane: 'E', shaft_item_id: 4, hole_item_id: 10, 'Interface type': 'Guiding sliding e7-g6', min_clearance: 0.1, max_clearance: 0.15, 'operating_allowance(mm)': 0.2 },
    { clearance_id: 'ICV_plane_F1', valve_id: 'ICV', plane: 'F1', shaft_item_id: 4, hole_item_id: 11, 'Interface type': 'Measure spindle -0.2/0.25mm', min_clearance: 0.28, max_clearance: 0.33, 'operating_allowance(mm)': 0.43 },
    { clearance_id: 'ICV_plane_F2', valve_id: 'ICV', plane: 'F2', shaft_item_id: 4, hole_item_id: 11, 'Interface type': 'Measure spindle -0.2/0.25mm', min_clearance: 0.28, max_clearance: 0.33, 'operating_allowance(mm)': 0.43 },
    { clearance_id: 'ICV_plane_F3', valve_id: 'ICV', plane: 'F3', shaft_item_id: 4, hole_item_id: 11, 'Interface type': 'Measure spindle -0.2/0.25mm', min_clearance: 0.28, max_clearance: 0.33, 'operating_allowance(mm)': 0.43 },
    { clearance_id: 'ICV_plane_F4', valve_id: 'ICV', plane: 'F4', shaft_item_id: 4, hole_item_id: 11, 'Interface type': 'Measure spindle -0.2/0.25mm', min_clearance: 0.28, max_clearance: 0.33, 'operating_allowance(mm)': 0.43 },
    { clearance_id: 'ICV_plane_G', valve_id: 'ICV', plane: 'G', shaft_item_id: 4, hole_item_id: 4, 'Interface type': 'Sealing H8f7', min_clearance: 0.88, max_clearance: 0.94, 'operating_allowance(mm)': 1.22 },
    { clearance_id: 'ICV_plane_H1', valve_id: 'ICV', plane: 'H1', shaft_item_id: 4, hole_item_id: 2, 'Interface type': 'Interference fit, stationary', min_clearance: -0.08, max_clearance: 0, 'operating_allowance(mm)': 0 },
    { clearance_id: 'ICV_plane_H2', valve_id: 'ICV', plane: 'H2', shaft_item_id: 4, hole_item_id: 2, 'Interface type': 'Interference fit, stationary', min_clearance: -0.08, max_clearance: 0, 'operating_allowance(mm)': 0 },
    { clearance_id: 'ICV_plane_H3', valve_id: 'ICV', plane: 'H3', shaft_item_id: 4, hole_item_id: 2, 'Interface type': 'Interference fit, stationary', min_clearance: -0.08, max_clearance: 0, 'operating_allowance(mm)': 0 },
    { clearance_id: 'ICV_plane_J1', valve_id: 'ICV', plane: 'J1', shaft_item_id: 4, hole_item_id: 0, 'Interface type': 'Sealing', min_clearance: 0.08, max_clearance: 0.26, 'operating_allowance(mm)': 0.26 },
    { clearance_id: 'ICV_plane_J2', valve_id: 'ICV', plane: 'J2', shaft_item_id: 4, hole_item_id: 3, 'Interface type': 'Sealing', min_clearance: 0.08, max_clearance: 0.26, 'operating_allowance(mm)': 0.26 },
    { clearance_id: 'ICV_plane_L', valve_id: 'ICV', plane: 'L', shaft_item_id: 10, hole_item_id: 1, 'Interface type': 'Sealing', min_clearance: 0.08, max_clearance: 0.26, 'operating_allowance(mm)': 0.26 },
    { clearance_id: 'ICV_plane_M', valve_id: 'ICV', plane: 'M', shaft_item_id: 8, hole_item_id: 0, 'Interface type': 'Sealing H8f7', min_clearance: 0.06, max_clearance: 0.21, 'operating_allowance(mm)': 0.21 },
    { clearance_id: 'ICV_plane_N', valve_id: 'ICV', plane: 'N', shaft_item_id: 8, hole_item_id: 2, 'Interface type': 'Sealing H8f7', min_clearance: 0.06, max_clearance: 0.21, 'operating_allowance(mm)': 0.21 },
];

const UI_METADATA = [
    // Components
    { item_id: 'ICV_0', valve_id: 'ICV', x: 20, y: 70, nominal_dia_override: 'Ø800', details: 'Locating stationary fit' },
    { item_id: 'ICV_1', valve_id: 'ICV', x: 25, y: 30, nominal_dia_override: 'Ø750', details: 'Intermediate housing section' },
    { item_id: 'ICV_2', valve_id: 'ICV', x: 40, y: 55, nominal_dia_override: 'Ø700', details: 'Internal lock mechanism' },
    { item_id: 'ICV_3', valve_id: 'ICV', x: 80, y: 30, nominal_dia_override: 'Ø850', details: 'Inlet steam diffuser' },
    { item_id: 'ICV_4a', valve_id: 'ICV', x: 30, y: 45, nominal_dia_override: 'Ø120', details: 'Main actuation spindle' },
    { item_id: 'ICV_4b', valve_id: 'ICV', x: 65, y: 55, nominal_dia_override: 'Ø150', details: 'Spindle head/plug' },
    { item_id: 'ICV_5', valve_id: 'ICV', x: 55, y: 25, nominal_dia_override: 'N/A', details: 'Fine mesh strainer basket' },
    { item_id: 'ICV_6', valve_id: 'ICV', x: 25, y: 22, nominal_dia_override: 'N/A', details: 'Retaining segment ring' },
    { item_id: 'ICV_7', valve_id: 'ICV', x: 32, y: 20, nominal_dia_override: 'N/A', details: 'Outer clamping ring' },
    { item_id: 'ICV_8', valve_id: 'ICV', x: 42, y: 20, nominal_dia_override: 'N/A', details: 'High-temp seal ring' },
    { item_id: 'ICV_9', valve_id: 'ICV', x: 45, y: 56, nominal_dia_override: 'N/A', details: 'Piston ring seal' },
    { item_id: 'ICV_10', valve_id: 'ICV', x: 25, y: 38, nominal_dia_override: 'Ø125', details: 'Spindle guide bearing' },
    { item_id: 'ICV_11', valve_id: 'ICV', x: 15, y: 40, nominal_dia_override: 'N/A', details: 'Packing gland follower' },
    { item_id: 'ICV_12', valve_id: 'ICV', x: 20, y: 45, nominal_dia_override: 'N/A', details: 'Graphite packing rings' },
    { item_id: 'ICV_21', valve_id: 'ICV', x: 30, y: 58, nominal_dia_override: 'N/A', details: 'Axial stop ring' },

    // Planes
    { item_id: 'ICV_plane_A', valve_id: 'ICV', x: 32, y: 65, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_B', valve_id: 'ICV', x: 40, y: 65, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_C', valve_id: 'ICV', x: 45, y: 65, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_D', valve_id: 'ICV', x: 65, y: 65, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_E', valve_id: 'ICV', x: 25, y: 75, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_F1', valve_id: 'ICV', x: 15, y: 80, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_F2', valve_id: 'ICV', x: 20, y: 80, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_F3', valve_id: 'ICV', x: 15, y: 75, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_F4', valve_id: 'ICV', x: 15, y: 65, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_G', valve_id: 'ICV', x: 30, y: 85, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_H1', valve_id: 'ICV', x: 55, y: 85, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_H2', valve_id: 'ICV', x: 50, y: 85, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_H3', valve_id: 'ICV', x: 60, y: 85, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_J1', valve_id: 'ICV', x: 40, y: 85, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_J2', valve_id: 'ICV', x: 65, y: 85, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_L', valve_id: 'ICV', x: 25, y: 80, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_M', valve_id: 'ICV', x: 35, y: 65, nominal_dia_override: '', details: '' },
    { item_id: 'ICV_plane_N', valve_id: 'ICV', x: 42, y: 65, nominal_dia_override: '', details: '' }
];

async function seed() {
    console.log('Seeding Components...');
    for (const c of FALLBACK_SPECS) {
        const { error } = await supabase.from(TABLE_COMPONENTS).upsert(c, { onConflict: 'item_id' });
        if (error) console.error('Error Component:', error.message);
    }

    console.log('Seeding Planes...');
    for (const p of FALLBACK_PLANES) {
        const { error } = await supabase.from(TABLE_PLANES).upsert(p, { onConflict: 'clearance_id' });
        if (error) console.error('Error Plane:', error.message);
    }

    console.log('Seeding UI Metadata...');
    for (const u of UI_METADATA) {
        const { error } = await supabase.from('turbine_ui_metadata').upsert(u, { onConflict: 'item_id' });
        if (error) console.error('Error Metadata:', error.message);
    }

    console.log('Seeding complete!');
}

seed().catch(console.error);
