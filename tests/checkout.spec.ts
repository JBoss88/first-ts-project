import { test, expect, type Page } from '@playwright/test';

//Cart tests in checkout file for easier flow

async function fillCheckoutInfo(page: Page) {
  await page.locator('[data-test="firstName"]').fill('Jackson');
  await page.locator('[data-test="lastName"]').fill('Boss');
  await page.locator('[data-test="postalCode"]').fill('64083');
}

test.beforeEach(async ({ page }) => {
  // Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);

  const addProduct = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  const inventoryItem = page.locator('[data-test="inventory-item-name"]');
  const shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');

  // Add to cart and verify
  await addProduct.click();
  await shoppingCartLink.click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(inventoryItem).toContainText('Sauce Labs Backpack');
});

test('Item was removed from cart', async ({ page }) => {
  const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
  const badge = page.locator('[data-test="shopping-cart-badge"]');

  await removeBtn.click();
  await expect(badge).toBeHidden();
});

test('Input info and click continue', async ({ page }) => {
  const checkoutBtn = page.locator('[data-test="checkout"]');
  const fn = page.locator('[data-test="firstName"]');
  const continueBtn = page.locator('[data-test="continue"]');
  const checkoutTitle = page.locator('[data-test="title"]');

  await checkoutBtn.click();
  await expect(fn).toBeEnabled();
  await fillCheckoutInfo(page);
  await continueBtn.click();
  await expect(checkoutTitle).toContainText('Checkout: Overview');
});

test('Cancel btn', async ({ page }) => {
  const checkoutBtn = page.locator('[data-test="checkout"]');
  const cancelBtn = page.locator('[data-test="cancel"]');
  const cartTitle = page.locator('[data-test="title"]');

  await checkoutBtn.click();
  await expect(cancelBtn).toBeVisible();
  await expect(cancelBtn).toBeEnabled();
  await cancelBtn.click();
  await expect(cartTitle).toContainText('Cart');
});

test('Empty name input', async ({ page }) => {
  const checkoutBtn = page.locator('[data-test="checkout"]');
  const fn = page.locator('[data-test="firstName"]');
  const continueBtn = page.locator('[data-test="continue"]');
  const error = page.locator('[data-test="error"]');

  await checkoutBtn.click();
  await fn.fill('');
  await continueBtn.click();
  await expect(error).toContainText('Error: First Name is required');
});

test('Finish btn', async ({ page }) => {
  const checkoutBtn = page.locator('[data-test="checkout"]');
  const fn = page.locator('[data-test="firstName"]');
  const continueBtn = page.locator('[data-test="continue"]');
  const checkoutTitle = page.locator('[data-test="title"]');
  const finishBtn = page.locator('[data-test="finish"]');

  await checkoutBtn.click();
  await expect(fn).toBeEnabled();
  await fillCheckoutInfo(page);
  await continueBtn.click();

  await finishBtn.click();
  await expect(checkoutTitle).toContainText('Checkout: Complete!');
});
