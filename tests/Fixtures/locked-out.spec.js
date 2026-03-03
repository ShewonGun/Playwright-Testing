const { test, expect } = require('./fixtures');

test('Locked out user sees error message', async ({ lockedOutPage }) => {
  const error = lockedOutPage.locator('[data-test="error"]');
  await expect(error).toBeVisible();
});

test('Locked out user error contains correct text', async ({ lockedOutPage }) => {
  const error = lockedOutPage.locator('[data-test="error"]');
  await expect(error).toContainText('Sorry, this user has been locked out');
});

test('Locked out user stays on login page', async ({ lockedOutPage }) => {
  await expect(lockedOutPage).toHaveURL('https://www.saucedemo.com/');
});

test('Locked out user does not see inventory', async ({ lockedOutPage }) => {
  const inventory = lockedOutPage.locator('.inventory_list');
  await expect(inventory).not.toBeVisible();
});

test('Locked out user error can be dismissed', async ({ lockedOutPage }) => {
  const closeBtn = lockedOutPage.locator('[data-test="error-button"]');
  await closeBtn.click();

  const error = lockedOutPage.locator('[data-test="error"]');
  await expect(error).not.toBeVisible();
});

test('Login button is still visible after locked out error', async ({ lockedOutPage }) => {
  const loginBtn = lockedOutPage.locator('#login-button');
  await expect(loginBtn).toBeVisible();
  await expect(loginBtn).toBeEnabled();
});
