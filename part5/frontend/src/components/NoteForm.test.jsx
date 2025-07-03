import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import NoteForm from './NoteForm'
import { expect, test, vi } from 'vitest'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  const { container } = render(<NoteForm createNote={createNote}/>)

  const input = container.querySelector('#note-input')
  const sendButton = screen.getByText('save')

  const noteContent = 'testing a form...'
  await user.type(input, noteContent)
  await user.click(sendButton)

  console.log(createNote.mock.calls);

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe(noteContent)
})