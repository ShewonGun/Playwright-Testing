const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});

test('Product detail page has correct title', async ({ page }) => {
  await page.click('.inventory_item_name >> nth=0');

  const productName = page.locator('.inventory_details_name');
  await expect(productName).toBeVisible();
  await expect(productName).not.toBeEmpty();
});

test('Product detail page has a price', async ({ page }) => {
  await page.click('.inventory_item_name >> nth=0');

  const price = page.locator('.inventory_details_price');
  await expect(price).toBeVisible();
  await expect(price).toContainText('$');
});

test('Product detail page has Add to Cart button', async ({ page }) => {
  await page.click('.inventory_item_name >> nth=0');

  const addToCartBtn = page.locator('button[data-test^="add-to-cart"]');
  await expect(addToCartBtn).toBeVisible();
  await expect(addToCartBtn).toBeEnabled();
});

test('Products are sorted by name A-Z by default', async ({ page }) => {
  const names = page.locator('.inventory_item_name');
  const count = await names.count();

  const allNames = [];
  for (let i = 0; i < count; i++) {
    allNames.push(await names.nth(i).innerText());
  }

  const sorted = [...allNames].sort();
  expect(allNames).toEqual(sorted);
});
