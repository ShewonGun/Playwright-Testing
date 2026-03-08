const { test, expect } = require('./fixtures');

// --- loggedInPage fixture ---

test('Add item to cart', async ({ loggedInPage }) => {
  await loggedInPage.click('.inventory_item button');
  await loggedInPage.click('.shopping_cart_link');

  const cartItems = loggedInPage.locator('.cart_item');
  await expect(cartItems).toHaveCount(1);
});

// --- cartPage fixture ---

test('Cart page displays the added item name', async ({ cartPage }) => {
  const itemName = cartPage.locator('.inventory_item_name');
  await expect(itemName).toContainText('Sauce Labs Backpack');
});

// --- checkoutPage fixture ---

test('Checkout page has first name field', async ({ checkoutPage }) => {
  const firstNameField = checkoutPage.locator('[data-test="firstName"]');
  await expect(firstNameField).toBeVisible();
  await expect(firstNameField).toBeEditable();
});

