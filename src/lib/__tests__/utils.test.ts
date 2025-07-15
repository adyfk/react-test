import { cn } from '../utils'

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
})
