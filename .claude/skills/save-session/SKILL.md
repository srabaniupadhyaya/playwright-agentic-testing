---
name: save-session
description: Use when the user says "save the session", "save this session", or asks to record/log what happened in the current session — writes a session summary to a markdown file in the auto-memory directory and adds a one-line pointer to MEMORY.md.
---

# Save Session

## Overview

Persist what happened in this session so a future session can pick up the
thread. The summary is a memory file in the project's auto-memory directory
(the path named in your system prompt's "auto memory" section), indexed from
`MEMORY.md` like any other memory.

## Workflow

1. **Locate the memory directory** from the system prompt. Read `MEMORY.md`
   and `ls` the directory so you update rather than duplicate.
2. **Pick a topic slug** (kebab-case, 2-4 words, e.g. `cart-tests-generation`).
   File: `session_YYYY-MM-DD_<topic>.md` using today's absolute date. If a file
   with the same date and topic exists, update it instead of creating another.
3. **Write the file** in this format:

   ```markdown
   ---
   name: session-YYYY-MM-DD-<topic>
   description: <one line: what this session accomplished / decided>
   metadata:
     type: project
   ---

   **What happened:** 1-3 sentences.

   **Decisions:** choices made and why (so they aren't re-litigated).

   **Outcomes:** what now exists or works (commits, PRs, files) — verified, not assumed.

   **Open threads / next task:** what to do next and anything blocked.
   ```

4. **Index it.** Append ONE line to `MEMORY.md`, under ~150 characters:
   `- [Session YYYY-MM-DD: <topic>](session_YYYY-MM-DD_<topic>.md) — <hook>`
5. **Report** the file path and the index line. If the memory directory is a
   git repo, mention it has uncommitted changes and show the sync command;
   do NOT commit or push unless the user asks.

## Rules

- Distill; don't dump the transcript. Skip anything derivable from the repo or
  git history (code, diffs). Keep decisions, corrections, dead ends, next steps.
- Absolute dates only — never "today", "yesterday", "last week".
- Never write secrets, tokens, or credentials.
- Facts must reflect verified state. If something was proposed but not done,
  say so.
- `MEMORY.md` is loaded every session and truncates after 200 lines. If it
  passes ~150 lines, tell the user and offer to consolidate old session
  entries into a single summary file rather than letting the index grow.
