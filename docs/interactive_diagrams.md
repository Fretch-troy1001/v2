# Feature Reference: Interactive Valve Diagrams

**Component:** `src/components/ValveTab.tsx`
**Service:** `src/services/supabase.ts` → `getValveComponents()`, `getValvePlanes()`
**Static Asset:** `public/icv-diagram.jpg`
**Database Tables:** `Turbine Valves Component database`, `Turbine Tolerance fit table`, `turbine_ui_metadata`

---

## Purpose

Provides a technical breakdown overlay mapping actual physical locations of components and measurement planes on turbine hardware blueprints. Engineers can hover or click on specific points of the diagram to see tolerance specs and component data.

---

## How It Works

1. A static hero image (e.g., `icv-diagram.jpg`) is rendered as the background of `ValveTab.tsx`.
2. `getValveComponents(valveId)` and `getValvePlanes(valveId)` are called on mount.
3. Both functions query their respective engineering tables, then **join with `turbine_ui_metadata` in memory** to attach X/Y screen coordinates to each component/plane.
4. The coordinates drive absolutely-positioned Framer Motion dots overlaid on the diagram image.
5. Hovering or clicking a dot loads the associated tolerance specifications from the in-memory cache.

---

## Data Join Pattern

```typescript
// In supabase.ts
const combined = engData.map(eng => {
  const ui = uiData.find(u => u.item_id === eng.item_id);
  return { ...eng, x: ui?.x || 0, y: ui?.y || 0, details: ui?.details || '' };
});
```

The join key is `item_id` (components) or `clearance_id` (planes) matched against `turbine_ui_metadata.item_id`.

---

## Coordinate System

- X/Y values in `turbine_ui_metadata` are **percentage-based** relative to the diagram image dimensions.
- Example: `x: 30.5, y: 35` means the hotspot is at 30.5% from the left edge and 35% from the top.
- This makes the overlay responsive — it scales correctly at different viewport sizes.

---

## Known Issue: Misaligned Hotspots

The current diagram hotspots do **not** point to the correct physical sections on the ICV diagram. This is the top priority fix in Phase 4.

**To fix:**
1. Open `icv-diagram.jpg` in an image editor.
2. For each component in the `turbine_ui_metadata` table, identify the correct X/Y position on the actual image.
3. Update the `x` and `y` columns in `turbine_ui_metadata` via Supabase dashboard or a migration script.
4. **Document the methodology used** (how you identified the coordinates) in this file under a new "Coordinate Mapping Methodology" section — this will make building future diagrams much faster.

---

## Adding a New Valve Diagram

When adding diagrams for MCV, MSV, ISV, OCV, or others:

1. Add the diagram image to `public/` (e.g., `mcv-diagram.jpg`).
2. Ensure engineering data for the valve is seeded in Supabase (see `seed-icv.ts` as the reference script).
3. Insert X/Y coordinate records into `turbine_ui_metadata` for each component and plane of the new valve.
4. Update `ValveTab.tsx` to include the new valve as a selectable option.
5. **Record lessons learned here** — note anything non-obvious about the coordinate mapping or image dimensions.

---

## Relevant Files

| File | Role |
|---|---|
| `src/components/ValveTab.tsx` | Diagram viewer, hotspot rendering, Framer Motion animations |
| `src/services/supabase.ts` | `getValveComponents()` and `getValvePlanes()` — data fetch + join |
| `src/types.ts` | `ValveSpecification` and `Plane` interface definitions |
| `public/icv-diagram.jpg` | Static ICV blueprint background image |
| `seed-icv.ts` | Reference script for seeding a new valve's data to Supabase |
