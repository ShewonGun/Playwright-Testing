const { test, expect } = require('./fixtures');

test('Overview page shows correct URL', async ({ checkoutOverviewPage }) => {
  await expect(checkoutOverviewPage).toHaveURL(/checkout-step-two/);
});

test('Overview page shows the ordered item', async ({ checkoutOverviewPage }) => {
  const itemName = checkoutOverviewPage.locator('.inventory_item_name');
  await expect(itemName).toBeVisible();
  await expect(itemName).toContainText('Sauce Labs Backpack');
});

test('Finish button completes the order from overview', async ({ checkoutOverviewPage }) => {
  await checkoutOverviewPage.click('[data-test="finish"]');
  await expect(checkoutOverviewPage).toHaveURL(/checkout-complete/);
  const header = checkoutOverviewPage.locator('.complete-header');
  await expect(header).toHaveText('Thank you for your order!');
});


