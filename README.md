# GitHub Explorer

A modern web application built with Next.js and React that allows users to explore GitHub users and their repositories. The application features a beautiful, responsive UI with dark mode support and modern design components.

🔗 **Live Demo:** [https://react-test-psi-pearl.vercel.app/](https://react-test-psi-pearl.vercel.app/)  
📂 **Repository:** [https://github.com/adyfk/react-test](https://github.com/adyfk/react-test)

## Test Requirements and Submission

This project was created as part of the React JS Developer technical test. The requirements include:

- ✅ Build a GitHub user search application
- ✅ Implement repository exploration functionality
- ✅ Create a responsive and modern UI
- ✅ Include proper documentation
- ✅ Deploy a live demo
- ✅ Make the repository public

## Features

- 🔍 GitHub User Search
- 📊 Repository Explorer
- 🌓 Dark/Light Mode Toggle
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- 🔧 Built with TypeScript
- 🧪 Comprehensive Testing Suite

## Tech Stack

- **Framework:** Next.js 15.4.1
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS, Radix UI Components
- **State Management:** React Hooks
- **HTTP Client:** Axios
- **Testing:** Jest, React Testing Library, Playwright
- **Type Checking:** TypeScript
- **Linting:** ESLint
- **Code Style & Formatting:** ESLint (with strict formatting rules)
- **Git Hooks:** Husky, Commitlint
- **Monitoring:** Custom Analytics and Performance Monitoring

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your GitHub API credentials:
   ```
   NEXT_PUBLIC_GITHUB_API_URL=https://api.github.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI
- `npm run validate` - Run type checking, linting, tests, and build

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/         # Shared UI components
│   ├── providers/     # Context providers
│   └── ui/            # UI components
├── core/              # Core functionality
│   ├── api/          # API clients
│   ├── config/       # Configuration
│   ├── errors/       # Error handling
│   ├── logging/      # Logging utilities
│   └── monitoring/   # Analytics and monitoring
├── features/         # Feature modules
│   └── github/       # GitHub explorer feature
├── shared/           # Shared utilities and hooks
└── types/            # TypeScript type definitions
```

## Code Style & Formatting

This project uses ESLint for both code linting and formatting. The configuration is defined in `eslint.config.mjs` and includes:

### Key ESLint Rules

- Indentation: 2 spaces
- Quotes: Single quotes for strings
- No semicolons
- Trailing commas in multiline
- Consistent spacing in objects and arrays
- JSX with double quotes
- Strict TypeScript checks
- Modern React rules (no React import needed)

### Running ESLint

```bash
# Check for issues
npm run lint

# Fix automatically fixable issues
npm run lint:fix
```

### Git Hooks

The project uses Husky and Commitlint to ensure code quality:
- Pre-commit: Runs ESLint and TypeScript checks
- Commit messages: Follows conventional commit format

## Commit Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. Each commit message must have a specific structure:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi colons, etc)
- `refactor`: Code refactoring
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools
- `perf`: Performance improvements
- `ci`: CI configuration changes
- `build`: Changes that affect the build system
- `revert`: Reverts a previous commit

### Rules

- Type: Must be one of the types listed above
- Subject: 
  - No sentence-case, start-case, or pascal-case
  - No period at the end
  - Maximum length of 72 characters
- Scope: Optional, can be anything specifying the place of the commit change

### Examples

```bash
# Feature
git commit -m "feat(user): add user authentication"
# Bug fix
git commit -m "fix(api): handle null response from GitHub API"
# Documentation
git commit -m "docs: update README with commit guidelines"
# Multiple files/changes
git commit -m "refactor(core): reorganize utility functions"
# Breaking change
git commit -m "feat(api)!: change authentication API response structure BREAKING CHANGE: Authentication response now includes refresh token"
```

### Tips

1. Use present tense ("add feature" not "added feature")
2. Use imperative mood ("move cursor to..." not "moves cursor to...")
3. Keep the first line under 72 characters
4. Reference issues and pull requests in the footer
   ```bash
   git commit -m "fix(dashboard): resolve data loading issue Closes #123"
   ```

## Testing

The project includes a comprehensive testing suite:

- **Unit Tests:** Using Jest and React Testing Library
- **End-to-End Tests:** Using Playwright
- **Component Tests:** Testing UI components in isolation

Run tests:
```bash
# Unit tests
npm run test
# E2E tests
npm run test:e2e
# Test coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/) 