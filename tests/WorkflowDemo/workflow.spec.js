/**
 * ═══════════════════════════════════════════════════════════════════
 *  COMPLETE PLAYWRIGHT WORKFLOW DEMONSTRATION
 *  Site under test: https://www.saucedemo.com
 * ═══════════════════════════════════════════════════════════════════
 *
 *  This file demonstrates all 6 key Playwright features:
 *
 *  Feature 1 – ASSERTIONS       expect() matchers (URL, text, count…)
 *  Feature 2 – FIXTURES         Reusable test setup via test.extend()
 *  Feature 3 – MOCKING          Network interception via page.route()
 *  Feature 4 – NAVIGATION       Multi-page flows & URL verification
 *  Feature 5 – FORM TESTING     Input validation & submission
 *  Feature 6 – PAGE OBJECT MODEL Selector abstraction for maintainability
 *
 *  Quality Benefits
 *  ────────────────
 *  • Bugs are caught before users encounter them
 *  • Regressions are detected automatically on every run
 *  • Tests document expected behaviour for the whole team
 *  • POM makes tests easy to maintain when UI changes
 *  • Fixtures eliminate setup duplication
 *  • Mocking lets us test edge cases without backend changes
 * ═══════════════════════════════════════════════════════════════════
 */

const base = require('@playwright/test');
const { LoginPage, InventoryPage, CartPage, CheckoutPage, OrderCompletePage } = require('../PageObjects/pages');

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 – FIXTURES: define reusable logged-in state
// ─────────────────────────────────────────────────────────────────────────────
const test = base.test.extend({
  loggedIn: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.waitForLoadState('domcontentloaded');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL(/inventory/);
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});

const expect = base.expect;

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 1 – ASSERTIONS
// Quality: Verifies visible text, element counts, URL patterns, and state
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Feature 1 – Assertions', () => {
  test('Login page has username field, password field and login button', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-button')).toBeEnabled();
  });

  test('Inventory page shows exactly 6 products', async ({ loggedIn }) => {
    await expect(loggedIn.locator('.inventory_item')).toHaveCount(6);
  });

  test('Product names are not empty', async ({ loggedIn }) => {
    const names = loggedIn.locator('.inventory_item_name');
    const count = await names.count();
    for (let i = 0; i < count; i++) {
      await expect(names.nth(i)).not.toBeEmpty();
    }
  });

  test('Product prices contain dollar sign', async ({ loggedIn }) => {
    const prices = loggedIn.locator('.inventory_item_price');
    const count = await prices.count();
    for (let i = 0; i < count; i++) {
      await expect(prices.nth(i)).toContainText('$');
    }
  });

  test('Cart badge is not visible before adding items', async ({ loggedIn }) => {
    await expect(loggedIn.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 – FIXTURES (demonstrated via loggedIn fixture above)
// Quality: Eliminates repeated login code — one change updates all tests
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Feature 2 – Fixtures', () => {
  test('Fixture provides logged-in state automatically', async ({ loggedIn }) => {
    // This test starts already on inventory — no login code needed here
    await expect(loggedIn).toHaveURL(/inventory/);
    await expect(loggedIn.locator('.title')).toHaveText('Products');
  });

  test('Fixture page is ready to interact with immediately', async ({ loggedIn }) => {
    await loggedIn.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(loggedIn.locator('.shopping_cart_badge')).toHaveText('1');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 3 – MOCKING / NETWORK INTERCEPTION
// Quality: Tests edge cases (errors, slow network) without changing the backend
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Feature 3 – Mocking', () => {
  test('Mocked page returns custom HTML content', async ({ page }) => {
    await page.route('**/inventory.html', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1 id="mock">Mocked Inventory</h1></body></html>',
      });
    });
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('#mock')).toHaveText('Mocked Inventory');
  });

  test('Aborted image requests do not break the page structure', async ({ page }) => {
    await page.route('**/*.png', route => route.abort());
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Slow network still completes login successfully', async ({ page }) => {
    await page.route('**/inventory.html', async route => {
      await new Promise(r => setTimeout(r, 500));
      route.continue();
    });
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 4 – NAVIGATION
// Quality: Confirms every route in the app is reachable and correct
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Feature 4 – Navigation', () => {
  test('Cart icon navigates to cart page', async ({ loggedIn }) => {
    await loggedIn.click('.shopping_cart_link');
    await expect(loggedIn).toHaveURL(/cart/);
  });

  test('Continue Shopping returns to inventory', async ({ loggedIn }) => {
    await loggedIn.click('.shopping_cart_link');
    await loggedIn.click('[data-test="continue-shopping"]');
    await expect(loggedIn).toHaveURL(/inventory/);
  });

  test('Clicking product opens detail page', async ({ loggedIn }) => {
    await loggedIn.click('.inventory_item_name >> nth=0');
    await expect(loggedIn).toHaveURL(/inventory-item/);
  });

  test('Back to Products returns to inventory', async ({ loggedIn }) => {
    await loggedIn.click('.inventory_item_name >> nth=0');
    await loggedIn.click('[data-test="back-to-products"]');
    await expect(loggedIn).toHaveURL(/inventory/);
  });

  test('Logout returns to login page', async ({ loggedIn }) => {
    await loggedIn.click('#react-burger-menu-btn');
    await loggedIn.click('[data-test="logout-sidebar-link"]');
    await expect(loggedIn).toHaveURL('https://www.saucedemo.com/');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 5 – FORM TESTING & VALIDATION
// Quality: Ensures forms reject bad input and accept valid data
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Feature 5 – Form Testing', () => {
  test.beforeEach(async ({ loggedIn }) => {
    await loggedIn.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await loggedIn.click('.shopping_cart_link');
    await loggedIn.click('[data-test="checkout"]');
  });

  test('Empty form shows validation error', async ({ loggedIn }) => {
    await loggedIn.click('[data-test="continue"]');
    await expect(loggedIn.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('Partial form shows correct missing field error', async ({ loggedIn }) => {
    await loggedIn.fill('[data-test="firstName"]', 'Test');
    await loggedIn.click('[data-test="continue"]');
    await expect(loggedIn.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('Valid form advances to order overview', async ({ loggedIn }) => {
    await loggedIn.fill('[data-test="firstName"]', 'Test');
    await loggedIn.fill('[data-test="lastName"]', 'User');
    await loggedIn.fill('[data-test="postalCode"]', '10001');
    await loggedIn.click('[data-test="continue"]');
    await expect(loggedIn).toHaveURL(/checkout-step-two/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 6 – PAGE OBJECT MODEL: full end-to-end purchase
// Quality: Readable workflow, single point of maintenance for selectors
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Feature 6 – Page Object Model', () => {
  test('End-to-end purchase using Page Object classes', async ({ page }) => {
    // Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await page.waitForURL(/inventory/);

    // Add to cart
    const inventoryPage = new InventoryPage(page);
    await page.waitForLoadState('domcontentloaded');
    await inventoryPage.addToCartByName('sauce-labs-backpack');
    await inventoryPage.goToCart();

    // Verify cart
    const cartPage = new CartPage(page);
    await expect(cartPage.itemNames).toContainText('Sauce Labs Backpack');
    await cartPage.checkout();

    // Fill form
    const checkoutForm = new CheckoutPage(page);
    await checkoutForm.fillForm('Alice', 'Smith', '90210');
    await checkoutForm.submit();

    // Finish order
    await page.click('[data-test="finish"]');

    // Verify completion
    const completePage = new OrderCompletePage(page);
    await expect(completePage.confirmationHeader).toHaveText('Thank you for your order!');
  });
});
