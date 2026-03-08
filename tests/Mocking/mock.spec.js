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

test('Mock page returns 200 status', async ({ page }) => {
  await page.route('**/inventory.html', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body><p id="ok">OK</p></body></html>'
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('#ok')).toHaveText('OK');
});

test('Mocked page can contain multiple elements', async ({ page }) => {
  await page.route('**/inventory.html', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<html><body>
        <div class="item">A</div>
        <div class="item">B</div>
        <div class="item">C</div>
      </body></html>`
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.item')).toHaveCount(3);
});

test('Abort CSS requests and page still renders login form', async ({ page }) => {
  await page.route('**/*.css', route => route.abort());

  await page.goto('https://www.saucedemo.com/');
  await expect(page.locator('#login-button')).toBeVisible();
  await expect(page.locator('#user-name')).toBeVisible();
});