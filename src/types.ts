export interface ValveSpecification {
  item_id: string;
  valve_id: string;
  valve_name: string;
  component_id: number | string;
  component_name: string;
  material: string;
  details?: string;
  nominal_dia?: string;
  planes?: string[];
  x?: number;
  y?: number;
  'Material (expected) EN'?: string;
  'Coating/Overlay'?: string;
}

export interface Plane {
  clearance_id: string;
  valve_id: string;
  plane: string;
  shaft_item_id: number | string;
  hole_item_id: number | string;
  'Interface type': string;
  min_clearance: number | string | null;
  max_clearance: number | string | null;
  'operating_allowance(mm)': number | string | null;
  hole?: string;
  shaft?: string;
  tolerance?: string;
  clearance?: string;
  offset?: string;
  allowance?: string;
  x?: number;
  y?: number;
}

export interface HotspotConfig {
  num: number;
  x: number;
  y: number;
  label: string;
  componentId: number;
  type: 'part';
}

export interface PlaneHotspot {
  label: string;
  x: number;
  y: number;
}
