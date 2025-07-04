const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createUser = async (request, userCredentials) => await request.post('/api/users', { data: userCredentials })

const createBlog = async (page, blog ) => {
  const { title, author, url } = blog
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.locator('#title-input').fill(title)
  await page.locator('#author-input').fill(author)
  await page.locator('#url-input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`Added a new blog titled '${title}' by '${author}'`).waitFor()
}

export { loginWith, createUser, createBlog }