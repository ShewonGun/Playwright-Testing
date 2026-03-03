const { test, expect } = require('@playwright/test');

test('Mock API response with custom product list', async ({ page }) => {
  // Intercept the page and inject mocked product data via script
  await page.addInitScript(() => {
    window.__mockProducts = true;
  });

  await page.route('**/inventory.html', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `
        <html><body>
          <div class="inventory_item">Product A</div>
          <div class="inventory_item">Product B</div>
          <div class="inventory_item">Product C</div>
        </body></html>
      `
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');
  const items = page.locator('.inventory_item');
  await expect(items).toHaveCount(3);
});

test('Mock login endpoint to return error', async ({ page }) => {
  await page.route('**/login', route => {
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Unauthorized' })
    });
  });

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'any_user');
  await page.fill('#password', 'any_pass');
  await page.click('#login-button');

  // Page should still be on login (URL won't change to inventory)
  await expect(page).not.toHaveURL(/inventory/);
});

test('Abort image requests and verify page still loads', async ({ page }) => {
  await page.route('**/*.png', route => route.abort());
  await page.route('**/*.jpg', route => route.abort());

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Page structure should still load even without images
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('Intercept and modify response headers', async ({ page }) => {
  // Login first so the server doesn't redirect us away from inventory
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForURL(/inventory/);

  // Now set up route interception before navigating to inventory again
  await page.route('**/inventory.html', async route => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: {
        ...response.headers(),
        'x-custom-header': 'playwright-test'
      }
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');
  // Page should still render after header modification
  await expect(page).toHaveURL(/inventory/);
  await expect(page.locator('.inventory_list')).toBeVisible();
});

test('Mock slow network response', async ({ page }) => {
  await page.route('**/inventory.html', async route => {
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
    route.continue();
  });

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await expect(page).toHaveURL(/inventory/);
});
