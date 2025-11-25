import { test, expect } from '@playwright/test';

test('dashboard loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.getByText('Churn Overview')).toBeVisible();
});

test('login page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.getByText('Login')).toBeVisible();
});
