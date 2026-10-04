# CI: GitHub Actions for Playwright Tests

## Goal

Run the full Playwright suite on every push/PR via GitHub Actions,
building `config/config.json` from GitHub repo variables instead of
committing or copying `config.example.json`.

## Why variables, not the example file

`config/config.json` is gitignored and normally created locally via
`cp config/config.example.json config/config.json`. CI has no local
copy step to rely on, so the value is built from GitHub Actions
repository variables instead. These are public demo credentials (not
real secrets), so plain **variables** are appropriate — they show up
unmasked in logs, which is fine here and easier to debug than masked
secrets. If this app ever needs real credentials, switch these to
**secrets** (`${{ secrets.* }}`) instead.

## Variables to add (Settings → Secrets and variables → Actions → Variables tab)

| Variable name      | Value (seed from config.example.json) |
|-------------------|----------------------------------------|
| `DEMO_BASE_URL`    | `https://codemify-demo-app.vercel.app` |
| `DEMO_APP_PATH`    | `/demo-app`                            |
| `DEMO_USERNAME`    | `standard_user`                        |
| `DEMO_PASSWORD`    | `my_secret_code`                       |

Timeouts and `headless` stay fixed CI defaults (not secrets) —
`30000` / `30000` / `15000`, `headless: true` — same as
`config.example.json`.

## Workflow changes

File: `.github/workflows/playwright.yml`

1. **Add a "Create config" step** before "Run Playwright tests", using
   the variables above to write `config/config.json`. Use a heredoc so
   the file is well-formed JSON:

   ```yaml
   - name: Create config
     env:
       DEMO_BASE_URL: ${{ vars.DEMO_BASE_URL }}
       DEMO_APP_PATH: ${{ vars.DEMO_APP_PATH }}
       DEMO_USERNAME: ${{ vars.DEMO_USERNAME }}
       DEMO_PASSWORD: ${{ vars.DEMO_PASSWORD }}
     run: |
       cat > config/config.json <<EOF
       {
         "environment": "ci",
         "baseUrl": "${DEMO_BASE_URL}",
         "demoAppPath": "${DEMO_APP_PATH}",
         "credentials": {
           "username": "${DEMO_USERNAME}",
           "password": "${DEMO_PASSWORD}"
         },
         "timeouts": {
           "defaultTimeout": 30000,
           "navigationTimeout": 30000,
           "actionTimeout": 15000
         },
         "headless": true
       }
       EOF
   ```

2. **Swap the test step** from `npx playwright test` to
   `npm run test:ci` (uses the existing `line,html` reporter config
   from `package.json`).

3. **Leave the artifact upload step as-is** — it already uploads
   `playwright-report/` on any non-cancelled run.

## Full resulting workflow

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Create config
      env:
        DEMO_BASE_URL: ${{ vars.DEMO_BASE_URL }}
        DEMO_APP_PATH: ${{ vars.DEMO_APP_PATH }}
        DEMO_USERNAME: ${{ vars.DEMO_USERNAME }}
        DEMO_PASSWORD: ${{ vars.DEMO_PASSWORD }}
      run: |
        cat > config/config.json <<EOF
        {
          "environment": "ci",
          "baseUrl": "${DEMO_BASE_URL}",
          "demoAppPath": "${DEMO_APP_PATH}",
          "credentials": {
            "username": "${DEMO_USERNAME}",
            "password": "${DEMO_PASSWORD}"
          },
          "timeouts": {
            "defaultTimeout": 30000,
            "navigationTimeout": 30000,
            "actionTimeout": 15000
          },
          "headless": true
        }
        EOF
    - name: Run Playwright tests
      run: npm run test:ci
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Steps to implement

- [ ] Add the four repo variables in GitHub (Settings → Secrets and
      variables → Actions → Variables tab → New repository variable).
- [ ] Update `.github/workflows/playwright.yml` with the "Create
      config" step and the `npm run test:ci` swap.
- [ ] Run `npx tsc --noEmit` locally (repo pre-commit check).
- [ ] Commit with a `devops:` prefix (e.g.
      `devops: build CI config.json from GitHub Actions variables`).
- [ ] Push / open a PR and confirm the workflow run creates
      `config/config.json` correctly and the suite passes.

## Verification

- Workflow run logs show the "Create config" step succeeding
  (variable values are visible in plaintext in the logs — expected,
  since these are public demo values, not secrets).
- Test run proceeds past login (confirms `config.json` was written
  with valid credentials).
- `playwright-report` artifact uploads on completion.
