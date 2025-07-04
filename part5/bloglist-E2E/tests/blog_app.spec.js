const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createUser, createBlog } = require('./helper')

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
    createUser(request, userCredentials)

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
      blog = { title: 'test title 1', author: 'yomama', url: 'old-chap.bruv.guv.gov.co.uk' }
      //await createBlog(page, blog.title, blog.author, blog.url)
      await createBlog(page, blog)
    })

    test('a new blog can be created', async ({ page }) => {
      // expect the title + space + author
      const blogDiv = page.locator('.blog')
      await expect(blogDiv.getByText(blog.title)).toBeVisible()
      await expect(blogDiv.getByText(blog.author)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()

      // Add this line since the delete button would disappear, fixed by populating the user in the updated blog
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

    })

    test('user who added a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      page.on('dialog', async dialog => {
        console.log(`dialog message: ${dialog.message()}`)
        await dialog.accept()
        console.log('dialog accepted')
      })
      await page.getByRole('button', { name: 'delete' }).click()
      const blogDiv = page.locator('.blog').filter({ hasText: `${blog.title} ${blog.author}` })
      await expect(blogDiv).not.toBeVisible()
    }) 

    test('only the user who added the blog sees the blog\'s delete button', async ({ page, request }) => {
      // Make another user who posts a blog -> root can't see delete button
      const logoutButton = await page.getByRole('button', { name: 'logout' })
      await expect(logoutButton).toBeVisible()
      await logoutButton.click()
      const testUserCredentials = { ...userCredentials, username: 'test-user', name: 'CHAD-SAN' }
      await createUser(request, testUserCredentials)
      await loginWith(page, testUserCredentials.username, testUserCredentials.password)

      const testUserBlog = { ...blog, title: 'test title 2' }
      await createBlog(page, testUserBlog)
      await expect(page.locator('.blog').getByText(testUserBlog.title)).toBeVisible()
      const rootUserBlogDiv = await page.getByText(blog.title)
      await rootUserBlogDiv.getByRole('button', { name: 'view' }).click()
      await expect(rootUserBlogDiv.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('the list of blogs is displayed in descending order sorted by likes', async ({ page }) => {
      // Order of blogs --> [b1 (2 likes), b2 (1 likes), b0 (0 likes)]
      const blogs = [
        blog, { ...blog, title: 'test title 2' }, { ...blog, title: 'test title 3' }
      ]
      blogs.slice(1).forEach(async b => await createBlog(page, b))

      // Find the divs of each blogs
      const blog0Div = page.locator('.blog').filter({ hasText: blogs[0].title }) // Keep at 0 likes
      const blog1Div = page.locator('.blog').filter({ hasText: blogs[1].title }) // 2 likes
      const blog2Div = page.locator('.blog').filter({ hasText: blogs[2].title }) // 1 likes

      // Click the view button of each blog and press like n-times
      await blog0Div.getByRole('button', { name: 'view' }).click()
      await blog1Div.getByRole('button', { name: 'view' }).click()
      await blog2Div.getByRole('button', { name: 'view' }).click()

      await blog1Div.getByRole('button', { name: 'like' }).click()
      await expect(blog1Div.getByText('likes 1')).toBeVisible()
      await blog1Div.getByRole('button', { name: 'like' }).click()
      await expect(blog1Div.getByText('likes 2')).toBeVisible()
      
      await blog2Div.getByRole('button', { name: 'like' }).click()
      await expect(blog2Div.getByText('likes 1')).toBeVisible()
      
      await expect(blog0Div.getByText('likes 0')).toBeVisible()
      
      // Check the order of the blogs
      const blogDivs = page.locator('.blog')
      await expect(blogDivs.nth(0)).toContainText(blogs[1].title)
      await expect(blogDivs.nth(1)).toContainText(blogs[2].title)
      await expect(blogDivs.nth(2)).toContainText(blogs[0].title)
    })
  })
})