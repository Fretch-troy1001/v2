import { HotspotConfig, PlaneHotspot } from './types';

export const HOTSPOT_CONFIGS: Record<string, HotspotConfig[]> = {
    ICV: [
        { num: 1, x: 14, y: 16.5, label: 'Intermediate Piece', componentId: 1, type: 'part' },
        { num: 2, x: 42, y: 59, label: 'Valve Lock', componentId: 2, type: 'part' },
        { num: 3, x: 84, y: 10, label: 'Diffuser DN500', componentId: 3, type: 'part' },
        { num: 4, x: 21, y: 53, label: 'Valve Spindle', componentId: 4, type: 'part' },
        { num: 5, x: 60, y: 10, label: 'Steam Strainer CPL.', componentId: 5, type: 'part' },
        { num: 6, x: 17, y: 10, label: 'Segment Ring', componentId: 6, type: 'part' },
        { num: 7, x: 38, y: 10, label: 'Clamping Ring', componentId: 7, type: 'part' },
        { num: 8, x: 49, y: 10, label: 'Seal Ring', componentId: 8, type: 'part' },
        { num: 9, x: 55, y: 59, label: 'Piston Ring', componentId: 9, type: 'part' },
        { num: 10, x: 14, y: 26, label: 'Guide Bushing DN80', componentId: 10, type: 'part' },
        { num: 11, x: 14, y: 33, label: 'Gland DN80', componentId: 11, type: 'part' },
        { num: 12, x: 14, y: 42, label: 'Valve Stem Packing', componentId: 12, type: 'part' },
        { num: 21, x: 31, y: 59, label: 'Stop Ring', componentId: 21, type: 'part' },
    ],
};

export const PLANE_HOTSPOTS: Record<string, PlaneHotspot[]> = {
    ICV: [
        { label: 'A', x: 35, y: 64 },
        { label: 'M', x: 38, y: 64 },
        { label: 'N', x: 40.5, y: 64 },
        { label: 'B', x: 39, y: 67 },
        { label: 'C', x: 45, y: 65 },
        { label: 'D', x: 69, y: 64 },
        { label: 'E', x: 25, y: 72 },
        { label: 'F1', x: 10, y: 87 },
        { label: 'F2', x: 16, y: 87 },
        { label: 'F3', x: 11, y: 82 },
        { label: 'F4', x: 7, y: 75 },
        { label: 'G', x: 23, y: 92 },
        { label: 'H1', x: 47, y: 92 },
        { label: 'H2', x: 41, y: 92 },
        { label: 'H3', x: 57, y: 92 },
        { label: 'J1', x: 35, y: 92 },
        { label: 'J2', x: 64, y: 92 },
        { label: 'L', x: 26, y: 88 },
    ],
};

export const VALVE_LABELS: Record<string, string> = {
    ICV: 'Intercept Control Valve (ICV) — Cross-Section',
    ISV: 'Intercept Stop Valve (ISV) — Cross-Section',
    MCV: 'Main Control Valve (MCV) — Cross-Section',
    MSV: 'Main Stop Valve (MSV) — Cross-Section',
    OCV: 'Overload Control Valve (OCV) — Cross-Section',
};
