## Summary

<!-- What and why, 1-3 bullets. Title format: `<label>: <summary>` (fix, feat, chore, docs, test, devops). -->

-

<!-- If this PR adds new tests, describe each one as a Gherkin scenario (delete this block otherwise).
     One Scenario per test, named like the test title; keep steps at user level, not API level. -->

```gherkin
Feature: <feature or screen, e.g. Cart>

  Scenario: <matches the test() title, e.g. Should increment quantity>
    Given <starting state, e.g. "Codemify Backpack" is in the cart>
    When <user action, e.g. I click "+" on its line>
    Then <observable outcome, e.g. the line shows "$29.99 × 2 = $59.98">
```

## Test plan

<!-- Paste real results, not intentions. If anything failed or flaked, say what, and whether it reproduced. -->

- [ ] `npx tsc --noEmit`
- [ ] `npm run format:check`
- [ ] `npx playwright test <affected specs> --project=chromium`: result:
- [ ] (optional, Linux parity) `npm run test:docker -- <affected specs> --project=chromium`: result:
- [ ] Full suite on chromium, firefox and webkit (CI)

## Checklist

- [ ] `specs/spec.md` in sync (scenario names and `**File:**` lines), or n/a
- [ ] New app quirks added to `CLAUDE.md` "Notable app behavior", or n/a
- [ ] Follows `docs/playwright-best-practices.md` (locator priority, no hard waits, assertions in specs only)
- [ ] Links the plan/spec in `docs/superpowers/` if one exists
- [ ] No unrelated changes included
