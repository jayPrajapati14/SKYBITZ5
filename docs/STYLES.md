[← Back to Documentation](./DOCS.md)

# UI Style Guide

## Table of Contents
- [Design System](#design-system)
- [Component Styling Strategy](#component-styling-strategy)
- [Material UI Implementation](#material-ui-implementation)
- [TailwindCSS Usage](#tailwindcss-usage)
- [Theme Configuration](#theme-configuration)

## Design System

### Color Palette
Our color system is based on Material UI's color palette, configured in TailwindCSS:
```javascript
// tailwind.config.js
import { orange, green, purple, yellow, red, blue, pink, grey } from "@mui/material/colors";

colors: {
  green,
  purple,
  yellow,
  red,
  blue,
  pink,
  orange,
  grey,
  primary: blue[500],    // Material UI primary color
  secondary: purple[500], // Material UI secondary color
}
```

### Typography
- Primary Font: Roboto (Material UI default)
- Font Sizes: Following Material UI's typography scale
- Use Material UI's typography components for consistent text styling

## Component Styling Strategy

### Core Principles
1. Material UI components for UI elements (buttons, inputs, etc.)
2. TailwindCSS with `tw-` prefix for layout and custom styling
3. Avoid mixing Material UI and Tailwind classes in the same styling concern

### When to Use What
- **Material UI**: 
  - Form components
  - Buttons
  - Dialog boxes
  - Navigation components
  - Data Grids
  - Autocomplete inputs
  - Any component available in MUI library 

- **TailwindCSS**: 
  - Layout (flex, grid)
  - Spacing
  - Custom components
  - Responsive design
  - Background colors for non-MUI elements

## Material UI Implementation

### Component Usage
```jsx
// Correct usage with Material UI theme colors
<Button variant="contained" color="primary">
  Primary Action
</Button>

<Button variant="outlined" color="secondary">
  Secondary Action
</Button>

// Form elements using theme colors
<TextField 
  variant="outlined" 
  color="primary"
  label="Input Label" 
/>
```

### Theme Configuration

```typescript
// theme.tsx
import { createTheme } from "@mui/material";
import { colors } from "@mui/material";

const theme = createTheme({
  // Global Settings
  palette: {
    primary: { main: colors.blue[500] },
  },
  typography: { fontSize: 14 },
  shape: { borderRadius: 6 },

  // Component Customization
  components: {
    // Button example with full customization
    MuiButton: {
      defaultProps: { 
        disableElevation: true, 
        size: "small" 
      },
      styleOverrides: {
        root: {
          padding: "3px 12px",
        },
      },
    },

    // Input example with consistent styling
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": { minHeight: 40 },
        },
      },
    },

    // ... Other components follow similar patterns for consistency:
    // - MuiInputBase: consistent font size
    // - MuiAutocomplete: consistent height and styling
    // - MuiAccordion: custom borders and spacing
    // - MuiFormLabel: consistent colors and typography
    // See theme.tsx for full component customization
  },
});
```

### Theme Usage Guidelines

1. **Global Settings**
   - Base font size: `14px`
   - Border radius: `6px`
   - Primary color: `blue[500]`

2. **Component Defaults**
   - Buttons: Small size, no elevation, `3px` vertical padding
   - Text Fields: Small size, `40px` minimum height
   - Accordions: No gutters, no elevation, square corners
   - Form Labels: `14px`, `grey[900]` color

3. **Best Practices**
   - Always use theme colors instead of hard-coded values
   - Leverage defaultProps for consistent component behavior
   - Use styleOverrides for component-wide styling rules
   - Follow the established sizing and spacing patterns


## TailwindCSS Usage

### Prefix Usage
Always use the `tw-` prefix for Tailwind classes to avoid conflicts:
```jsx
// Correct
<div className="tw-flex tw-gap-4 tw-p-6">
  <div className="tw-w-1/2 tw-bg-primary">
    <Button variant="contained">MUI Button</Button>
  </div>
</div>

// Incorrect - missing tw- prefix
<div className="flex gap-4 p-6">
  ...
</div>
```

### Layout Examples
```jsx
// Layout with Tailwind
<div className="tw-grid tw-grid-cols-2 tw-gap-4">
  <div className="tw-p-4 tw-bg-grey-100">
    <MaterialUIComponent />
  </div>
</div>

// Responsive design
<div className="tw-w-full tw-md:w-1/2 tw-lg:w-1/3">
  <Card>Content</Card>
</div>
```

### Color Usage
```jsx
// Using Tailwind with MUI colors
<div className="tw-bg-primary">
  Primary color background
</div>

<div className="tw-bg-blue-500">
  Specific MUI blue shade
</div>
```

## Theme Configuration

### Best Practices
1. **Component Styling**
   - Use Material UI's built-in props for styling MUI components
   - Use Tailwind for layout and custom components
   - Never mix Material UI's styled API with Tailwind classes

2. **Layout**
   - Use Tailwind's grid and flex utilities with `tw-` prefix
   - Maintain consistent spacing using Tailwind's spacing scale
   - Use Material UI's `Container` component for main layout structure

3. **Responsive Design**
   - Use Tailwind's responsive prefixes for layout
   - Use Material UI's useMediaQuery for component behavior

4. **Colors**
   - Use Material UI's color props for MUI components
   - Use Tailwind color classes (with `tw-` prefix) for custom elements
   - Maintain consistency with the shared color palette

5. **Typography**
   - Use Material UI's Typography component for text
   - Use Tailwind for minor text styling adjustments when needed