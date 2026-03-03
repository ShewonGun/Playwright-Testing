const base = require('@playwright/test');

exports.test = base.test.extend({
  // Fixture: logged-in page on the inventory screen
  loggedInPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL(/inventory/);
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },

  // Fixture: cart page with one item already added
  cartPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL(/inventory/);
    await page.waitForLoadState('domcontentloaded');
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await use(page);
  },

  // Fixture: checkout step one page (personal info form)
  checkoutPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL(/inventory/);
    await page.waitForLoadState('domcontentloaded');
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await use(page);
  },

  // Fixture: product detail page (first product)
  productDetailPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.click('.inventory_item_name >> nth=0');
    await use(page);
  },

  // Fixture: checkout overview page (step 2) with one item
  checkoutOverviewPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '10001');
    await page.click('[data-test="continue"]');
    await use(page);
  },

  // Fixture: logged-in page as a locked-out user
  lockedOutPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await use(page);
  },

  // Fixture: inventory page with multiple items in cart
  multiCartPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL(/inventory/);
    await page.waitForLoadState('domcontentloaded');
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    await use(page);
  },
});

exports.expect = base.expect;