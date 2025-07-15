import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load and display correctly', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads
    await expect(page).toHaveTitle(/React Test/i)

    // Check that the theme toggle is present
    await expect(page.getByRole('button', { name: /toggle theme/i })).toBeVisible()
  })

  test('should toggle theme correctly', async ({ page }) => {
    await page.goto('/')

    // Click the theme toggle
    await page.getByRole('button', { name: /toggle theme/i }).click()

    // Check that the dropdown is visible
    await expect(page.getByText('Light')).toBeVisible()
    await expect(page.getByText('Dark')).toBeVisible()
    await expect(page.getByText('System')).toBeVisible()

    // Click on dark mode
    await page.getByText('Dark').click()

    // Check that dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})

test.describe('Accessibility', () => {
  test('should be accessible', async ({ page }) => {
    await page.goto('/')

    // Check for basic accessibility
    const accessibilityTree = await page.accessibility.snapshot()
    expect(accessibilityTree).toBeTruthy()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /toggle theme/i })).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(page.getByText('Light')).toBeVisible()
  })
})
