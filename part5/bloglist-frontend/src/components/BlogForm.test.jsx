import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { test, expect, vi } from 'vitest'

test('when receiving the blog details, the event handler is called by the form', async () => {
  const blog = {
    title: 'Popular blog 1',
    author: 'ya boi',
    url: 'yomama.com'
  }

  const createBlog = vi.fn()
  const { container } = render(<BlogForm createBlog={createBlog}/>)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  const user = userEvent.setup()
  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  const createButton = await screen.findByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blog)
})