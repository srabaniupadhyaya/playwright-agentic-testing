---
name: debugging-failing-playwright-tests
description: Use when a Playwright test in this repo fails, is flaky, times out, or a locator can't be found — reproduces the failure, inspects the trace/report, and roots out the cause before touching test code.
---

# Debugging Failing Playwright Tests

## Overview

Failing Playwright tests almost always leave enough evidence (HTML report,
trace, screenshot, video) to find root cause without guessing. Read the
evidence before editing anything.

**REQUIRED BACKGROUND:** superpowers:systematic-debugging — this skill is
that process applied specifically to Playwright failures in this repo.

## When to Use

- `npx playwright test` reports a failure, timeout, or flaky retry.
- A locator can't be found / strict-mode violation.
- A test passes locally but fails in CI, or vice versa.

## Workflow

1. **Reproduce narrowly.** Re-run just the failing test, one browser:
   ```bash
   npx playwright test <file>:<line> --project=chromium
   ```
   If it doesn't reproduce, it's flaky — capture the trace on a few runs
   (`--retries=2`) before concluding it's environmental.

2. **Read the HTML report first.** `npx playwright show-report` — shows the
   error message, expected vs. actual, and the step where it failed. Don't
   skip straight to the trace; the report often names the exact problem.

3. **Open the trace for anything non-obvious.** Every failed test writes
   `test-results/<test-name>/trace.zip`. Use the **playwright-trace** skill:
   - `trace actions --errors-only` → find the failing action
   - `trace action <id>` → params, logs, source location
   - `trace snapshot <id>` → DOM state at the moment of failure
   - `trace requests --failed` / `trace console --errors-only` → network or
     JS errors that caused it, not just the symptom

4. **Form a hypothesis, then check it against the repo's known quirks**
   before assuming the app or Playwright is wrong:
   - Cart button reads `"Cart"` when empty, never `"Cart 0"`.
   - Cart lines use **−** (U+2212) and **×** (U+00D7), not ASCII `-`/`x` —
     a locator with the wrong character silently fails to match.
   - Decrementing a cart line to 0 auto-removes it — no "Remove" step to wait
     for.
   - Checkout required fields use native HTML5 validation — asserting
     `toBeVisible()` on error text will always fail; check `:invalid`/focus.
   - A successful checkout clears the cart — a subsequent assertion expecting
     leftover items is wrong, not the app.
   - `--debug=cli` doesn't pause interactively in this repo's Playwright
     version; use `playwright-cli open` + `state-load` to reproduce live
     instead (see the `playwright-cli` skill's session-management doc).

5. **Reproduce live if the trace isn't enough.** Use the `playwright-cli`
   skill to open the app, load the same storage state
   (`.playwright/.auth/user.json` for authenticated flows), and drive the
   same steps interactively — confirms whether it's a locator/timing issue
   or a real app regression.

6. **Fix at the right layer**, per this repo's conventions
   (`docs/playwright-best-practices.md`, `CLAUDE.md`):
   - Wrong locator → fix in the Page Object, not the spec.
   - Timing/race → replace with a web-first assertion or `waitForResponse`
     inside the same `Promise.all` as the triggering action; never add
     `page.waitForTimeout()`.
   - Genuine app bug → don't "fix" the test to match broken behavior; flag it.

7. **Verify.** Re-run the specific test across all three projects before
   declaring it fixed:
   ```bash
   npx playwright test <file>
   ```

## Fetching Traces from a CI Failure

CI (`.github/workflows/playwright.yml`) runs on push/PR to `main`/`master`
and uploads the whole `playwright-report/` directory (report + traces, since
`trace: 'on-first-retry'`) as a single artifact named `playwright-report`.
Use the `gh` CLI to pull it down instead of re-running the suite blind:

```bash
# 1. Find the failed run (for the current branch's PR, or by workflow)
gh run list --workflow=playwright.yml --branch=<branch> --limit=5
gh run list --workflow=playwright.yml --status=failure --limit=5

# 2. See which job/step failed and the raw log for it
gh run view <run-id> --log-failed

# 3. Download the report+trace artifact for that run
gh run download <run-id> -n playwright-report -D /tmp/ci-playwright-report

# 4. Open the report locally
npx playwright show-report /tmp/ci-playwright-report

# 5. Or jump straight to a trace inside it
npx playwright trace open /tmp/ci-playwright-report/data/<test>/trace.zip
```

If `-n playwright-report` doesn't match (name/casing changed), list what the
run actually produced first: `gh run view <run-id> --json artifacts` or
`gh api repos/{owner}/{repo}/actions/runs/<run-id>/artifacts`.

No trace file for the failing test in the artifact usually means it passed
on the first attempt and only failed after a retry that didn't get traced —
check `retries` in `playwright.config.ts` and the `--log-failed` output for
the actual error instead.

## Quick Reference

| Symptom | Likely cause | Where to look |
|---|---|---|
| Locator not found / strict-mode violation | Wrong role/text, or Unicode char (−/×) mismatch | `trace snapshot <id>` accessibility tree |
| Timeout waiting for element | Missing `waitForResponse`, or assertion racing a re-render | `trace requests`, `trace actions` timing |
| Passes alone, fails in full suite | Shared state leaking between tests (storage, cart) | Check fixture/global-setup isolation |
| Flaky across retries | Hard-coded wait or animation timing | Grep the spec/POM for `waitForTimeout` |
| Fails only in CI | `headless`/timeout config, or viewport-dependent locator | `config/config.json`, trace screenshot |
| Checkout error assertion fails | Asserting visible text on native HTML5 validation | Assert `:invalid`/focus instead |

## Common Mistakes

- Editing the spec's assertion to match a failure without reading the trace
  first — often the real bug is in the Page Object's locator, not the spec.
- Adding `page.waitForTimeout()` to "fix" a race — always a symptom of a
  missing `waitForResponse`/web-first assertion, never a real fix.
- Assuming `--debug=cli` will pause — it doesn't in this repo; use
  `playwright-cli open` + `state-load` instead.
