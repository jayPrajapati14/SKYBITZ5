[← Back to Documentation](./DOCS.md)

# Contributing Guide

## Table of Contents

1. [Development Process](#development-process)
2. [Code Conventions](#code-conventions)
3. [Commits and Pull Requests](#commits-and-pull-requests)
4. [Testing](#testing)
5. [Documentation](#documentation)
6. [Development Environment](#development-environment)

## Development Process

### Workflow

1. Create a new branch from `main`
2. Develop changes
3. Run tests and linting
4. Create Pull Request
5. Code review
6. Merge to `main`

### Main Commands

```bash
# Development
npm run dev:mock     # Development with mock data
npm run dev:demo     # Development in demo mode

# Build
npm run build        # Build for production

# Testing
npm run test         # Unit tests with coverage
npm run test:e2e     # E2E tests with Playwright
npm run test:e2e:ui  # E2E tests with UI

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Code Conventions

Please refer to the [CODING-STYLE.md](./CODING-STYLE.md) for more details.

## Commits and Pull Requests

### Commit Conventions

Please follow the conventional commit messages.

```
feat(yard-check): add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding or modifying tests
chore: build or tool changes
```

### Pull Request Guidelines

1. **Title Format**: `<type>: <short description>`
2. **Description**:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if UI changes)

3. **Checklist**:
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No linting errors
   - [ ] All tests passing
   - [ ] Code reviewed

## Testing

### Unit Testing (Vitest)

- Test files should be co-located with source files
- Follow the naming convention: `*.test.tsx`
- Use React Testing Library for component testing
- Mock external dependencies
- Aim for high test coverage

```typescript
import { render, screen } from "@testing-library/react";
import { Component } from "./component";
import { describe, expect, it } from "vitest";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Example")).toBeInTheDocument();
  });
});
```

### E2E Testing (Playwright)

- Place tests in `src/infrastructure/tests/e2e` directory
- Follow the naming convention: `*.spec.ts`
- Test critical user flows
- Use page objects when appropriate
- Test across different viewports

## Documentation

### Code Documentation

- Use JSDoc for complex functions and components
- Document non-obvious business logic
- Keep documentation close to the code
- Update documentation when changing code

### Architecture Documentation

- Keep [`ARCHITECTURE.md`](./ARCHITECTURE.md) updated with new patterns
- Document major architectural decisions
- Include diagrams when helpful
- Explain the reasoning behind choices

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error cases
- Keep API documentation in sync with implementation

## Development Environment

### Required Tools

- Node.js 20+
- npm 10+
- Git
- VS Code (recommended)

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Playwright Test for VSCode