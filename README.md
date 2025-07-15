# React Test - Professional Next.js Setup

A modern, professional React application built with Next.js 15, featuring comprehensive testing, internationalization, and enterprise-grade development practices.

## 🚀 Features

- **⚡ Next.js 15** - Latest version with App Router and React 19
- **🔧 TypeScript** - Strict type checking with enhanced configuration
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧪 Comprehensive Testing** - Jest, React Testing Library, and Playwright
- **🌐 Internationalization** - Multi-language support with next-intl
- **🌙 Theme Support** - Dark/light mode with next-themes
- **🔒 Type-safe Environment** - Environment variables validation with Zod
- **🛡️ Security** - Automated security scanning and dependency checks
- **📏 Code Quality** - ESLint with formatting rules and pre-commit hooks
- **🚀 CI/CD** - GitHub Actions workflows for testing and deployment

## 📋 Requirements

- Node.js 18.x or 20.x
- npm or yarn
- Git

## 🏗️ Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd react-test
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
# Add your environment variables as needed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Install Playwright browsers (first time only)
npm run test:e2e:install

# Run e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui
```

## 🌐 Internationalization

The application supports multiple languages with full TypeScript support and IntelliSense:

- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)

### Type-Safe Translation Hooks

```tsx
import { useTranslations } from '@/i18n/hooks'

function MyComponent() {
  const t = useTranslations('common')
  
  // Full IntelliSense support for translation keys
  return <h1>{t('theme.toggle')}</h1>
}
```

### Auto-Generated Types

The project automatically generates TypeScript types from message files:

```bash
# Generate type definitions for IntelliSense
npm run generate:i18n-types
```

This provides:
- **IntelliSense** for all translation keys
- **Type safety** to prevent typos
- **Auto-completion** in your IDE
- **Build-time validation** of translation keys

### Adding New Languages

1. Create a new message file in `messages/` (e.g., `messages/it.json`)
2. Add the locale to `src/i18n/config.ts`
3. Update the middleware matcher in `middleware.ts`
4. Run `npm run generate:i18n-types` to update type definitions

### Adding New Translations

Edit the respective JSON files in the `messages/` directory:

```json
{
  "common": {
    "button": "Button text"
  },
  "page": {
    "title": "Page title"
  }
}
```

After adding translations, regenerate types:

```bash
npm run generate:i18n-types
```

## 🔧 Development Workflow

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues (includes formatting)
npm run lint:fix

# Type checking
npm run type-check

# Run all quality checks
npm run validate
```

### Git Hooks

The project uses Husky for Git hooks:

- **pre-commit**: Runs lint-staged (ESLint fixing, type checking)
- **commit-msg**: Validates commit messages using conventional commits

### 📝 Commit Conventions Guide

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This helps maintain a clear and standardized git history.

#### Basic Format
```
type: description
```

#### Types Explained
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New features | `feat: add dark mode toggle` |
| `fix` | Bug fixes | `fix: resolve login error` |
| `docs` | Documentation changes | `docs: update README` |
| `style` | Code style/formatting | `style: format components` |
| `refactor` | Code refactoring | `refactor: simplify auth logic` |
| `test` | Adding/updating tests | `test: add unit tests for auth` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance improvements | `perf: optimize image loading` |
| `ci` | CI/CD changes | `ci: update GitHub workflow` |
| `build` | Build system changes | `build: modify webpack config` |
| `revert` | Revert changes | `revert: remove dark mode` |

#### Rules
- Description must be lowercase
- No period at the end
- Keep the total length under 72 characters
- Use imperative mood ("add" not "added")

#### Examples
✅ Good Examples:
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in video player"
git commit -m "docs: update deployment instructions"
git commit -m "style: format according to style guide"
```

❌ Bad Examples:
```bash
git commit -m "updated stuff"                    # No type
git commit -m "feat: Added new feature."         # Don't use past tense or period
git commit -m "fix: THIS IS BROKEN!!"           # Don't use caps or exclamation
git commit -m "chore: a very very very very very very very very long message"  # Too long
```

#### Tips
1. Keep descriptions clear and concise
2. Focus on WHY rather than HOW
3. If you need more detail, use the commit body:
   ```bash
   git commit -m "feat: add password reset" -m "This adds the ability for users to reset their password through email verification"
   ```

### Commit Message Format

Use conventional commits format:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 🏗️ Project Structure

```
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── e2e/                    # End-to-end tests
├── messages/               # Internationalization messages
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/      # Localized routes
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   └── theme-provider.tsx
│   ├── i18n/              # Internationalization config
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── jest.config.mjs         # Jest configuration
├── playwright.config.ts    # Playwright configuration
├── middleware.ts          # Next.js middleware
└── tailwind.config.ts     # Tailwind configuration
```

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues and formatting |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run e2e tests |
| `npm run test:e2e:ui` | Run e2e tests with UI |
| `npm run type-check` | Run TypeScript type checking |
| `npm run validate` | Run all quality checks |

## 🚀 Deployment

### Environment Variables

Set up the following environment variables for production:

```bash
NODE_ENV=production
# Add your production environment variables here
```

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🛡️ Security

The project includes several security measures:

- **Dependency Scanning**: Automated vulnerability scanning
- **Code Analysis**: CodeQL security analysis
- **Environment Validation**: Type-safe environment variables
- **Security Headers**: Configured in Next.js
- **Audit Automation**: Regular security audits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run quality checks: `npm run validate`
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](README.md)
2. Search existing [issues](https://github.com/your-repo/issues)
3. Create a [new issue](https://github.com/your-repo/issues/new)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Jest](https://jestjs.io/) - Testing framework
- [Playwright](https://playwright.dev/) - E2E testing
- [Vercel](https://vercel.com/) - Deployment platform
