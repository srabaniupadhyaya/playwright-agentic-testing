# Codemify Store E2E Test Plan

## Application Overview

Codemify Store is a small e-commerce demo app used to exercise Playwright
testing patterns. It requires login before showing any products (three
username states: valid, locked-out, invalid), lists 6 products with
"Add to Cart", supports per-line quantity adjustment and removal in the
cart, and checks out via a single shipping+payment form with native HTML5
required-field validation. A successful order clears the cart and shows a
confirmation with the order total.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. login-with-valid-user

**File:** `tests/login/login-with-valid-user.spec.ts`

**Steps:**
  1. Fill "Username" with "standard_user" and "Password" with "my_secret_code", click "Login"
    - expect: a heading "Products" is visible

#### 1.2. reject-invalid-credentials

**File:** `tests/login/reject-invalid-credentials.spec.ts`

**Steps:**
  1. Fill "Username" with "wrong_user" and "Password" with "wrong_pass", click "Login"
    - expect: text "Username and password do not match any user in this service" is visible

#### 1.3. reject-locked-out-user

**File:** `tests/login/reject-locked-out-user.spec.ts`

**Steps:**
  1. Fill "Username" with "locked_out_user" and "Password" with "my_secret_code", click "Login"
    - expect: text "Sorry, this user has been locked out." is visible

#### 1.4. logout

**File:** `tests/login/logout.spec.ts`

**Steps:**
  1. Fill "Username" with "standard_user" and "Password" with "my_secret_code", click "Login"
    - expect: a heading "Products" is visible
  2. Click "Logout"
    - expect: text "Please login to continue" is visible

---

### 2. Products

**Seed:** `tests/seed-authenticated.spec.ts`

#### 2.1. list-all-products

**File:** `tests/products/list-all-products.spec.ts`

**Steps:**
  1. Load the Products page
    - expect: "6 items" text is visible
    - expect: "Codemify Backpack" heading is visible
    - expect: "Codemify Bike Light" heading is visible
    - expect: "Codemify Bolt T-Shirt" heading is visible
    - expect: "Codemify Fleece Jacket" heading is visible
    - expect: "Codemify Onesie" heading is visible
    - expect: "Test.allTheThings() T-Shirt (Red)" heading is visible

#### 2.2. update-cart-badge-on-add

**File:** `tests/products/update-cart-badge-on-add.spec.ts`

**Steps:**
  1. Click "Add to Cart" on "Codemify Backpack"
    - expect: cart badge shows count 1
  2. Click "Add to Cart" on "Codemify Bike Light"
    - expect: cart badge shows count 2

---

### 3. Cart

**Seed:** `tests/seed-authenticated.spec.ts`

#### 3.1. add-single-item

**File:** `tests/cart/add-single-item.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart from Products, open the cart
    - expect: line item shows "$29.99 × 1 = $29.99"
    - expect: total is "$29.99"

#### 3.2. sum-multiple-items

**File:** `tests/cart/sum-multiple-items.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" ($29.99) and "Codemify Bike Light" ($9.99) to cart, open the cart
    - expect: total is "$39.98"

#### 3.3. increment-quantity

**File:** `tests/cart/increment-quantity.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart, open the cart, click "+" on its line
    - expect: line item shows "$29.99 × 2 = $59.98"
    - expect: total is "$59.98"

#### 3.4. decrement-quantity

**File:** `tests/cart/decrement-quantity.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart twice, open the cart, click "−" on its line once
    - expect: line item shows "$29.99 × 1 = $29.99"
    - expect: total is "$29.99"

#### 3.5. auto-remove-at-zero-quantity

**File:** `tests/cart/auto-remove-at-zero-quantity.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart, open the cart, click "−" on its line once
    - expect: "Codemify Backpack" line item is not visible
    - expect: empty cart message is visible

#### 3.6. remove-item-directly

**File:** `tests/cart/remove-item-directly.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" and "Codemify Bike Light" to cart, open the cart, click "Remove" on "Codemify Backpack"
    - expect: "Codemify Backpack" line item is not visible
    - expect: "Codemify Bike Light" line item is still visible

#### 3.7. show-empty-cart-state

**File:** `tests/cart/show-empty-cart-state.spec.ts`

**Steps:**
  1. Open the cart without adding any items
    - expect: empty cart message is visible
    - expect: "Proceed to Checkout" button is not visible

---

### 4. Checkout

**Seed:** `tests/seed-authenticated.spec.ts`

#### 4.1. block-empty-submission

**File:** `tests/checkout/block-empty-submission.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart, proceed to checkout, click "Complete Order" without filling any field
    - expect: the "First Name *" field receives focus (native required validation blocks submission)
    - expect: no "Order Placed Successfully!" confirmation appears

#### 4.2. place-order-successfully

**File:** `tests/checkout/place-order-successfully.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart, proceed to checkout, fill all shipping and payment fields, click "Complete Order"
    - expect: "Order Placed Successfully!" heading is visible
    - expect: order total text contains "$29.99"

#### 4.3. clear-cart-after-order

**File:** `tests/checkout/clear-cart-after-order.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart, complete checkout, click "Continue Shopping", open the cart again
    - expect: empty cart message is visible

#### 4.4. cancel-checkout

**File:** `tests/checkout/cancel-checkout.spec.ts`

**Steps:**
  1. Add "Codemify Backpack" to cart, proceed to checkout, click "Cancel"
    - expect: "Your Shopping Cart" heading is visible
    - expect: "Codemify Backpack" line item is still visible
