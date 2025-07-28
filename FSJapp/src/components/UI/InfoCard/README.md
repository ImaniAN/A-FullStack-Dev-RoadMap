# InfoCard Modular Components

This directory contains a refactored, modular version of the navInfoCard component, broken down into smaller, focused components following SOLID principles.

## Component Structure

### Main Component

- **navInfoCard.svelte** - Main orchestrating component that imports and uses all sub-components

### Sub-Components (`/components/`)

- **CategoryOverview.svelte** - Displays category information, difficulty tier, description, and basic stats
- **ProgressCard.svelte** - Shows position-based progress tracking within topic hierarchy
- **StatisticsCard.svelte** - Global database statistics with tier distribution
- **ResourcesList.svelte** - Organized list of learning resources by type

### Utilities (`/utils/`)

- **difficultySystem.js** - Unified S-F tier difficulty system (💎🔥⚡🌟🌱🎯🎓)
- **progressUtils.js** - Position-based progress calculation utilities

## Key Features

### Unified Difficulty System

- **S-Tier (💎)**: Deep technical concepts - Purple
- **A-Tier (🔥)**: Complex topics - Red
- **B-Tier (⚡)**: Moderate challenge - Orange
- **C-Tier (🌟)**: Some experience needed - Yellow
- **D-Tier (🌱)**: Baby steps level - Green
- **E-Tier (🎯)**: Super simple stuff - Blue
- **F-Tier (🎓)**: Hand-holding mode - Gray

### Position-Based Progress

- Calculates progress based on position within sibling categories
- 10-90% range for intuitive progression visualization
- Local depth tracking relative to topic hierarchy

### Modular Design Benefits

- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: Components can be used independently
- **Maintainability**: Easier debugging and updates
- **Testability**: Individual components can be tested in isolation
- **Type Safety**: Proper TypeScript/JSDoc annotations

## Integration

The system integrates with:

- `DifficultyLevels.svelte` in DataLegend
- `sideNav.svelte` navigation component
- `breadcrumbStore.js` for navigation context

## Usage

```svelte
<script>
	import navInfoCard from './path/to/navInfoCard.svelte';
</script>

<navInfoCard />
```

The component automatically subscribes to the navigation context and renders appropriate content based on selected category state.
