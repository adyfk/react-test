// Global type declarations for next-intl integration
// This file enhances next-intl with our generated types for better IntelliSense

import type { Messages } from './generated-types'

declare global {
  // Use type re-export pattern to avoid having this type in `.d.ts` files
  type IntlMessages = Messages
}

export { }
