export interface ValveSpecification {
  item_id: string;
  valve_id: string;
  valve_name: string;
  component_id: number;
  component_name: string;
  manufacturing_process: string;
  material: string;
  'Material (expected) EN': string;
  'Coating/Overlay': string;
}

export interface Plane {
  clearance_id: string;
  valve_id: string;
  plane: string;
  shaft_item_id: number;
  hole_item_id: number;
  'Interface type': string;
  min_clearance: number | null;
  max_clearance: number | null;
  'operating_allowance(mm)': number | null;
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
