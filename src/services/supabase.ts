import { ValveSpecification, Plane } from '../types';

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const _cache: Record<string, any> = {};

async function _supabaseQuery(table: string, params: any = {}) {
  const cacheKey = table + JSON.stringify(params);
  if (_cache[cacheKey]) return _cache[cacheKey];

  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    const data = _getFallbackData(table, params);
    _cache[cacheKey] = data;
    return data;
  }

  try {
    const qs = new URLSearchParams();
    if (params.valve_id) qs.set('valve_id', `eq.${params.valve_id}`);
    if (params.component_id !== undefined) qs.set('component_id', `eq.${params.component_id}`);
    qs.set('select', '*');

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${qs}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    const data = await res.json();
    _cache[cacheKey] = data;
    return data;
  } catch (err) {
    console.error('[Supabase]', err);
    return _getFallbackData(table, params);
  }
}

export async function getValveComponents(valveId: string): Promise<ValveSpecification[]> {
  return _supabaseQuery('valve_list_specifications', { valve_id: valveId });
}

export async function getValvePlanes(valveId: string): Promise<Plane[]> {
  return _supabaseQuery('planes', { valve_id: valveId });
}

function _getFallbackData(table: string, params: any) {
  if (table === 'valve_list_specifications') {
    return FALLBACK_SPECS.filter(r => !params.valve_id || r.valve_id === params.valve_id);
  }
  if (table === 'planes') {
    return FALLBACK_PLANES.filter(r => !params.valve_id || r.valve_id === params.valve_id);
  }
  return [];
}

