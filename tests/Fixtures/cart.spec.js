const { test, expect } = require('./fixtures');

// --- loggedInPage fixture ---

test('Add item to cart', async ({ loggedInPage }) => {
  await loggedInPage.click('.inventory_item button');
  await loggedInPage.click('.shopping_cart_link');

  const cartItems = loggedInPage.locator('.cart_item');
  await expect(cartItems).toHaveCount(1);
});

test('Inventory page shows Products header', async ({ loggedInPage }) => {
  const header = loggedInPage.locator('.title');
  await expect(header).toHaveText('Products');
});

test('Multiple items can be added to cart', async ({ loggedInPage }) => {
  const buttons = loggedInPage.locator('.inventory_item button');
  await buttons.nth(0).click();
  await buttons.nth(1).click();

  const badge = loggedInPage.locator('.shopping_cart_badge');
  await expect(badge).toHaveText('2');
});

// --- cartPage fixture ---

test('Cart page displays the added item name', async ({ cartPage }) => {
  const itemName = cartPage.locator('.inventory_item_name');
  await expect(itemName).toContainText('Sauce Labs Backpack');
});

test('Cart page shows correct item quantity', async ({ cartPage }) => {
  const quantity = cartPage.locator('.cart_quantity');
  await expect(quantity).toHaveText('1');
});

// --- checkoutPage fixture ---

test('Checkout page has first name field', async ({ checkoutPage }) => {
  const firstNameField = checkoutPage.locator('[data-test="firstName"]');
  await expect(firstNameField).toBeVisible();
  await expect(firstNameField).toBeEditable();
});

test('Checkout page shows error when submitted empty', async ({ checkoutPage }) => {
  await checkoutPage.click('[data-test="continue"]');

  const error = checkoutPage.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('First Name is required');
});

// --- productDetailPage fixture ---

test('Product detail page has a description', async ({ productDetailPage }) => {
  const description = productDetailPage.locator('.inventory_details_desc');
  await expect(description).toBeVisible();
  await expect(description).not.toBeEmpty();
});

test('Product detail page back button returns to inventory', async ({ productDetailPage }) => {
  await productDetailPage.click('[data-test="back-to-products"]');
  await expect(productDetailPage).toHaveURL(/inventory/);
});