<script>
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';
	import LegendHeader from './components/LegendHeader.svelte';
	import CategoryLevels from './components/CategoryLevels.svelte';
	import TaskTypes from './components/TaskTypes.svelte';
	import DifficultyLevels from './components/DifficultyLevels.svelte';
	import Statistics from './components/Statistics.svelte';

	$: totalCategories = $navigationContext?.categoryHierarchy?.length || 0;
	$: totalTasks = Object.values($navigationContext?.topicsByCategory || {}).reduce(
		(sum, tasks) => sum + tasks.length,
		0
	);

	let expandedSections = {
		categoryLevels: false,
		taskTypes: false,
		difficultyLevels: false,
		statistics: false
	};
</script>

<div class="h-full rounded-lg bg-white shadow-sm border overflow-y-auto">
	<div class="p-4">
		<LegendHeader />

		<CategoryLevels bind:isExpanded={expandedSections.categoryLevels} />
		<TaskTypes bind:isExpanded={expandedSections.taskTypes} />
		<DifficultyLevels bind:isExpanded={expandedSections.difficultyLevels} />
		<Statistics {totalCategories} {totalTasks} bind:isExpanded={expandedSections.statistics} />
	</div>
</div>
