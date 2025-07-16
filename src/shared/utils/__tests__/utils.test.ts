import { cn, formatNumber, truncateText, capitalize, formatDate } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge classes correctly', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should handle conditional classes', () => {
      expect(cn('text-red-500', false && 'text-blue-500')).toBe('text-red-500')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
      expect(cn(undefined)).toBe('')
      expect(cn(null)).toBe('')
    })

    it('should handle arrays', () => {
      expect(cn(['text-red-500', 'text-blue-500'])).toBe('text-blue-500')
    })

    it('should handle objects', () => {
      expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })
  })

  describe('truncateText', () => {
    it('should truncate text when exceeding max length', () => {
      expect(truncateText('Hello world', 5)).toBe('Hello...')
    })

    it('should not truncate when within max length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-01')
      expect(formatDate(date)).toBe('Jan 1, 2023')
    })
  })
})
