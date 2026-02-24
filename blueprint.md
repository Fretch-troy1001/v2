# Project Blueprint: GNPD Turbine Dashboard Migration

## Overview
Migrating a GE Turbine operations dashboard from a vanilla HTML/JS/CSS project to a React + TypeScript environment.

## Current Status
- **Styling**: Applied "Deep Navy & Success Green" SaaS aesthetic.
  - Sidebar: Deep Midnight Navy (#141526).
  - Accent: Success Green (#22C55E).
  - Surface: White/Light Grey.
- **Architecture**: React 19 + TypeScript + Express (BFF pattern).
- **Features**: Outage Log (Daily Report), Engineering Tools (Seal Ring OD Calculator, Valve Lock Weld Calculator, Bearing Position Check, ISO 286 Tolerance), Interactive Valve Diagram.

## Migration Plan
1. **Completed**:
    - Ported `main.css` to `src/index.css` and applied new theme.
    - Converted `supabase-client.js` to `src/services/supabase.ts`.
    - Ported `valve-diagram.js` to `ValveTab.tsx`.
    - Created component architecture.
    - Integrated Seal Ring OD Calculator (formerly Valve Dimension Entry) with backend proxy.
    - Integrated Rotor Position Calculator (formerly Bearing Position Check) with fixed-shell reference frame.
    - Integrated ISO 286 Tolerance Calculator.
    - Integrated ICV Clamping Ring Calculator.
    - Updated Outage Log with Daily Report data.
    - Integrated Valve Lock Weld Calculator with backend proxy.
    - Refined UI: Updated dialog titles and removed placeholder tools.
2. **Next Steps**:
    - Verify functionality in preview.
    - Connect real Supabase credentials (currently using fallback).
