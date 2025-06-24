[← Back to Documentation](./DOCS.md)

# API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Data Types](#data-types)

## Overview

The API follows RESTful principles and uses JSON for request/response bodies. All endpoints are prefixed with `/api/v1`.

Base URL: `https://api.example.com/api/v1`

## Authentication

Authentication is handled via cookies that are set by the parent domain. The API uses these cookies for authentication without requiring explicit token management.

### Cookie-based Authentication

- Cookies are automatically managed by the browser
- No manual token handling required
- Cookies are included in all requests using `credentials: "include"`

Example of API fetch configuration:

```typescript
export async function apiFetch<T>(path: string, options: RequestInit): Promise<T> {
  const mergedOptions = { 
    ...options, 
    credentials: "include" // Include cookies in all requests
 };
  const response = await fetch(path, mergedOptions);
  const result = await response.json()

  return result as T;
}
```

### Security Considerations

- Cookies must be set with appropriate security flags:
  - `Secure`: Only sent over HTTPS
  - `SameSite`: Controls how cookies are sent with cross-site requests
  - `HttpOnly`: Prevents JavaScript access to cookies
- Cross-Origin Resource Sharing (CORS) must be properly configured
- Requests must come from allowed domains

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```typescript
{
  error: {
    code: string;
    errorCode: number;
    message: string;
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## Data Types

The API uses Zod schemas to define and validate data types. This ensures type safety and runtime validation of API responses.

### Schema Definition

Data types are defined using Zod schemas in dedicated DTO (Data Transfer Object) files. For example:

```typescript
import { z } from "zod";

export const UserDtoSchema = z.object({
  userID: z.number(),
  userName: z.string(),
  userTypeName: z.string(),
  customerID: z.number(),
  email: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export type UserDto = z.infer<typeof UserDtoSchema>;
```

### Data Validation

The application uses utility functions to validate API responses against these schemas:

```typescript
import { APIError, ZOD_ERROR_CODE } from "@/infrastructure/errors/errors";
import { z, ZodSchema } from "zod";

export const zodParse = <T>(schema: ZodSchema<T>, dto: unknown): T => {
  try {
    return schema.parse(dto);
  } catch (error) {
    if (!schema.description) {
      console.warn("No description provided for schema", schema);
    }
    throw new APIError(`Error parsing ${schema.description ?? "Unknown schema"}`, ZOD_ERROR_CODE, error);
  }
};

export const zodParseArray = <T>(schema: ZodSchema<T>, dto: unknown[]): T[] => {
  try {
    return z.array(schema).parse(dto);
  } catch (error) {
    throw new APIError(`Error parsing array of ${schema.description ?? "Unknown schema"}`, ZOD_ERROR_CODE, error);
  }
};
```

### Repository Implementation

Repositories use these schemas and validation utilities to ensure type safety and data integrity. Example usage:

```typescript
import { apiFetch } from "@/infrastructure/api-fetch/api-fetch";

import { UserDto, UserDtoSchema } from "./user-dto";
import { zodParse } from "@/infrastructure/zod-parse/zod-parse";

export async function getCurrentUser(): Promise<User> {
  const user = await apiFetch<UserDto>(`/api/v1/user/current`);
  const parsedUser = zodParse(UserDtoSchema, user);

  return {
    id: parsedUser.userID,
    username: parsedUser.userName,
    email: parsedUser.email ?? "",
    type: parsedUser.userTypeName,
    customerId: parsedUser.customerID,
    firstName: parsedUser.firstName ?? "",
    lastName: parsedUser.lastName ?? "",
  };
}
```

### Benefits

- **Type Safety**: Automatic TypeScript type inference from Zod schemas
- **Runtime Validation**: Ensures API responses match expected schema
- **Error Handling**: Consistent error handling for malformed data
- **Documentation**: Schemas serve as both validation and documentation
- **IDE Support**: Full autocomplete and type checking support

### Common Patterns

1. Define DTO schemas using Zod
2. Export inferred TypeScript types
3. Use `zodParse` or `zodParseArray` in repositories
4. Transform validated DTOs to domain models
5. Handle validation errors consistently

This approach ensures that any data coming from the API is properly validated and typed before being used in the application.