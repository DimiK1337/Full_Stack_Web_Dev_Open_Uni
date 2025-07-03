const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  let userCredentials
  beforeEach(async ({ page, request }) => {
    // Empty the test db
    await request.post('/api/testing/reset')

    // Create a user
    userCredentials = {
      name: 'Dimitriy Kruglikov',
      username: 'root',
      password: 'sekret'
    }
    await request.post('/api/users', {
      data: userCredentials
    })

    // Launch page
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    // user clicks the login button to trigger the login form to appear
    await page.getByRole('button', { name: 'login' }).click()

    // User credentials inputs are visible
    const usernameInput = page.getByTestId('username')
    const passwordInput = page.getByTestId('password')
    const loginButton = page.locator('button[type="submit"]')
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, userCredentials.username, userCredentials.password)
      await expect(page.getByText(`${userCredentials.name} is logged in`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // wrong credential
      await loginWith(page, userCredentials.username, 'wrong')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    })
  })

  describe('When logged in', () => {
    let blog
    beforeEach(async ({ page }) => {
      await loginWith(page, userCredentials.username, userCredentials.password)
      blog = { title: 'test title', author: 'yomama', url: 'old-chap.bruv.guv.gov.co.uk' }
      await createBlog(page, blog.title, blog.author, blog.url)
    })

    test('a new blog can be created', async ({ page }) => {
      // expect the title + space + author
      const blogDiv = page.locator('.blog')
      await expect(blogDiv.getByText(blog.title)).toBeVisible()
      await expect(blogDiv.getByText(blog.author)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByText('likes 0')
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 1')
    })
  })
})