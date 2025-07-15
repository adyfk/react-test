import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeToggle } from '../ui/mode-toggle'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
    theme: 'light',
  }),
}))

describe('ModeToggle', () => {
  it('renders theme toggle button', () => {
    render(<ModeToggle />)

    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)

    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)

    // Check for the translated text values from messages/en.json
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('renders theme options in dropdown', async () => {
    const user = userEvent.setup()
    render(<ModeToggle />)

    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)

    // Check that all theme options are present with translated text
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })
})
