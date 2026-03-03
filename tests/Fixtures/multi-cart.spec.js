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

test('Cart contains Sauce Labs Backpack', async ({ multiCartPage }) => {
  await multiCartPage.click('.shopping_cart_link');

  const cartNames = multiCartPage.locator('.inventory_item_name');
  await expect(cartNames).toContainText(['Sauce Labs Backpack']);
});

test('Cart contains Sauce Labs Bike Light', async ({ multiCartPage }) => {
  await multiCartPage.click('.shopping_cart_link');

  const cartNames = multiCartPage.locator('.inventory_item_name');
  await expect(cartNames).toContainText(['Sauce Labs Bike Light']);
});

test('Cart contains Sauce Labs Bolt T-Shirt', async ({ multiCartPage }) => {
  await multiCartPage.click('.shopping_cart_link');

  const cartNames = multiCartPage.locator('.inventory_item_name');
  await expect(cartNames).toContainText(['Sauce Labs Bolt T-Shirt']);
});

test('Removing one item updates badge to 2', async ({ multiCartPage }) => {
  await multiCartPage.click('[data-test="remove-sauce-labs-backpack"]');

  const badge = multiCartPage.locator('.shopping_cart_badge');
  await expect(badge).toHaveText('2');
});

test('Cart page shows 2 items after one removal', async ({ multiCartPage }) => {
  await multiCartPage.click('[data-test="remove-sauce-labs-backpack"]');
  await multiCartPage.click('.shopping_cart_link');

  const cartItems = multiCartPage.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);
});

test('Cart badge disappears after removing all items', async ({ multiCartPage }) => {
  await multiCartPage.click('[data-test="remove-sauce-labs-backpack"]');
  await multiCartPage.click('[data-test="remove-sauce-labs-bike-light"]');
  await multiCartPage.click('[data-test="remove-sauce-labs-bolt-t-shirt"]');

  const badge = multiCartPage.locator('.shopping_cart_badge');
  await expect(badge).not.toBeVisible();
});
