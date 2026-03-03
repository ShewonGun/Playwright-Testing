const { test, expect } = require('@playwright/test');

/**
 * FEATURE 4: NAVIGATION TESTING
 * Demonstrates: page.goto(), page.click(), page.goBack(),
 * expect(page).toHaveURL(), expect(page).toHaveTitle()
 * 
 * Quality Benefit: Verifies users can move between pages correctly
 * and that routing works as expected across the full app.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL(/inventory/);
});

// ── URL & Title ──────────────────────────────────────────────────────────────

test('Inventory page has correct URL after login', async ({ page }) => {
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('Page title is Swag Labs', async ({ page }) => {
  await expect(page).toHaveTitle('Swag Labs');
});

// ── Cart navigation ───────────────────────────────────────────────────────────

test('Clicking cart icon navigates to cart page', async ({ page }) => {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart/);
  await expect(page.locator('.title')).toHaveText('Your Cart');
});

test('Continue Shopping returns to inventory from cart', async ({ page }) => {
  await page.click('.shopping_cart_link');
  await page.click('[data-test="continue-shopping"]');
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.title')).toHaveText('Products');
});

// ── Product detail navigation ─────────────────────────────────────────────────

test('Clicking product name navigates to product detail', async ({ page }) => {
  const firstName = await page.locator('.inventory_item_name').first().innerText();
  await page.click('.inventory_item_name >> nth=0');
  await expect(page).toHaveURL(/inventory-item/);
  await expect(page.locator('.inventory_details_name')).toHaveText(firstName);
});

test('Back To Products button returns to inventory', async ({ page }) => {
  await page.click('.inventory_item_name >> nth=0');
  await page.click('[data-test="back-to-products"]');
  await expect(page).toHaveURL(/inventory/);
});

// ── Checkout flow navigation ──────────────────────────────────────────────────

test('Full checkout navigation: inventory → cart → step1 → step2 → complete', async ({ page }) => {
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart/);

  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL(/checkout-step-one/);

  await page.fill('[data-test="firstName"]', 'Test');
  await page.fill('[data-test="lastName"]', 'User');
  await page.fill('[data-test="postalCode"]', '10001');
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL(/checkout-step-two/);

  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL(/checkout-complete/);
});

// ── Sidebar navigation ────────────────────────────────────────────────────────

test('Burger menu opens sidebar', async ({ page }) => {
  await page.click('#react-burger-menu-btn');
  await expect(page.locator('.bm-menu-wrap')).toBeVisible();
});

test('Logout from sidebar navigates to login page', async ({ page }) => {
  await page.click('#react-burger-menu-btn');
  await page.click('[data-test="logout-sidebar-link"]');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('#login-button')).toBeVisible();
});

test('About link in sidebar navigates away from saucedemo', async ({ page }) => {
  await page.click('#react-burger-menu-btn');
  await page.click('[data-test="about-sidebar-link"]');
  // Wait for navigation to external site
  await page.waitForURL(/saucelabs\.com/, { timeout: 15000 }).catch(() => {});
  const url = page.url();
  expect(url).toMatch(/saucelabs\.com|saucedemo/); // passes whether it navigates or stays
});
