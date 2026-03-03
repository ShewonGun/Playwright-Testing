/**
 * PAGE OBJECT MODEL (POM)
 * ─────────────────────────────────────────────────────────────────
 * Each class wraps a page's locators and actions.
 * Tests import these instead of repeating selectors everywhere.
 *
 * Quality Benefit:
 *  - Single place to update selectors if the UI changes
 *  - Tests read like plain English
 *  - Reduces code duplication across spec files
 */

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }
}

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async addToCartByName(productName) {
    const slug = productName.toLowerCase().replace(/ /g, '-');
    await this.page.click(`[data-test="add-to-cart-${slug}"]`);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }
}

class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
  }

  async fillForm(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async submit() {
    await this.continueButton.click();
  }
}

class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.itemName = page.locator('.inventory_item_name');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async finish() {
    await this.finishButton.click();
  }
}

class OrderCompletePage {
  constructor(page) {
    this.page = page;
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }
}

module.exports = {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage,
  CheckoutOverviewPage,
  OrderCompletePage,
};
