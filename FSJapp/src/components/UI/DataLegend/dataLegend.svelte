<script>
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';
	import LegendHeader from './components/LegendHeader.svelte';
	import CategoryLevels from './components/CategoryLevels.svelte';
	import TaskTypes from './components/TaskTypes.svelte';
	import DifficultyLevels from './components/DifficultyLevels.svelte';

	let expandedSections = {
		categoryLevels: false,
		taskTypes: false,
		difficultyLevels: false
	};
</script>

<div class="h-full rounded-lg bg-white shadow-sm border overflow-y-auto">
	<div class="p-4">
		<LegendHeader />

		<CategoryLevels bind:isExpanded={expandedSections.categoryLevels} />
		<TaskTypes bind:isExpanded={expandedSections.taskTypes} />
		<DifficultyLevels bind:isExpanded={expandedSections.difficultyLevels} />
	</div>
</div>
