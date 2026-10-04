---
name: remove-worktrees
description: Use when the user asks to remove, clean up, or delete git worktrees (e.g. the sibling worktrees created for side PRs) — verifies nothing is lost, unlinks node_modules junctions first so the main checkout's node_modules survives, then removes them.
---

# Remove Worktrees

## Overview

Side branches in this repo are often built in sibling worktrees (e.g.
`../playwright-agentic-testing-readme`) with `node_modules` joined to the main
checkout by a Windows junction (`mklink /J`) and `config/config.json` copied in.
A forced removal can follow that junction and delete the **main checkout's**
`node_modules`, so the junction must be unlinked first.

## Workflow

1. **List** with `git worktree list`. Never touch the main checkout (first
   entry) or any worktree the user did not name.
2. **Verify each target is safe to delete** (run from the main checkout):
   - `git -C <wt> status --short | grep -v '^ M'` — no untracked/staged files
     that matter (ignored `config/config.json` and the `node_modules` junction
     are expected).
   - `git -C <wt> diff --ignore-cr-at-eol --stat` — empty. Remaining ` M` files
     are usually CRLF noise from `core.autocrlf=true` + `prettier --write`.
   - `git -C <wt> log origin/<branch>..HEAD --oneline` — empty (no unpushed
     commits). If the branch was never pushed, stop and ask.
   If any check shows real content, stop and report; do not force-remove.
3. **Unlink junctions first**: `cmd //c "rmdir <wt>\\node_modules"` (removes
   the link only, never its target). Do the same for any other junction.
4. **Remove**: `git worktree remove --force <wt>` (`--force` is needed because
   of the CRLF-only modifications and ignored files).
5. **Confirm**: `git worktree list` shows only the main checkout; the
   directory is gone; `ls node_modules | wc -l` in the main checkout matches
   the count from before step 3 (capture it first).
6. **Leave branches alone.** They still back open PRs. Tell the user they can
   run `git branch -d <branch>` after the PRs merge; don't delete them.

## Gotchas

- Read/Edit tools can't see files outside the main checkout (blocked by
  `blockReadsOutsideWorkingDirectories`); use Bash for worktree inspection.
- Don't use `rm -rf` on a worktree directory while a junction is inside it.
- Don't remove a worktree whose branch has an unmerged, unpushed commit.
