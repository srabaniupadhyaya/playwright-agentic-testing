# Test Generation Progress

Tracks generation status against `specs/spec.md`. Update this file whenever a
scenario's spec file is written and passing.

**Status: 6/17 scenarios generated (35%)**

## 1. Login — 4/4 done

| # | Scenario | File | Status |
|---|---|---|---|
| 1.1 | login-with-valid-user | `tests/login/login-with-valid-user.spec.ts` | ✅ |
| 1.2 | reject-invalid-credentials | `tests/login/reject-invalid-credentials.spec.ts` | ✅ |
| 1.3 | reject-locked-out-user | `tests/login/reject-locked-out-user.spec.ts` | ✅ |
| 1.4 | logout | `tests/login/logout.spec.ts` | ✅ |

## 2. Products — 2/2 done

| # | Scenario | File | Status |
|---|---|---|---|
| 2.1 | list-all-products | `tests/products/list-all-products.spec.ts` | ✅ |
| 2.2 | update-cart-badge-on-add | `tests/products/update-cart-badge-on-add.spec.ts` | ✅ |

## 3. Cart — 0/7 done

| # | Scenario | File | Status |
|---|---|---|---|
| 3.1 | add-single-item | `tests/cart/add-single-item.spec.ts` | ⏳ locators verified live, not written |
| 3.2 | sum-multiple-items | `tests/cart/sum-multiple-items.spec.ts` | ❌ |
| 3.3 | increment-quantity | `tests/cart/increment-quantity.spec.ts` | ❌ |
| 3.4 | decrement-quantity | `tests/cart/decrement-quantity.spec.ts` | ❌ |
| 3.5 | auto-remove-at-zero-quantity | `tests/cart/auto-remove-at-zero-quantity.spec.ts` | ❌ |
| 3.6 | remove-item-directly | `tests/cart/remove-item-directly.spec.ts` | ❌ |
| 3.7 | show-empty-cart-state | `tests/cart/show-empty-cart-state.spec.ts` | ❌ |

`tests/pages/cart.page.ts` not yet created.

## 4. Checkout — 2/4 done

| # | Scenario | File | Status |
|---|---|---|---|
| 4.1 | block-empty-submission | `tests/checkout/block-empty-submission.spec.ts` | ✅ |
| 4.2 | place-order-successfully | `tests/checkout/place-order-successfully.spec.ts` | ✅ |
| 4.3 | clear-cart-after-order | `tests/checkout/clear-cart-after-order.spec.ts` | ❌ |
| 4.4 | cancel-checkout | `tests/checkout/cancel-checkout.spec.ts` | ❌ |

`tests/pages/checkout.page.ts` created.

## Notes

- Generation follows the `playwright-cli` skill's plan → generate → heal
  workflow directly against `specs/spec.md` (see
  `.claude/skills/playwright-cli/references/spec-driven-testing.md`) — there
  is no separate code-level implementation plan; one existed at
  `docs/superpowers/plans/2026-07-06-playwright-test-suite.md` but was
  removed after its exact POM code drifted from what's actually in the repo.
- `tests/pages/products.page.ts` uses a simplified shape (`heading`,
  `itemCount`, `productHeading()`, `addToCartButton()`, `getCartCount()`)
  compared to the original design doc — this is the current real shape to
  match when building `CartPage`/`CheckoutPage`.
- Scenario/file names dropped the `should-` prefix (deviating from the
  `playwright-cli` skill's default kebab-case-matches-filename convention);
  the `Should ...` wording now lives only in the `test()` title string. See
  `docs/playwright-best-practices.md`.
- Run `npx playwright test --project=chromium` to verify current passing
  state at any point.
