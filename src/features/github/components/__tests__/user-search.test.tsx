import { render, screen } from '@testing-library/react'
import UserSearch from '../user-search'

// Mock the GitHub search hook
jest.mock('../../hooks/use-github-search', () => ({
  useGitHubSearch: () => ({
    query: '',
    users: [],
    loading: false,
    error: null,
    hasSearched: false,
    search: jest.fn(),
    clearSearch: jest.fn(),
    updateQuery: jest.fn(),
    hasResults: false,
    isEmpty: false,
    canSearch: false,
  }),
}))

// Mock monitoring modules
jest.mock('@/core/monitoring/analytics', () => ({
  analytics: {
    trackAction: jest.fn(),
  },
}))

jest.mock('@/core/monitoring/monitoring', () => ({
  performanceMonitor: {
    trackEvent: jest.fn(),
  },
}))

describe('UserSearch', () => {
  const mockOnUserSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search form correctly', () => {
    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />)

    expect(screen.getByPlaceholderText('Enter GitHub username...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('displays search title', () => {
    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />)

    expect(screen.getByText('Search GitHub Users')).toBeInTheDocument()
  })

  it('displays empty state initially', () => {
    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />)

    expect(screen.getByText('Enter a username to search for GitHub users')).toBeInTheDocument()
  })

  it('search button is disabled initially', () => {
    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />)

    const searchButton = screen.getByRole('button', { name: 'Search' })
    expect(searchButton).toBeDisabled()
  })
})
