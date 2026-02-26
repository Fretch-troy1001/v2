---
description: Record an entry in the Engineer Learning Log notebook to ensure continuity.
---

This workflow standardizes the recording of technical insights, non-obvious fixes, and operational updates to the Learning Log notebook (`5cac4388-e2e0-4a2b-9687-4b1b94de31a5`).

1. Consolidate your recent accomplishments or fixes into a concise "Snag/Solution" format.
2. Ensure you have the correct Notebook ID: `5cac4388-e2e0-4a2b-9687-4b1b94de31a5`.
// turbo
3. Use the `mcp_notebooklm_note` tool with the `create` action:
   - `notebook_id`: `5cac4388-e2e0-4a2b-9687-4b1b94de31a5`
   - `title`: A descriptive title (e.g., "Fix: Vercel Secret Injection")
   - `content`: 
     - **Snag**: [Description of the problem]
     - **Solution**: [Description of the fix/command]
     - **Status**: [Current state]

> [!TIP]
> Always run this workflow after resolving a significant technical hurdle or completing a major feature phase.
