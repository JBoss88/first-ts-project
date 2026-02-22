import { test, expect } from '@playwright/test';

test.describe(async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
  });

  test('Continue shopping btn', async ({ page }) => {
    const continueShopping = page.locator('[data-test="continue-shopping"]');
    const productSort = page.locator('[data-test="product-sort-container"]');

    await continueShopping.click();
    await expect(productSort).toBeVisible();
  });

  test('Checkout btn', async ({ page }) => {
    const checkoutBtn = page.locator('[data-test="checkout"]');
    const checkoutTitle = page.locator('[data-test="title"]');

    await checkoutBtn.click();
    await expect(checkoutTitle).toContainText('Checkout: Your Information');
  });

  test('Twitter link', async ({ page }) => {
    const twitterLink = page.locator('[data-test="social-twitter"]');

    const popup = await Promise.all([page.waitForEvent('popup'), twitterLink.click()]).then(
      ([p]) => p,
    );

    await popup.waitForLoadState(); // optional but nice
    await expect(popup).toHaveURL(/^https:\/\/x\.com\/saucelabs\/?$/);
  });
});
