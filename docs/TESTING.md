[← Back to Documentation](./DOCS.md)

# Testing Guide

## Table of Contents

1. [Overview](#overview)
2. [Unit Testing](#unit-testing)
3. [E2E Testing](#e2e-testing)
4. [Test Coverage](#test-coverage)
5. [Best Practices](#best-practices)
6. [Mocking](#mocking)
7. [CI Integration](#ci-integration)

## Overview

The project implements a comprehensive testing strategy using:
- Vitest for unit and integration testing
- Playwright for E2E testing
- React Testing Library for component testing
- MSW for API mocking

## Unit Testing

### Setup

Tests are configured using Vitest with the following configuration:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/e2e/**", "**/node_modules/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "src/infrastructure/ui/components"),
      "@/views": path.resolve(__dirname, "src/infrastructure/ui/views"),
      "@/store": path.resolve(__dirname, "src/infrastructure/store"),
      "@/styles": path.resolve(__dirname, "src/infrastructure/ui/styles"),
      "@/routes": path.resolve(__dirname, "src/infrastructure/ui/routes"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### Writing Unit Tests

#### Component Tests

1. Co-locate test files with components
2. Use `.test.tsx` extension
3. Follow AAA pattern (Arrange, Act, Assert)

Example of a component test:

```typescript
import { render, screen } from "@testing-library/react";
import { Component } from "./component";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Example")).toBeInTheDocument();
  });
  
  it("handles user interaction", async () => {
    render(<Component />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(screen.getByText("Clicked")).toBeInTheDocument();
  });
});
```

#### Testing Hooks

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCustomHook } from "./useCustomHook";

describe("useCustomHook", () => {
  it("updates state correctly", () => {
    const { result } = renderHook(() => useCustomHook());
    act(() => {
      result.current.update("new value");
    });
    expect(result.current.value).toBe("new value");
  });
});
```

### Running Unit Tests

Available commands:
```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## E2E Testing

### Playwright Configuration

The project uses Playwright with the following configuration:

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Additional browser configurations...
  ]
});
```

### Writing E2E Tests

1. Place tests in `src/infrastructure/tests/e2e` directory
2. Use `.spec.ts` extension
3. Implement page objects for reusability

Example E2E test:

```typescript
import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page";

test.describe("Login Flow", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("successful login", async () => {
    await loginPage.login("user@example.com", "password");
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Running E2E Tests

```bash
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Run with UI mode
npm run test:e2e:debug  # Run in debug mode
```

## Test Coverage

### Coverage Goals

- Unit Tests: The goal is to achieve a minimum of 80% coverage
- E2E Tests: All critical user paths
- Component Tests: All interactive elements

### Coverage Report

Generate coverage report:
```bash
npm run test:coverage
```

Coverage is checked for:
- Statements
- Branches
- Functions
- Lines

## Best Practices

### General Guidelines

1. Test behavior, not implementation
2. One assertion per test when possible
3. Use meaningful test descriptions
4. Keep tests simple and readable
5. Don't test third-party code
6. Use setup and teardown appropriately

### Component Testing

1. Query elements by role or text
2. Test user interactions
3. Verify accessibility
4. Test error states
5. Test loading states

### Mocking

1. Use MSW for API mocks
2. Mock at the lowest level possible
3. Keep mocks close to tests
4. Use meaningful mock data

## Mocking

### MSW Setup

MSW is configured for API mocking:

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/assets", () => {
    return HttpResponse.json([
      { id: 1, name: "Asset 1" },
      { id: 2, name: "Asset 2" },
    ]);
  }),
];
```

### Mock Data

1. Use factories for generating test data
2. Keep mock data realistic
3. Version control mock data
4. Share mock data between tests when appropriate

## CI Integration

### Pre-commit Hooks

Tests are run before commits using Husky:

```json
{
  "hooks": {
    "pre-commit": "npm run precommit",
    "pre-push": "npm run prepush"
  }
}
```

### Common Testing Patterns

#### Testing Asynchronous Code

```typescript
test("async operations", async () => {
  const result = await asyncOperation();
  expect(result).toBeDefined();
});
```

#### Testing Error Handling

```typescript
test("handles errors", async () => {
  const error = new Error("Test error");
  mockFunction.mockRejectedValue(error);
  
  await expect(asyncOperation()).rejects.toThrow("Test error");
});
```

#### Testing React Query

```typescript
test("queries data", async () => {
  const wrapper = createWrapper();
  const { result } = renderHook(() => useQuery(), { wrapper });
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

#### Testing Zustand Store

```typescript
test("updates store state", () => {
  const store = useStore.getState();
  store.updateValue("new value");
  
  expect(useStore.getState().value).toBe("new value");
});
```