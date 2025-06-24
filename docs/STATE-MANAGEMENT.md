[← Back to Documentation](./DOCS.md)

# State Management Guide

## Table of Contents
- [Zustand State Management](#zustand-state-management)
- [Best Practices](#best-practices)
- [Implementation Examples](#implementation-examples)

## Zustand State Management

### Core Concepts
- Minimal and unopinionated
- Single source of truth
- No boilerplate required
- TypeScript ready

### Basic Store Setup
```typescript
// stores/ui.store.ts
import { create } from "zustand";

type UIStore = {
  openDrawer: boolean;
  toggleDrawer: () => void;
};

export const useUiStore = create<UIStore>((set) => ({
  openDrawer: false,
  toggleDrawer: () => set((state) => ({ 
    openDrawer: !state.openDrawer 
})),
}));
```


## Best Practices

### 1. State Separation
- Keep UI state in Zustand
- Use React Query for server state
- Separate global vs local state

### 2. Selector Usage
```typescript
// Good: Specific selections using selectors
const showFilterBar = useYardCheckStore((state) => state.showFilterBar)
const filters = useYardCheckStore((state) => state.filters)
const filterCount = useYardCheckStore((state) => state.actions.getFilterCounts())

// Even Better: Using dedicated hooks for specific selectors
export const useYardCheckFilterBar = () => useYardCheckStore((state) => state.showFilterBar);
export const useYardCheckFilters = () => useYardCheckStore((state) => state.filters);
export const useYardCheckActions = () => useYardCheckStore((state) => state.actions);

// Avoid: Over-selection of state
const { 
  showFilterBar, 
  filters, 
  recentFilters, 
  actions, 
  paginationModel 
} = useYardCheckStore()
```

### 3. Action Organization
```typescript
// Good: Actions grouped with related state and strongly typed
type FilterState<F extends GenericFilters> = {
  // State
  showFilterBar: boolean;
  filters: F;
  recentFilters: F;
  pinnedFilters: Array<PinnedFilter<F>>;
  paginationModel: PaginationModel;

  // Actions grouped in a dedicated object
  actions: {
    // UI actions
    toggleFilterBar: () => void;
    
    // Filter management
    setFilter: <G extends keyof F, FT extends keyof F[G]>(
      group: G, 
      filterType: FT, 
      value: F[G][FT]
    ) => void;
    resetFilters: (newFilters?: F) => void;
    
    // Filter pinning
    setPinnedFilter: <G extends keyof F, FT extends keyof F[G]>(
      group: G, 
      filterType: FT, 
      value: boolean
    ) => void;
    isFilterPinned: <G extends keyof F, FT extends keyof F[G]>(
      group: G, 
      filterType: FT
    ) => boolean;
    
    // Utilities
    getFilterCounts: () => FiltersCountWithTotal<F>;
    filtersPinnedCount: () => number;
  };
};

// Usage through dedicated hooks
export const useYardCheckActions = () => useYardCheckStore((state) => state.actions);
export const useYardCheckFiltersCount = () => 
  useYardCheckStore((state) => state.actions.getFilterCounts());

// Avoid: Scattered actions across multiple stores or loose coupling
const useYardCheckStore = create((set) => ({
  filters: {},
  setFilter: () => {}, // Loose action
  pinnedFilters: {},
  setPinnedFilter: () => {}, // Loose action
  // ... more scattered actions
}));
```

## Implementation Examples

### Feature Store Example
```typescript
// stores/useFeatureStore.ts
type FeatureState = {
  features: Feature[]
  selectedFeature: Feature | null
  isLoading: boolean
  error: Error | null
  
  // Actions
  selectFeature: (id: string) => void
  fetchFeatures: () => Promise<void>
  updateFeature: (feature: Feature) => Promise<void>
}

export const useFeatureStore = create<FeatureState>((set, get) => ({
  features: [],
  selectedFeature: null,
  isLoading: false,
  error: null,

  selectFeature: (id) => {
    const feature = get().features.find(f => f.id === id)
    set({ selectedFeature: feature })
  },

  fetchFeatures: async () => {
    set({ isLoading: true })
    try {
      const features = await api.getFeatures()
      set({ features, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  updateFeature: async (feature) => {
    set({ isLoading: true })
    try {
      await api.updateFeature(feature)
      set(state => ({
        features: state.features.map(f => 
          f.id === feature.id ? feature : f
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error, isLoading: false })
    }
  }
}))
```

### Usage in Components
```typescript
// components/FeatureList.tsx
const FeatureList = () => {
  const features = useFeatureStore(state => state.features)
  const selectFeature = useFeatureStore(state => state.selectFeature)
  const isLoading = useFeatureStore(state => state.isLoading)

  if (isLoading) return <Loading />

  return (
    <div>
      {features.map(feature => (
        <FeatureItem
          key={feature.id}
          feature={feature}
          onSelect={selectFeature}
        />
      ))}
    </div>
  )
}
```

Remember:
- Keep stores focused and minimal
- Use TypeScript for better type safety
- Combine Zustand with React Query effectively
- Follow consistent patterns across stores
- Document store interfaces and usage 