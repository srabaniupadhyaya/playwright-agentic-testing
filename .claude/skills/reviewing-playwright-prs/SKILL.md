---
name: reviewing-playwright-prs
description: Use when reviewing a GitHub pull request that touches this repo's Playwright tests, page objects, or fixtures — checks the diff against this repo's testing conventions (locator priority, no-hard-waits, POM boundaries, fixture usage, spec/seed sync) before approving or leaving comments.
---

# Reviewing Playwright PRs

## Overview

This repo's automated PR reviews (`/code-review`, `/security-review`) check
correctness and security generically. This skill adds the project-specific
checks those miss: whether new/changed Playwright code follows the
conventions in `CLAUDE.md` and `docs/playwright-best-practices.md`.

**REQUIRED BACKGROUND:** Read `docs/playwright-best-practices.md` in full
before reviewing — this skill assumes it, and doesn't repeat it verbatim.

## When to Use

- A PR adds/modifies files under `tests/**` (specs, page objects, fixtures).
- Before approving, merging, or leaving review comments on such a PR.
- Not needed for PRs that only touch config, CI, or docs.

## Workflow

1. **Get the diff.** `gh pr diff <number>` or `gh pr view <number> --json files`
   to see which files changed.
2. **Run the mechanical checks first** (fast, catches most issues):
   ```bash
   npx tsc --noEmit          # must pass — this repo's only enforced pre-commit check
   npx playwright test <changed spec files> --project=chromium
   ```
3. **Walk the diff against the checklist below**, file by file.
4. **Leave comments** referencing the specific convention violated (cite the
   doc section, e.g. "see Locator priority in playwright-best-practices.md")
   rather than just asserting a preference.

## Checklist

**Fixtures & imports**
- [ ] Spec imports `test`/`expect` from `tests/fixtures.ts` (unauthenticated,
      login-only scenarios) or `tests/fixtures-authenticated.ts` (everything
      else) — never directly from `@playwright/test`.
- [ ] Login-form scenarios live under `tests/login/`; everything else uses
      the authenticated fixture.

**Locators** (see full priority order in playwright-best-practices.md)
- [ ] Prefers `getByRole` > `getByLabel`/`getByPlaceholder` > `getByText`
      (exact) > `getByTestId` > CSS/XPath, in that order.
- [ ] No new CSS/XPath locators unless justified (last resort only).
- [ ] No brittle structural chains (`.locator('div > span:nth-child(2)')`) —
      scoped role/text locators instead.
- [ ] Cart line items use **−** (U+2212) and **×** (U+00D7), not ASCII
      `-`/`x`, if the diff touches cart locators/assertions.

**Waits & assertions**
- [ ] No `page.waitForTimeout()` or manual sleeps anywhere in the diff — flag
      immediately, this is a hard rule.
- [ ] Actions whose UI depends on a network response wrap the action in
      `page.waitForResponse()`/`waitForRequest()` inside the same
      `Promise.all` as the triggering action (not awaited sequentially).
- [ ] Assertions use web-first `expect(locator).toBeVisible()`/`.toHaveText()`/
      etc., not `.isVisible()`/`.textContent()` read-then-assert.
- [ ] Checkout required-field validation is asserted via focus/`:invalid`,
      not by checking for visible custom error text (native HTML5 validation).

**Page Object Model**
- [ ] New/changed POM methods either return a `Locator` or perform an action
      (`login()`, `addToCart()`) — never silently combine an action with an
      `expect(...)` inside the POM.
- [ ] All `expect(...)` calls live in the `.spec.ts` file, not the POM.
- [ ] Test files stay thin — compose POM locators/methods rather than raw
      `page.getByRole(...)` calls for elements the POM already exposes.

**Naming & spec sync**
- [ ] Spec filenames have no `should-` prefix; the `test()` title string
      starts with `Should` (e.g. `test('Should login with valid user', ...)`).
- [ ] New/changed scenarios are reflected in `specs/spec.md` (and
      `specs/progress.md` if present) under the matching section, with the
      `.spec.ts` file's leading `// spec:`/`// seed:` comments pointing back
      to it.

**Config & secrets**
- [ ] No hardcoded URLs/timeouts — these come from `config/config.json` via
      `playwright.config.ts`.
- [ ] No real credentials introduced; `config/config.json` stays gitignored.

**Commit hygiene** (if reviewing commits, not just the diff)
- [ ] Commit subjects use a semantic prefix (`fix`/`feat`/`chore`/`docs`/
      `test`/`devops`).
- [ ] `npx tsc --noEmit` passes.

## Common Mistakes to Flag

| Symptom in diff | Likely violation |
|---|---|
| `await page.waitForTimeout(...)` | Hard wait — replace with a web-first assertion |
| `.locator('.some-class')` for new scenario | Should use role/text/testid locator instead |
| `expect(...)` inside a `.page.ts` file | POM/assertion boundary violation |
| `import { test } from '@playwright/test'` | Should import from one of the two fixture files |
| Cart total/qty assertions using `-`/`x` | Wrong Unicode char (need `−` U+2212 / `×` U+00D7) |
| New spec file with no `specs/spec.md` entry | Spec source-of-truth out of sync |
| `toBeVisible()` on checkout error text | HTML5 validation isn't rendered text — assert `:invalid` |
