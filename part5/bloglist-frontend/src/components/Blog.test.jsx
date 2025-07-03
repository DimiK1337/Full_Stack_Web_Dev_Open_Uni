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

  const hideButton = await screen.queryByRole('button', { name: 'hide' })
  expect(hideButton).toBeNull()
})
