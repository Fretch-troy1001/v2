# Turbine Engineer Assistant Directives

This document serves as the primary system directive when working on the `Turbine-Systems-Webapp`. 

## 1. Primary Knowledge Base (NotebookLM)
In everything you do regarding turbine engineering context, documentation, daily news, or specific maintenance procedures, you MUST reference the **Unit 2 B Inspection Feb 2026** NotebookLM.

- **Notebook ID:** `5ea7dc6e-140c-4502-ab8f-b7ba1d7f5b47`
- **Skill Reference:** Use the `Unit2BInspection` skill created at `C:\Users\63927\.gemini\antigravity\scratch\unit2b_inspection_skill\SKILL.md`.
- **Purpose**: This notebook contains *all* the documentation of the user's work as a turbine engineer. Treat it as the absolute source of truth for daily news (diary), tool formulas/data, and diagram definitions.

## 2. Webapp Architecture & Design Goals
- Use the [TurbineWebappFramework](file:///C:/Users/63927/.gemini/antigravity/scratch/turbine_webapp_framework_skill/SKILL.md) to maintain the premium React/Vite stack.
- Use the [Unit2BInspection](file:///C:/Users/63927/.gemini/antigravity/scratch/unit2b_inspection_skill/SKILL.md) skill to ensure all engineering diagrams and calculator values are strictly mapped to the 'Unit 2 B inspection Feb 2026' NotebookLM data.
- **High-Quality & Bug-Free:** The standard is absolute perfection. 
- **Premium Design ("Wow" Factor):** 
  - Do NOT use basic/generic boxy designs. 
  - Utilize **glassmorphism** (translucent backgrounds with background blur like `backdrop-blur-xl bg-white/10`).
  - Use smooth, subtle gradients and vibrant, tailored HSL color palettes.
  - Integrate **micro-animations** (using Framer Motion/`motion` package, already in `package.json`) for all interactions (hover states, page transitions).
  - Use modern typography (e.g., Inter or Outfit via Google Fonts).
- **Core Sections to Maintain/Enhance:**
  1. **Daily News / Diary:** A log/diary system driven by the user's daily documentation.
  2. **Tools:** Calculators and utilities (Seal Ring OD, Valve Lock Weld, Bearing Position, ISO 286).
  3. **Interactive Diagrams:** High-quality diagrams mapped with component tooltips (e.g., valve diagram, plane/turbine diagrams).

## 4. Supabase Integration (Live)
- **Project URL:** `https://zzawcdwmfzibvqprphfz.supabase.co`
- **Secret Management:** Credentials are stored in `.env`. Never hardcode secrets in source files.
- **Migration Strategy (Small Steps):**
    1. **Probe**: Identify existing tables in the provided Supabase project.
    2. **Sync**: If tables are empty, seed them with the high-fidelity ICV data from `ValveTab.tsx`.
    3. **Connect**: Update `src/services/supabase.ts` to prioritize live data over fallbacks.
    4. **Verify**: Test each section (Diary, Tools, Diagrams) individually after connecting.

## 5. Implementation Workflow
- **Context Management**: To avoid bloating the context window, break large tasks into atomic steps. 
- **Verifiable Changes**: After each logical change (e.g., updating a service), run `npm run lint` or a test script to confirm stability.
- **Data Integrity**: Ensure field names in the database match the `ValveSpecification` and `Plane` types in `src/types.ts`.
