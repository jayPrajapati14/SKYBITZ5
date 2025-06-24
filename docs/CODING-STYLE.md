[← Back to Documentation](./DOCS.md)

# CodingStyle Guide

## Table of Contents
- [General Guidelines](#general-guidelines)
- [Naming Conventions](#naming-conventions)
- [Code Formatting](#code-formatting)
- [Documentation](#documentation)
- [Testing](#testing)
- [Git Practices](#git-practices)

## General Guidelines

- Write clean, maintainable, and reusable code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions small and focused on a single task
- Prioritize readability over clever code
- Use meaningful variable and function names

## Code Organization

- Keep related code together in the same file
- Keep business logic in the domain layer
- Keep UI components in the infrastructure layer

### Naming Conventions

#### Variables
- Use camelCase for variable names
- Be descriptive but concise
- Boolean variables should start with 'is', 'has', or 'should'

```javascript
const userName = 'John';
const isActive = true;
const hasPermission = false;
```

#### Functions
- Use camelCase for function names
- Start with a verb that describes the action
- Be specific about what the function does

```javascript
function getUserData() { }
function validateInput() { }
function calculateTotal() { }
```

#### Classes

- Use PascalCase for class names
- Use nouns or noun phrases
```javascript
class APIError { }
```

#### Constants
- Use UPPER_SNAKE_CASE for constants
```javascript
const MAX_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
```

### Imports

Use absolute imports for all modules. In `tsconfig.json` and `vite.config.ts` the paths are configured to be relative to the `src` directory. Some of the alias also encapsulates the infrastructure folder structure.

```typescript
// ✅ Correct
import { Component } from "@/components/component";
import { useStore } from "@/store/store";
import { type } from "@/domain/models";

// ❌ Incorrect
import { Component } from "../../../../components/component";
import { useStore } from "src/store/store";
```

### Function conventions

- Use `function` keyword for all functions
- Prefer arrow functions for short functions
- Prefer arrow functions for callbacks (map, filter, reduce, etc.)
- Prefer named functions over anonymous functions

## TypeScript & React

### TypeScript Guidelines
- Use explicit types. Never use `any`
- Prefer `type` over `interface` for object definitions
- Use generic types when appropriate
- Use domain types from `src/domain/models`

### React Best Practices
- Write functional components with hooks
- Use explicit prop types
- Avoid prop drilling by using Zustand
- Keep components small and focused
- Use Compound Components pattern for complex components
- Use Layout components for consistent page structure
- Keep business logic in domain services

## Styling

### Component Styling Strategy
- Use TailwindCSS for basic styling and layout (with `tw-` prefix)
- Use Material UI for complex UI components
- Avoid inline CSS
- Follow the established design system

### Theme Usage
- Use theme colors from Material UI palette when writing Material UI components
- Use theme colors from TailwindCSS palette when writing other components (TailwindCSS colors are setup in `tailwind.config.js` and are imported from Material UI colors)

## Code Formatting

### Indentation
- Use 2 spaces for indentation
- Be consistent with indentation across the project
- Use Prettier for formatting

### Line Length
- Maximum line length: 80 characters
- Break long lines at logical points

### Spacing
- One space after keywords (if, for, while)
- One space around operators
- No space after function name in function calls

```javascript
if (condition) {
  doSomething();
}

const sum = a + b;
```

## Documentation

### Comments
- Write comments for complex logic only
- Avoid obvious comments
- Use JSDoc for function documentation

```javascript
/**
 * Custom hook to fetch yard check assets with filtering options
 * @param {GetYardCheckAssetsParams} options - Parameters for filtering assets
 * @returns Query result containing assets data and loading state
 */
export function useGetYardCheckAssets(options: GetYardCheckAssetsParams) {
  const hasLandmarkIds = (options.landmarkIds?.length ?? 0) > 0;
  const hasLandmarkGroupIds = (options.landmarkGroups?.length ?? 0) > 0;
  const hasAssetIds = (options.ids?.length ?? 0) > 0;
  const enabled = hasLandmarkIds || hasLandmarkGroupIds || hasAssetIds;

  return useQuery({
    queryKey: ["assets", ...Object.values(options)],
    queryFn: (context) => getYardCheckAssets(options, context),
    staleTime: 1000 * 10,
    placeholderData: enabled ? keepPreviousData : undefined,
    enabled,
  });
}
```

### README
- Keep README files up to date
- Include setup instructions
- Document dependencies and requirements
- Provide usage examples

## Testing

### Unit Tests
- Write tests for all new features
- Follow the AAA pattern (Arrange, Act, Assert)
- Use descriptive test names
```javascript
describe('UserService', () => {
  it('should return user data when valid ID is provided', () => {
    // Test implementation
  });
});
```

### Test Coverage
- Aim for minimum 80% test coverage
- Focus on critical business logic
- Test edge cases and error scenarios

## Git Practices

### Commits
- Write clear, concise commit messages
- Use present tense in commit messages
- Reference issue numbers when applicable
```
feat: add user authentication
fix: resolve login page redirect issue (#123)
```

### Branches
- Use feature branches for new development
- Follow branch naming convention:
  - feature/feature-name
  - bugfix/bug-description
  - hotfix/issue-description

### Pull Requests
- Keep PRs focused and small
- Include detailed descriptions
- Reference related issues
- Ensure all tests pass before requesting review

---

Remember: These guidelines are meant to help maintain code quality and consistency. They should be followed unless there's a compelling reason not to.
