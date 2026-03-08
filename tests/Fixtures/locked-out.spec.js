const { test, expect } = require('./fixtures');

test('Locked out user sees error message', async ({ lockedOutPage }) => {
  const error = lockedOutPage.locator('[data-test="error"]');
  await expect(error).toBeVisible();
});

test('Locked out user stays on login page', async ({ lockedOutPage }) => {
  await expect(lockedOutPage).toHaveURL('https://www.saucedemo.com/');
});