const FALLBACK_SPECS: ValveSpecification[] = [
  { item_id: 'ICV_0', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 0, component_name: 'Valve Casing', manufacturing_process: '', material: 'GX12CrMoVNbN9-1', 'Material (expected) EN': 'GX12CrMoVNbN9-1', 'Coating/Overlay': '' },
  { item_id: 'ICV_1', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 1, component_name: 'Inter. Piece Machined', manufacturing_process: 'Casting', material: 'G17CrMoV5-10', 'Material (expected) EN': 'G17CrMoV5-10', 'Coating/Overlay': '' },
  { item_id: 'ICV_2', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 2, component_name: 'Lock', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'CrC coating inside' },
  { item_id: 'ICV_3', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 3, component_name: 'Diffuser DN500', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': '' },
  { item_id: 'ICV_4', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 4, component_name: 'Valve Spindle', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'CrC in guide areas' },
  { item_id: 'ICV_5', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 5, component_name: 'Steam Strainer CPL. DN500', manufacturing_process: '', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': '' },
  { item_id: 'ICV_6', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 6, component_name: 'Segment Ring 4-Parts', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': '' },
  { item_id: 'ICV_7', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 7, component_name: 'Clamping Ring DN500', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': '' },
  { item_id: 'ICV_8', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 8, component_name: 'Seal Ring DN500', manufacturing_process: '', material: 'Graphite', 'Material (expected) EN': '', 'Coating/Overlay': '' },
  { item_id: 'ICV_9', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 9, component_name: 'Piston Ring DN500', manufacturing_process: '', material: 'Stellite 8', 'Material (expected) EN': '', 'Coating/Overlay': '' },
  { item_id: 'ICV_10', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 10, component_name: 'Guide Bushing DN80', manufacturing_process: '', material: 'Stellite 6B', 'Material (expected) EN': '', 'Coating/Overlay': '' },
  { item_id: 'ICV_11', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 11, component_name: 'Gland DN80', manufacturing_process: '', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': '' },
  { item_id: 'ICV_12', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 12, component_name: 'Valve Stem Packing DN80', manufacturing_process: '', material: 'Graphite/Inconel', 'Material (expected) EN': '', 'Coating/Overlay': '' },
  { item_id: 'ICV_21', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 21, component_name: 'Stop Ring', manufacturing_process: '', material: '', 'Material (expected) EN': '', 'Coating/Overlay': '' },

  { item_id: 'MCV_0', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 0, component_name: 'Control Valve Compl.', manufacturing_process: '', material: 'GX12CrMoVNbN9-1', 'Material (expected) EN': 'GX12CrMoVNbN9-1', 'Coating/Overlay': '' },
  { item_id: 'MCV_1', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 1, component_name: 'Intermediate Piece', manufacturing_process: 'Casting', material: 'G17CrMoV5-10', 'Material (expected) EN': 'G17CrMoV5-10', 'Coating/Overlay': '' },
  { item_id: 'MCV_2', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 2, component_name: 'Lock', manufacturing_process: 'Forging', material: 'X14CrMoVNbN10-1', 'Material (expected) EN': 'X14CrMoVNbN10-1', 'Coating/Overlay': '' },
  { item_id: 'MCV_3', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 3, component_name: 'Spindle', manufacturing_process: 'Forging', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': 'CrC' },
  { item_id: 'MCV_5', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 5, component_name: 'Diffuser Long', manufacturing_process: 'Forging', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': 'Stellite' },
  { item_id: 'MCV_6', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 6, component_name: 'Valve Bell', manufacturing_process: 'Forging', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': 'Stellite' },
  { item_id: 'MCV_7', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 7, component_name: 'Valve Seat', manufacturing_process: 'Forging', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': '' },
  { item_id: 'MCV_10', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 10, component_name: 'Seal', manufacturing_process: 'Forging', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': '' },
  { item_id: 'MCV_14', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 14, component_name: 'Guide Bushing', manufacturing_process: '', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': '' },
  { item_id: 'MCV_15', valve_id: 'MCV', valve_name: 'Main Control Valve', component_id: 15, component_name: 'Guide Bushing (upper)', manufacturing_process: '', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'Stellite' },

  { item_id: 'MSV_0', valve_id: 'MSV', valve_name: 'Main Stop Valve', component_id: 0, component_name: 'Main Stop Valve Compl.', manufacturing_process: '', material: 'GX12CrMoVNbN9-1', 'Material (expected) EN': 'GX12CrMoVNbN9-1', 'Coating/Overlay': '' },
  { item_id: 'MSV_2', valve_id: 'MSV', valve_name: 'Main Stop Valve', component_id: 2, component_name: 'Lock', manufacturing_process: 'Forging', material: 'X14CrMoVNbN10-2', 'Material (expected) EN': 'X14CrMoVNbN10-2', 'Coating/Overlay': '' },
  { item_id: 'MSV_4', valve_id: 'MSV', valve_name: 'Main Stop Valve', component_id: 4, component_name: 'Spindle', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'CrC 0.15 thick' },
  { item_id: 'MSV_5', valve_id: 'MSV', valve_name: 'Main Stop Valve', component_id: 5, component_name: 'Valve Head', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'CrC 0.15 thick' },
  { item_id: 'MSV_10', valve_id: 'MSV', valve_name: 'Main Stop Valve', component_id: 10, component_name: 'Guide Bushing', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'Possibly Stellite ID' },

  { item_id: 'ISV_0', valve_id: 'ISV', valve_name: 'Intercept Stop Valve', component_id: 0, component_name: 'Valve Casing', manufacturing_process: '', material: 'GX12CrMoVNbN9-1', 'Material (expected) EN': 'GX12CrMoVNbN9-1', 'Coating/Overlay': '' },
  { item_id: 'ISV_32', valve_id: 'ISV', valve_name: 'Intercept Stop Valve', component_id: 32, component_name: 'Spindle Carrier', manufacturing_process: 'Forging', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': '' },
  { item_id: 'ISV_33', valve_id: 'ISV', valve_name: 'Intercept Stop Valve', component_id: 33, component_name: 'Valve Spindle', manufacturing_process: '', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'CRC' },
  { item_id: 'ISV_35', valve_id: 'ISV', valve_name: 'Intercept Stop Valve', component_id: 35, component_name: 'Valve Head', manufacturing_process: '', material: 'X22CrMoV12-1', 'Material (expected) EN': 'X22CrMoV12-1', 'Coating/Overlay': 'Nitrided' },

  { item_id: 'OCV_0', valve_id: 'OCV', valve_name: 'Overload Control Valve', component_id: 0, component_name: 'Control Valve Compl.', manufacturing_process: '', material: 'GX12CrMoVNbN9-1', 'Material (expected) EN': 'GX12CrMoVNbN9-1', 'Coating/Overlay': '' },
  { item_id: 'OCV_3', valve_id: 'OCV', valve_name: 'Overload Control Valve', component_id: 3, component_name: 'Spindle', manufacturing_process: '', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': '' },
  { item_id: 'OCV_5', valve_id: 'OCV', valve_name: 'Overload Control Valve', component_id: 5, component_name: 'Diffuser DN090', manufacturing_process: '', material: 'X6CrNiTi18-10', 'Material (expected) EN': 'X6CrNiTi18-10', 'Coating/Overlay': '' },
  { item_id: 'OCV_6', valve_id: 'OCV', valve_name: 'Overload Control Valve', component_id: 6, component_name: 'Valve Bell', manufacturing_process: '', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': 'Stellite' },
  { item_id: 'OCV_14', valve_id: 'OCV', valve_name: 'Overload Control Valve', component_id: 14, component_name: 'Guide Bushing', manufacturing_process: '', material: 'X8CrNiMoVNb16-13', 'Material (expected) EN': 'X8CrNiMoVNb16-13', 'Coating/Overlay': '' },
];

const FALLBACK_PLANES: Plane[] = [
  { clearance_id: 'ICV_plane_A', valve_id: 'ICV', plane: 'A', shaft_item_id: 1, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary d8-e7', min_clearance: 0.2, max_clearance: 0.47, 'operating_allowance(mm)': 0.53 },
  { clearance_id: 'ICV_plane_B', valve_id: 'ICV', plane: 'B', shaft_item_id: 2, hole_item_id: 0, 'Interface type': 'Locating, stationary w/ thermal movement d8-e7', min_clearance: 0.35, max_clearance: 0.68, 'operating_allowance(mm)': 0.78 },
  { clearance_id: 'ICV_plane_C', valve_id: 'ICV', plane: 'C', shaft_item_id: 2, hole_item_id: 0, 'Interface type': 'Locating, stationary w/ thermal movement d8-e7', min_clearance: 0.35, max_clearance: 0.68, 'operating_allowance(mm)': 0.78 },
  { clearance_id: 'ICV_plane_D', valve_id: 'ICV', plane: 'D', shaft_item_id: 3, hole_item_id: 0, 'Interface type': 'Diffuser special e7', min_clearance: 0.17, max_clearance: 0.4, 'operating_allowance(mm)': 0.46 },
  { clearance_id: 'ICV_plane_E', valve_id: 'ICV', plane: 'E', shaft_item_id: 2, hole_item_id: 1, 'Interface type': 'Locating, guiding, stationary w/ movement g6', min_clearance: 0.1, max_clearance: 0.22, 'operating_allowance(mm)': 0.25 },
  { clearance_id: 'ICV_plane_F1', valve_id: 'ICV', plane: 'F1', shaft_item_id: 4, hole_item_id: 10, 'Interface type': 'Sliding guide, hot area', min_clearance: 0.33, max_clearance: 0.39, 'operating_allowance(mm)': 0.51 },
  { clearance_id: 'ICV_plane_F2', valve_id: 'ICV', plane: 'F2', shaft_item_id: 10, hole_item_id: 2, 'Interface type': 'Fitting, two areas, stationary', min_clearance: 0.15, max_clearance: 0.23, 'operating_allowance(mm)': 0.23 },
  { clearance_id: 'ICV_plane_F3', valve_id: 'ICV', plane: 'F3', shaft_item_id: 12, hole_item_id: 11, 'Interface type': 'Packing gap', min_clearance: 0, max_clearance: 0, 'operating_allowance(mm)': 0 },
  { clearance_id: 'ICV_plane_F4', valve_id: 'ICV', plane: 'F4', shaft_item_id: 11, hole_item_id: 2, 'Interface type': 'Sealing H8f7', min_clearance: 0.04, max_clearance: 0.13, 'operating_allowance(mm)': 0.16 },
  { clearance_id: 'ICV_plane_G', valve_id: 'ICV', plane: 'G', shaft_item_id: 2, hole_item_id: 7, 'Interface type': 'Sealing f7', min_clearance: 0.09, max_clearance: 0.32, 'operating_allowance(mm)': 0.41 },
  { clearance_id: 'ICV_plane_H1', valve_id: 'ICV', plane: 'H1', shaft_item_id: 4, hole_item_id: 2, 'Interface type': 'Sliding guide, hot area', min_clearance: 1.11, max_clearance: 1.22, 'operating_allowance(mm)': 1.59 },
  { clearance_id: 'ICV_plane_H2', valve_id: 'ICV', plane: 'H2', shaft_item_id: 9, hole_item_id: 2, 'Interface type': 'Axial gap at piston ring', min_clearance: 0.1, max_clearance: 0.3, 'operating_allowance(mm)': 0.39 },
  { clearance_id: 'ICV_plane_H3', valve_id: 'ICV', plane: 'H3', shaft_item_id: 4, hole_item_id: 2, 'Interface type': 'Sliding guide, hot area', min_clearance: 1.11, max_clearance: 1.22, 'operating_allowance(mm)': 1.59 },
  { clearance_id: 'ICV_plane_J1', valve_id: 'ICV', plane: 'J1', shaft_item_id: 2, hole_item_id: 5, 'Interface type': 'Located, stationary, fitted w/ pin p6', min_clearance: -0.16, max_clearance: -0.01, 'operating_allowance(mm)': 0 },
  { clearance_id: 'ICV_plane_J2', valve_id: 'ICV', plane: 'J2', shaft_item_id: 3, hole_item_id: 5, 'Interface type': 'Diffuser fit', min_clearance: 0.6, max_clearance: 0.8, 'operating_allowance(mm)': 0.92 },
  { clearance_id: 'ICV_plane_L', valve_id: 'ICV', plane: 'L', shaft_item_id: 4, hole_item_id: 0, 'Interface type': 'Runout of valve spindle', min_clearance: 0, max_clearance: 0.3, 'operating_allowance(mm)': 0.35 },
  { clearance_id: 'ICV_plane_M', valve_id: 'ICV', plane: 'M', shaft_item_id: 7, hole_item_id: 0, 'Interface type': 'Sealing f7', min_clearance: 0.1, max_clearance: 0.37, 'operating_allowance(mm)': 0.42 },
  { clearance_id: 'ICV_plane_N', valve_id: 'ICV', plane: 'N', shaft_item_id: 8, hole_item_id: 0, 'Interface type': 'Sealing f7', min_clearance: 0.05, max_clearance: 0.17, 'operating_allowance(mm)': 0.22 },

  { clearance_id: 'MCV_plane_A', valve_id: 'MCV', plane: 'A', shaft_item_id: 1, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary', min_clearance: 0.21, max_clearance: 0.39, 'operating_allowance(mm)': 0.5 },
  { clearance_id: 'MCV_plane_B', valve_id: 'MCV', plane: 'B', shaft_item_id: 2, hole_item_id: 0, 'Interface type': 'Locating, stationary w/ thermal movement', min_clearance: 0.13, max_clearance: 0.27, 'operating_allowance(mm)': 0.35 },
  { clearance_id: 'MCV_plane_E1', valve_id: 'MCV', plane: 'E1', shaft_item_id: 2, hole_item_id: 1, 'Interface type': 'Locating guiding, movement g6', min_clearance: 0.01, max_clearance: 0.08, 'operating_allowance(mm)': 0.09 },
  { clearance_id: 'MCV_plane_F1', valve_id: 'MCV', plane: 'F1', shaft_item_id: 3, hole_item_id: 14, 'Interface type': 'Sliding guide, hot area', min_clearance: 0.19, max_clearance: 0.24, 'operating_allowance(mm)': 0.31 },
  { clearance_id: 'MCV_plane_H3', valve_id: 'MCV', plane: 'H3', shaft_item_id: 15, hole_item_id: 2, 'Interface type': 'Fitting, stationary, p6', min_clearance: -0.08, max_clearance: 0, 'operating_allowance(mm)': 0 },
  { clearance_id: 'MCV_plane_M', valve_id: 'MCV', plane: 'M', shaft_item_id: 10, hole_item_id: 0, 'Interface type': 'Sealing H8f7', min_clearance: 0.06, max_clearance: 0.21, 'operating_allowance(mm)': 0.21 },

  { clearance_id: 'MSV_plane_A', valve_id: 'MSV', plane: 'A', shaft_item_id: 1, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary', min_clearance: 0.26, max_clearance: 0.48, 'operating_allowance(mm)': 0.62 },
  { clearance_id: 'MSV_plane_F1', valve_id: 'MSV', plane: 'F1', shaft_item_id: 4, hole_item_id: 11, 'Interface type': 'Measure spindle -0.2/0.25mm', min_clearance: 0.28, max_clearance: 0.33, 'operating_allowance(mm)': 0.43 },
  { clearance_id: 'MSV_plane_H3', valve_id: 'MSV', plane: 'H3', shaft_item_id: 10, hole_item_id: 2, 'Interface type': 'Interference fit, stationary', min_clearance: -0.08, max_clearance: 0, 'operating_allowance(mm)': 0 },
  { clearance_id: 'MSV_plane_M', valve_id: 'MSV', plane: 'M', shaft_item_id: 16, hole_item_id: 0, 'Interface type': 'Sealing', min_clearance: 0.08, max_clearance: 0.26, 'operating_allowance(mm)': 0.26 },

  { clearance_id: 'ISV_plane_A', valve_id: 'ISV', plane: 'A', shaft_item_id: 31, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary', min_clearance: 0.65, max_clearance: 0.83, 'operating_allowance(mm)': 1.07 },
  { clearance_id: 'ISV_plane_F1', valve_id: 'ISV', plane: 'F1', shaft_item_id: 33, hole_item_id: 39, 'Interface type': 'Sliding guide, hot area', min_clearance: 0.37, max_clearance: 0.43, 'operating_allowance(mm)': 0.56 },
  { clearance_id: 'ISV_plane_K', valve_id: 'ISV', plane: 'K', shaft_item_id: 35, hole_item_id: 34, 'Interface type': 'Locating, bolted, stationary', min_clearance: 0.14, max_clearance: 0.3, 'operating_allowance(mm)': 0.34 },

  { clearance_id: 'OCV_plane_A', valve_id: 'OCV', plane: 'A', shaft_item_id: 1, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary', min_clearance: 0.17, max_clearance: 0.31, 'operating_allowance(mm)': 0.41 },
  { clearance_id: 'OCV_plane_F1', valve_id: 'OCV', plane: 'F1', shaft_item_id: 3, hole_item_id: 14, 'Interface type': 'Sliding guide, hot area', min_clearance: 0.2, max_clearance: 0.23, 'operating_allowance(mm)': 0.3 },
  { clearance_id: 'OCV_plane_G2', valve_id: 'OCV', plane: 'G2', shaft_item_id: 44, hole_item_id: 2, 'Interface type': 'Sealing H8f7', min_clearance: 0.88, max_clearance: 0.94, 'operating_allowance(mm)': 1.22 },
];
