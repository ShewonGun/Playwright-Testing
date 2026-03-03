const { test, expect } = require('@playwright/test');

/**
 * FEATURE 5: FORM TESTING & INPUT VALIDATION
 * Demonstrates: page.fill(), form submission, error handling,
 * field validation, and successful form completion.
 *
 * Quality Benefit: Ensures form fields enforce required input,
 * display meaningful errors, and accept valid data correctly.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL(/inventory/);
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');
});

// ── Field visibility & interactivity ─────────────────────────────────────────

test('Checkout form has three input fields', async ({ page }) => {
  await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  await expect(page.locator('[data-test="lastName"]')).toBeVisible();
  await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
});

test('All checkout fields are editable', async ({ page }) => {
  await expect(page.locator('[data-test="firstName"]')).toBeEditable();
  await expect(page.locator('[data-test="lastName"]')).toBeEditable();
  await expect(page.locator('[data-test="postalCode"]')).toBeEditable();
});

test('Fields accept typed input', async ({ page }) => {
  await page.fill('[data-test="firstName"]', 'Alice');
  await page.fill('[data-test="lastName"]', 'Smith');
  await page.fill('[data-test="postalCode"]', '90210');

  await expect(page.locator('[data-test="firstName"]')).toHaveValue('Alice');
  await expect(page.locator('[data-test="lastName"]')).toHaveValue('Smith');
  await expect(page.locator('[data-test="postalCode"]')).toHaveValue('90210');
});

// ── Validation errors ─────────────────────────────────────────────────────────

test('Empty form shows First Name required error', async ({ page }) => {
  await page.click('[data-test="continue"]');
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('First Name is required');
});

test('Missing last name shows Last Name required error', async ({ page }) => {
  await page.fill('[data-test="firstName"]', 'Alice');
  await page.click('[data-test="continue"]');
  await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
});

test('Missing postal code shows Postal Code required error', async ({ page }) => {
  await page.fill('[data-test="firstName"]', 'Alice');
  await page.fill('[data-test="lastName"]', 'Smith');
  await page.click('[data-test="continue"]');
  await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
});

test('Error message can be dismissed', async ({ page }) => {
  await page.click('[data-test="continue"]');
  await page.click('[data-test="error-button"]');
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();
});

// ── Successful submission ─────────────────────────────────────────────────────

test('Valid form submission advances to checkout overview', async ({ page }) => {
  await page.fill('[data-test="firstName"]', 'Alice');
  await page.fill('[data-test="lastName"]', 'Smith');
  await page.fill('[data-test="postalCode"]', '90210');
  await page.click('[data-test="continue"]');

  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');
});

test('Order summary shows correct item after form submission', async ({ page }) => {
  await page.fill('[data-test="firstName"]', 'Alice');
  await page.fill('[data-test="lastName"]', 'Smith');
  await page.fill('[data-test="postalCode"]', '90210');
  await page.click('[data-test="continue"]');

  await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
});

test('Order completes with thank you confirmation', async ({ page }) => {
  await page.fill('[data-test="firstName"]', 'Alice');
  await page.fill('[data-test="lastName"]', 'Smith');
  await page.fill('[data-test="postalCode"]', '90210');
  await page.click('[data-test="continue"]');
  await page.click('[data-test="finish"]');

  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await expect(page.locator('.complete-text')).toContainText('dispatched');
});

// ── Cancel behaviour ──────────────────────────────────────────────────────────

test('Cancel button on checkout form returns to cart', async ({ page }) => {
  await page.click('[data-test="cancel"]');
  await expect(page).toHaveURL(/cart/);
});
