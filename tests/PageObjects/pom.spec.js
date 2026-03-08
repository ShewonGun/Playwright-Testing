const { test, expect } = require('@playwright/test');
const {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage,
  CheckoutOverviewPage,
  OrderCompletePage,
} = require('./pages');

/**
 * FEATURE 6: PAGE OBJECT MODEL (POM)
 * ─────────────────────────────────────────────────────────────────
 * Tests use page classes instead of raw selectors.
 * Notice how tests read like plain English steps.
 *
 * Quality Benefit:
 *  - If a selector changes, only the page class needs updating
 *  - Tests are shorter, readable, and self-documenting
 *  - Encourages reuse across multiple spec files
 */

// ── Login page tests ─────────────────────────────────────────────────────────

test('POM: Login page loads correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});

test('POM: Invalid login shows error via LoginPage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('wrong_user', 'wrong_pass');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText('Username and password do not match');
});

test('POM: Standard user can login via LoginPage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  await expect(page).toHaveURL(/inventory/);
});

// ── Inventory page tests ──────────────────────────────────────────────────────

test('POM: Inventory shows 6 products via InventoryPage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  const inventoryPage = new InventoryPage(page);
  await expect(inventoryPage.title).toHaveText('Products');
  await expect(inventoryPage.inventoryItems).toHaveCount(6);
});

test('POM: Adding item updates cart badge via InventoryPage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  const inventoryPage = new InventoryPage(page);
  await page.waitForLoadState('domcontentloaded');
  await inventoryPage.addToCartByName('sauce-labs-backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('POM: Logout via InventoryPage returns to login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.logout();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(loginPage.loginButton).toBeVisible();
});

// ── Cart page tests ───────────────────────────────────────────────────────────

test('POM: Cart shows added item via CartPage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  const inventoryPage = new InventoryPage(page);
  await page.waitForLoadState('domcontentloaded');
  await inventoryPage.addToCartByName('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const cartPage = new CartPage(page);
  await expect(cartPage.title).toHaveText('Your Cart');
  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.itemNames).toContainText('Sauce Labs Backpack');
});

// ── Full end-to-end workflow via POM ─────────────────────────────────────────

test('POM: Complete purchase workflow end-to-end', async ({ page }) => {
  // Step 1: Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();
  await page.waitForURL(/inventory/);

  // Step 2: Add item to cart
  const inventoryPage = new InventoryPage(page);
  await page.waitForLoadState('domcontentloaded');
  await inventoryPage.addToCartByName('sauce-labs-backpack');
  await inventoryPage.goToCart();

  // Step 3: Proceed to checkout
  const cartPage = new CartPage(page);
  await expect(cartPage.cartItems).toHaveCount(1);
  await cartPage.checkout();

  // Step 4: Fill checkout form
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillForm('Alice', 'Smith', '90210');
  await checkoutPage.submit();

  // Step 5: Confirm overview
  const overviewPage = new CheckoutOverviewPage(page);
  await expect(overviewPage.title).toHaveText('Checkout: Overview');
  await expect(overviewPage.itemName).toContainText('Sauce Labs Backpack');
  await overviewPage.finish();

  // Step 6: Order complete
  const completePage = new OrderCompletePage(page);
  await expect(completePage.confirmationHeader).toHaveText('Thank you for your order!');
  await expect(page).toHaveURL(/checkout-complete/);
});

test('POM: Cart checkout button navigates to checkout form', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  const inventoryPage = new InventoryPage(page);
  await page.waitForLoadState('domcontentloaded');
  await inventoryPage.addToCartByName('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const cartPage = new CartPage(page);
  await cartPage.checkout();

  await expect(page).toHaveURL(/checkout-step-one/);
});

test('POM: CheckoutPage submit with valid data advances to overview', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsStandardUser();

  const inventoryPage = new InventoryPage(page);
  await page.waitForLoadState('domcontentloaded');
  await inventoryPage.addToCartByName('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const cartPage = new CartPage(page);
  await cartPage.checkout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillForm('Bob', 'Jones', '10001');
  await checkoutPage.submit();

  await expect(page).toHaveURL(/checkout-step-two/);
});
