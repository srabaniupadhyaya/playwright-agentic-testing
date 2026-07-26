# Test Generation Progress

Tracks generation status against `specs/spec.md`. Update this file whenever a
scenario's spec file is written and passing.

**Status: 6/17 scenarios generated (35%)**

## 1. Login — 4/4 done

| # | Scenario | File | Status |
|---|---|---|---|
| 1.1 | should-login-with-valid-user | `tests/login/should-login-with-valid-user.spec.ts` | ✅ |
| 1.2 | should-reject-invalid-credentials | `tests/login/should-reject-invalid-credentials.spec.ts` | ✅ |
| 1.3 | should-reject-locked-out-user | `tests/login/should-reject-locked-out-user.spec.ts` | ✅ |
| 1.4 | should-logout | `tests/login/should-logout.spec.ts` | ✅ |

## 2. Products — 2/2 done

| # | Scenario | File | Status |
|---|---|---|---|
| 2.1 | should-list-all-products | `tests/products/should-list-all-products.spec.ts` | ✅ |
| 2.2 | should-update-cart-badge-on-add | `tests/products/should-update-cart-badge-on-add.spec.ts` | ✅ |

## 3. Cart — 0/7 done

| # | Scenario | File | Status |
|---|---|---|---|
| 3.1 | should-add-single-item | `tests/cart/should-add-single-item.spec.ts` | ⏳ locators verified live, not written |
| 3.2 | should-sum-multiple-items | `tests/cart/should-sum-multiple-items.spec.ts` | ❌ |
| 3.3 | should-increment-quantity | `tests/cart/should-increment-quantity.spec.ts` | ❌ |
| 3.4 | should-decrement-quantity | `tests/cart/should-decrement-quantity.spec.ts` | ❌ |
| 3.5 | should-auto-remove-at-zero-quantity | `tests/cart/should-auto-remove-at-zero-quantity.spec.ts` | ❌ |
| 3.6 | should-remove-item-directly | `tests/cart/should-remove-item-directly.spec.ts` | ❌ |
| 3.7 | should-show-empty-cart-state | `tests/cart/should-show-empty-cart-state.spec.ts` | ❌ |

`tests/pages/cart.page.ts` not yet created.

## 4. Checkout — 0/4 done

| # | Scenario | File | Status |
|---|---|---|---|
| 4.1 | should-block-empty-submission | `tests/checkout/should-block-empty-submission.spec.ts` | ❌ |
| 4.2 | should-place-order-successfully | `tests/checkout/should-place-order-successfully.spec.ts` | ❌ |
| 4.3 | should-clear-cart-after-order | `tests/checkout/should-clear-cart-after-order.spec.ts` | ❌ |
| 4.4 | should-cancel-checkout | `tests/checkout/should-cancel-checkout.spec.ts` | ❌ |

`tests/pages/checkout.page.ts` not yet created.

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
- Run `npx playwright test --project=chromium` to verify current passing
  state at any point.
