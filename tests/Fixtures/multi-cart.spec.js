const { test, expect } = require('./fixtures');

test('Cart badge shows 3 after adding 3 items', async ({ multiCartPage }) => {
  const badge = multiCartPage.locator('.shopping_cart_badge');
  await expect(badge).toHaveText('3');
});

test('Cart page lists all 3 added items', async ({ multiCartPage }) => {
  await multiCartPage.click('.shopping_cart_link');

  const cartItems = multiCartPage.locator('.cart_item');
  await expect(cartItems).toHaveCount(3);
});


