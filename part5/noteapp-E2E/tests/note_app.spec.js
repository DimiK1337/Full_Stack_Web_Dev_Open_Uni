const { beforeEach, describe, test, expect } = require('@playwright/test')

const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Dimitriy Kruglikov',
        username: 'root',
        password: 'sekret'
      }
    })
    await page.goto('/')
  })
  test('frontpage can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await loginWith(page, 'root', 'sekret')
    await expect(page.getByText('Dimitriy Kruglikov is logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'root', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        //await createNote(page, 'a note created by playwright')
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })
      test('importance can be changed', async ({ page }) => {
        const otherNoteText = await page.getByText('second note')
        const otherNoteElement = await otherNoteText.locator('..')

        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = await page.getByText('first note') // Only finds the span (not the parent)

        // Gets the parent to press the button (intuition: `cd ..` goes up one level)
        const otherNoteElement = await otherNoteText.locator('..')

        await otherNoteElement
          .getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })

})