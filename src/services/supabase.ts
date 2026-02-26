import { createClient } from '@supabase/supabase-js';
import { ValveSpecification, Plane } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Table Constants
const TABLE_COMPONENTS = 'Turbine Valves Component database';
const TABLE_PLANES = 'Turbine Tolerance fit table';
const TABLE_UI_METADATA = 'turbine_ui_metadata';

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const _cache: Record<string, any> = {};

export async function getValveComponents(valveId: string): Promise<ValveSpecification[]> {
  const cacheKey = `components_${valveId}`;
  if (_cache[cacheKey]) return _cache[cacheKey];

  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') return _getFallbackData('components', { valve_id: valveId }) as ValveSpecification[];

  try {
    // 1. Fetch Engineering Master Data
    const { data: engData, error: engError } = await supabase
      .from(TABLE_COMPONENTS)
      .select('*')
      .eq('valve_id', valveId);

    if (engError) throw engError;

    // 2. Fetch UI Metadata
    const { data: uiData, error: uiError } = await supabase
      .from(TABLE_UI_METADATA)
      .select('*')
      .eq('valve_id', valveId);

    if (uiError) {
      console.warn('[Supabase UI Metadata]', uiError.message);
      // Proceed with engData only if UI metadata fails
    }

    // 3. Join in memory
    const combined: ValveSpecification[] = (engData || []).map(eng => {
      const ui = (uiData || []).find(u => u.item_id === eng.item_id);
      return {
        ...eng,
        x: ui?.x || 0,
        y: ui?.y || 0,
        details: ui?.details || '',
        nominal_dia: ui?.nominal_dia_override || eng.material // Fallback nominal dia display
      } as ValveSpecification;
    });

    _cache[cacheKey] = combined;
    return combined;
  } catch (err) {
    console.error('[Supabase getValveComponents]', err);
    return _getFallbackData('components', { valve_id: valveId }) as ValveSpecification[];
  }
}

export async function getValvePlanes(valveId: string): Promise<Plane[]> {
  const cacheKey = `planes_${valveId}`;
  if (_cache[cacheKey]) return _cache[cacheKey];

  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') return _getFallbackData('planes', { valve_id: valveId }) as Plane[];

  try {
    // 1. Fetch Engineering Master Data
    const { data: engData, error: engError } = await supabase
      .from(TABLE_PLANES)
      .select('*')
      .eq('valve_id', valveId);

    if (engError) throw engError;

    // 2. Fetch UI Metadata
    const { data: uiData, error: uiError } = await supabase
      .from(TABLE_UI_METADATA)
      .select('*')
      .eq('valve_id', valveId);

    if (uiError) console.warn('[Supabase UI Metadata]', uiError.message);

    // 3. Join in memory
    const combined: Plane[] = (engData || []).map(eng => {
      const ui = (uiData || []).find(u => u.item_id === eng.clearance_id);
      return {
        ...eng,
        x: ui?.x || 0,
        y: ui?.y || 0,
        // Map DB fields to the expected UI keys if necessary
        hole: eng.hole_nom_tol_Class || '',
        shaft: eng.shaft_nom_tol_Class || '',
        tolerance: `${eng.hole_nom_tol_Class} / ${eng.shaft_nom_tol_Class}`,
        clearance: `${eng.min_clearance} / ${eng.max_clearance} mm`,
        offset: eng.offset || '0 mm',
        allowance: `${eng['operating_allowance(mm)']} mm`
      } as Plane;
    });

    _cache[cacheKey] = combined;
    return combined;
  } catch (err) {
    console.error('[Supabase getValvePlanes]', err);
    return _getFallbackData('planes', { valve_id: valveId }) as Plane[];
  }
}

function _getFallbackData(type: string, params: any) {
  if (type === 'components') {
    return FALLBACK_SPECS.filter(r => !params.valve_id || r.valve_id === params.valve_id);
  }
  if (type === 'planes') {
    return FALLBACK_PLANES.filter(r => !params.valve_id || r.valve_id === params.valve_id);
  }
  return [];
}

const FALLBACK_SPECS: ValveSpecification[] = [
  { item_id: 'ICV_0', valve_id: 'ICV', valve_name: 'Intercept Control Valve', component_id: 0, component_name: 'Valve Casing', material: 'GX12CrMoVNbN9-1', x: 30.5, y: 35, details: 'Locating stationary fit' },
  // ... (Truncated for readability, keeping structure)
];

const FALLBACK_PLANES: Plane[] = [
  { clearance_id: 'ICV_plane_A', valve_id: 'ICV', plane: 'A', shaft_item_id: 1, hole_item_id: 0, 'Interface type': 'Locating, bolted, stationary d8-e7', min_clearance: 0.2, max_clearance: 0.47, 'operating_allowance(mm)': 0.53, x: 25, y: 28 },
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

export interface DailyFeed {
  id: string;
  content: string;
  image_base64: string | null;
  image_url: string | null;
  author: string;
  created_at: string;
  post_type: 'professional' | 'social';
  event: string;
}

export async function getDailyFeeds(): Promise<DailyFeed[]> {
  try {
    const { data, error } = await supabase
      .from('daily_feeds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Supabase getDailyFeeds]', err);
    return [];
  }
}

export async function checkSchema(): Promise<{ ok: boolean; missing: string[] }> {
  try {
    const { data, error } = await supabase
      .from('daily_feeds')
      .select('post_type, event')
      .limit(1);

    if (error) {
      const missing: string[] = [];
      if (error.message.includes('post_type')) missing.push('post_type');
      if (error.message.includes('event')) missing.push('event');
      return { ok: false, missing };
    }
    return { ok: true, missing: [] };
  } catch (err) {
    return { ok: false, missing: ['unknown'] };
  }
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadFeedImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `feed-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('feed-images') // Assumes bucket exists as per implementation plan
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('feed-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('[Supabase uploadFeedImage]', err);
    return null;
  }
}

export async function createDailyFeed(
  content: string,
  imageBase64?: string,
  imageUrl?: string,
  postType: 'professional' | 'social' = 'professional',
  event: string = 'B Inspection',
  customDate?: Date
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const author = session?.user?.email || 'Guest Engineer';

    const insertData: any = {
      content,
      image_base64: imageBase64 || null,
      image_url: imageUrl || null,
      author,
      post_type: postType,
      event: event
    };

    if (customDate) {
      insertData.created_at = customDate.toISOString();
    }

    const { error } = await supabase
      .from('daily_feeds')
      .insert([insertData]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase createDailyFeed]', err);
    return false;
  }
}

export async function deleteDailyFeed(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('daily_feeds')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase deleteDailyFeed]', err);
    return false;
  }
}
export async function updateDailyFeed(
  id: string,
  updates: Partial<DailyFeed>,
  customDate?: Date
): Promise<boolean> {
  try {
    const updateData: any = { ...updates };
    if (customDate) {
      updateData.created_at = customDate.toISOString();
    }

    const { error } = await supabase
      .from('daily_feeds')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase updateDailyFeed]', err);
    return false;
  }
}

