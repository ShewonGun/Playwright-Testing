const { test, expect } = require('@playwright/test');

test('Mock inventory page', async ({ page }) => {

  await page.route('**/inventory.html', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<h1>Mocked Inventory Page</h1>'
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');

  await expect(page.locator('h1')).toHaveText('Mocked Inventory Page');
});