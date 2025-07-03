import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { test, expect, vi } from 'vitest'

test('renders only blog title and author', async () => {
  const blog = {
    title: 'Popular blog 1',
    author: 'ya boi',
    url: 'yomama.com'
  }

  render(<Blog blog={blog}/>)

  const element = screen.findByText(`${blog.title} ${blog.author}`)
  //screen.debug(element)
  expect(element).toBeDefined()

  // Make sure only title and author are visible -> if the button text (name) is 'view' then they are hidden
  const viewButton = screen.queryByRole('button', { name: 'view' })
  expect(viewButton).toBeDefined()

  const hideButton = screen.queryByRole('button', { name: 'hide' })
  expect(hideButton).toBeNull()
})

test('when the view button is clicked, the url and likes count are also rendered', async () => {
  const blog = {
    title: 'Popular blog 1',
    author: 'ya boi',
    url: 'yomama.com',
    likes: 10
  }

  render(<Blog blog={blog}/>)

  const viewButton = screen.queryByRole('button', { name: 'view' })
  expect(viewButton).toBeDefined()

  const user = userEvent.setup()
  await user.click(viewButton)

  // Check that the url and like count are defined
  const urlText = await screen.findByText(blog.url)
  expect(urlText).toBeDefined()

  const likesText = await screen.findByText(`likes ${blog.likes}`)
  expect(likesText).toBeDefined()
})

test('when the like button is pressed twice, the likes will increment by 2', async () => {
  const blog = {
    title: 'Popular blog 1',
    author: 'ya boi',
    url: 'yomama.com',
    likes: 10
  }

  const clickLikeHandler = vi.fn()
  render(<Blog blog={blog} handleLikeClick={clickLikeHandler}/>)

  const viewButton = screen.queryByRole('button', { name: 'view' })
  expect(viewButton).toBeDefined()

  const user = userEvent.setup()
  await user.click(viewButton)

  const likesButton = screen.queryByRole('button', { name: 'like' })
  expect(likesButton).toBeDefined()

  await user.click(likesButton)
  await user.click(likesButton)
  expect(clickLikeHandler.mock.calls).toHaveLength(2)
})
