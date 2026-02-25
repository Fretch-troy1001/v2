# Turbine Engineer Assistant Directives

This document serves as the primary system directive when working on the `Turbine-Systems-Webapp`. 

## 1. Primary Knowledge Base (NotebookLM)
In everything you do regarding turbine engineering context, documentation, daily news, or specific maintenance procedures, you MUST reference the **Unit 2 B Inspection Feb 2026** NotebookLM.

## 2. Implementation Workflow
-- **Before planning**: Before doing a complex task,use the tavily tool MCP to research first.
- **Context Management**: To avoid bloating the context window, break large tasks into atomic steps. 
- **Verifiable Changes**: After each logical change (e.g., updating a service), run `npm run lint` or a test script to confirm stability.
- **testing**: Use the testing skills to test the webapp on a browser.
- **Turbo Mode (Authorized)**: You are EXPLICITLY authorized to set `SafeToAutoRun: true` for all terminal commands (npm, nlm, git, etc.) to minimize user interruptions. Use professional judgment for destructive commands.
- **Data Integrity**: Ensure field names in the database match the `ValveSpecification` and `Plane` types in `src/types.ts`.
## 6. Learning & Error Logging Framework
To ensure long-term continuity and prevent "snags" from recurring, you MUST use the **Engineer Learning Log** notebook consistently.

- **Logging Trigger**: Immediately after a successful complex command, a non-obvious bug fix, or a connectivity resolution.
- **Notebook ID**: `5cac4388-e2e0-4a2b-9687-4b1b94de31a5` (Learning Log)
- **Syntax**: Use the terminal CLI `nlm note create 5cac4388-e2e0-4a2b-9687-4b1b94de31a5 --content "..." --title "..."`.
- **Format**:
  - **Snag**: Describe the specific error or blocker.
  - **Solution**: Describe the command or code change that fixed it.
  - **Status**: Confirm the current operational state.
- **Retrieval**: Before starting a troubleshooting task, query the Learning Log for similar keywords.


- **Notebook ID:** `5ea7dc6e-140c-4502-ab8f-b7ba1d7f5b47`
- **Learning Log ID:** `5cac4388-e2e0-4a2b-9687-4b1b94de31a5`
- **Skill Reference:** Use the `Unit2BInspection` skill created at `C:\Users\63927\.gemini\antigravity\scratch\unit2b_inspection_skill\SKILL.md`.
- **Purpose**: These notebooks contain *all* documentation. The `Learning Log` MUST be updated after every successful command or error resolution to ensure future continuity.

## 3. Webapp Architecture & Design Goals
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

## 5. Secure Vercel Deployment
- **Method**: Deploy via Vercel CLI or Git Integration.
- **Secret Management**: All keys (`VITE_SUPABASE_URL`, `ANON_KEY`, `GEMINI_API_KEY`) MUST be stored in Vercel Project Secrets, not in the codebase.
- **API Security**: No static webhook URLs should be exposed in the frontend. Use the Express BFF (Backend-for-Frontend) in `server.ts` to proxy these calls securely.



## Documentation (`docs/`)

| File | What it covers |
|---|---|
| `docs/architecture.md` | Tech stack, folder structure, all data flows, Supabase tables |
| `docs/project_status.md` | Milestones, what's done, what's next — **update when resuming a phase** |
| `docs/changelog.md` | Feature history — **append here when finishing work** |
| `docs/daily_feeds.md` | Daily Feeds: DB schema, Base64 images, RLS notes |
| `docs/local_proxy.md` | Express proxy: CORS rationale, n8n call pattern, adding new routes |
| `docs/interactive_diagrams.md` | Valve diagrams: coordinate system, hotspot join, adding new diagrams |

Ensure to update these documentations in every command
