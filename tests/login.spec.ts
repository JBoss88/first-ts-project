import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Test login', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await expect(login.page).toHaveURL(/\/inventory\.html$/);
});

test('Test empty username', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('', '');
  await expect(login.errorMessage).toContainText('Username is required');
});

test('Locked out user', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('locked_out_user', 'secret_sauce');
  await expect(login.errorMessage).toContainText('locked out');
});
