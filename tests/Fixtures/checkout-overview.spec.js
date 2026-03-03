const { test, expect } = require('./fixtures');

test('Overview page shows correct URL', async ({ checkoutOverviewPage }) => {
  await expect(checkoutOverviewPage).toHaveURL(/checkout-step-two/);
});

test('Overview page has Checkout: Overview title', async ({ checkoutOverviewPage }) => {
  const title = checkoutOverviewPage.locator('.title');
  await expect(title).toHaveText('Checkout: Overview');
});

test('Overview page shows the ordered item', async ({ checkoutOverviewPage }) => {
  const itemName = checkoutOverviewPage.locator('.inventory_item_name');
  await expect(itemName).toBeVisible();
  await expect(itemName).toContainText('Sauce Labs Backpack');
});

test('Overview page shows item price', async ({ checkoutOverviewPage }) => {
  const price = checkoutOverviewPage.locator('.inventory_item_price');
  await expect(price).toBeVisible();
  await expect(price).toContainText('$');
});

test('Overview page shows payment information section', async ({ checkoutOverviewPage }) => {
  const paymentLabel = checkoutOverviewPage.locator('[data-test="payment-info-label"]');
  await expect(paymentLabel).toBeVisible();
  await expect(paymentLabel).toHaveText('Payment Information:');
});

test('Overview page shows shipping information section', async ({ checkoutOverviewPage }) => {
  const shippingLabel = checkoutOverviewPage.locator('[data-test="shipping-info-label"]');
  await expect(shippingLabel).toBeVisible();
  await expect(shippingLabel).toHaveText('Shipping Information:');
});

test('Overview page shows total price label', async ({ checkoutOverviewPage }) => {
  const total = checkoutOverviewPage.locator('.summary_total_label');
  await expect(total).toBeVisible();
  await expect(total).toContainText('Total:');
});

test('Finish button completes the order from overview', async ({ checkoutOverviewPage }) => {
  await checkoutOverviewPage.click('[data-test="finish"]');
  await expect(checkoutOverviewPage).toHaveURL(/checkout-complete/);
  const header = checkoutOverviewPage.locator('.complete-header');
  await expect(header).toHaveText('Thank you for your order!');
});

test('Cancel button on overview returns to inventory', async ({ checkoutOverviewPage }) => {
  await checkoutOverviewPage.click('[data-test="cancel"]');
  await expect(checkoutOverviewPage).toHaveURL(/inventory/);
});
