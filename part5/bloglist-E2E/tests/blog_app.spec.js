const { test, expect, beforeEach, describe } = require('@playwright/test')


describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // user clicks the login button to trigger the login form to appear
    await page.getByRole('button', { name: 'login' }).click()

    // User credentials inputs are visible
    const usernameInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    const loginButton = page.locator('button[type="submit"]')
    expect(usernameInput).toBeVisible()
    expect(passwordInput).toBeVisible()
    expect(loginButton).toBeVisible()
  })
})