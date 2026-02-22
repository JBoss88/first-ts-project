import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const un = page.locator('[data-test="username"]');
  const pw = page.locator('[data-test="password"]');
  const loginBtn = page.locator('[data-test="login-button"]');

  await page.goto('https://www.saucedemo.com/');
  await un.fill('standard_user');
  await pw.fill('secret_sauce');
  await loginBtn.click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
});

test('Make sure item was added to cart', async ({ page }) => {
  const addToCart = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  const badge = page.locator('[data-test="shopping-cart-badge"]');

  await addToCart.click();
  await expect(badge).toHaveText('1');
});

test('Make sure item was removed from cart', async ({ page }) => {
  const addToCart = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  const remove = page.locator('[data-test="remove-sauce-labs-backpack"]');
  const badge = page.locator('[data-test="shopping-cart-badge"]');

  await addToCart.click();
  await remove.click();
  await expect(badge).toBeHidden();
});

test('Test product sort', async ({ page }) => {
  const sort = page.locator('[data-test="product-sort-container"]');

  await sort.selectOption('za');
  await expect(sort).toHaveValue('za'); // proves the option changed
});

test('cart button', async ({ page }) => {
  const cartLink = page.locator('[data-test="shopping-cart-link"]');

  await cartLink.click();
  await expect(page).toHaveURL(/\/cart\.html$/);
});

test('Log out', async ({ page }) => {
  const menu = page.locator('#react-burger-menu-btn');
  const logout = page.locator('[data-test="logout-sidebar-link"]');
  const login = page.locator('[data-test="login-button"]');

  await menu.click();
  await logout.click();
  await expect(login).toContainText('Login');
});

test('About btn', async ({ page }) => {
  const menu = page.locator('#react-burger-menu-btn');
  const about = page.locator('[data-test="about-sidebar-link"]');

  await menu.click();
  await about.click();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Sauce AI' })).toBeVisible();
});

test('Product link', async ({ page }) => {
  const backToProducts = page.locator('[data-test="back-to-products"]');
  const productLink = page.locator('[data-test="item-0-title-link"]');

  await productLink.click();
  await expect(backToProducts).toContainText('Back to products');
});
