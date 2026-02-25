# Interactive Valve Diagrams Documentation

## Component Architecture
Interactive diagrams are centralized in `src/components/ValveTab.tsx`.

## Blueprint & Overlay Logic
- **Hero Image**: A high-resolution blueprint (e.g., `icv-diagram.jpg`) stored in `public/`.
- **Coordinate System**: Mapped hotspots using percentage-based positioning for responsive scaling.
- **Data Join**: Hotspots are linked via `component_id` to the `Turbine Valves Component database` in Supabase.

## Adding New Diagrams
1. Upload the high-res image to `public/`.
2. Define the new diagram's metadata in the `turbine_ui_metadata` Supabase table.
3. Map component IDs to exact (x, y) coordinates.
4. Update `ValveTab.tsx` to include the new background asset and trigger logic.

## Interactive States
- **Hover**: Uses `framer-motion` for pulsing markers.
- **Select**: Triggers a side-panel or overlay populated with engineering specs (Tolerance fits, materials, etc.) fetched in real-time.

---
> [!TIP]
> Use standard percentage units (`%`) for coordinates to ensure hotspots remain pinned correctly even when the image scales on different screen sizes.
