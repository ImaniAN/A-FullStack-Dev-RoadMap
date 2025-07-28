<script lang="ts">
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';

	// Props - customizable appearance
	export let label = 'Roadmap Progress'; // Customizable label
	export let showPercentage = true; // Toggle percentage display
	export let color: 'blue' | 'green' | 'purple' | 'orange' = 'blue';

	let depthPercentage = 0;

	// Color variants for different themes
	const colorClasses = {
		blue: 'from-blue-500 to-blue-600',
		green: 'from-green-500 to-green-600',
		purple: 'from-purple-500 to-purple-600',
		orange: 'from-orange-500 to-orange-600'
	};

	/**
	 * Calculate total items in the roadmap (categories + tasks)
	 * @param {any[]} categories
	 * @returns {number}
	 */
	function getTotalItems(categories: any[]): number {
		let total = 0;

		for (const category of categories) {
			total += 1; // Count the category itself

			// Count tasks in this category
			const tasks = $navigationContext?.topicsByCategory[category.id] || [];
			total += tasks.length;

			// Recursively count children categories and their tasks
			if (category.children && category.children.length > 0) {
				total += getTotalItems(category.children);
			}
		}

		return total;
	}

	/**
	 * Calculate position of current selection in the ordered journey
	 * @param {any} selectedCategory
	 * @param {any} selectedTask
	 * @param {any[]} categoryHierarchy
	 * @returns {number}
	 */
	function getCurrentPosition(
		selectedCategory: any,
		selectedTask: any,
		categoryHierarchy: any[]
	): number {
		if (!selectedCategory) return 0;

		let position = 0;
		let found = false;

		function traverseCategories(categories: any[]): void {
			if (found) return;

			for (const category of categories) {
				if (found) return;

				position += 1; // Count this category

				// If this is our selected category
				if (category.id === selectedCategory.id) {
					// If we have a selected task, find its position within the category
					if (selectedTask) {
						const tasks = $navigationContext?.topicsByCategory[category.id] || [];
						const taskIndex = tasks.findIndex((task) => task.id === selectedTask.id);
						if (taskIndex !== -1) {
							position += taskIndex + 1; // +1 because we want 1-based counting
						}
					}
					found = true;
					return;
				}

				// Count tasks in this category (only if we haven't found our target yet)
				const tasks = $navigationContext?.topicsByCategory[category.id] || [];
				position += tasks.length;

				// Recursively traverse children
				if (category.children && category.children.length > 0) {
					traverseCategories(category.children);
				}
			}
		}

		traverseCategories(categoryHierarchy);
		return position;
	}

	// Calculate journey percentage based on navigation context
	$: if ($navigationContext) {
		const totalItems = getTotalItems($navigationContext.categoryHierarchy);
		const currentPosition = getCurrentPosition(
			$navigationContext.selectedCategory,
			$navigationContext.selectedTask,
			$navigationContext.categoryHierarchy
		);

		// Calculate percentage based on position in the journey (avoid division by zero)
		depthPercentage = totalItems > 0 ? Math.round((currentPosition / totalItems) * 100) : 0;
	}

	// Ensure percentage is between 0 and 100
	$: depthPercentage = Math.min(Math.max(depthPercentage, 0), 100);
</script>

<div class="h-full rounded-lg p-4 flex flex-col justify-center items-center space-y-3 bg-white/50">
	<!-- Title -->
	<h3 class="text-lg font-semibold text-gray-800 text-center">{label}</h3>

	<!-- Progress Bar Container -->
	<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
		<!-- Progress Bar Fill -->
		<div
			class="h-full rounded-full transition-all duration-700 ease-out shadow-sm bg-gradient-to-r {colorClasses[
				color
			]}"
			style="width: {depthPercentage}%"
			title="Current position: {depthPercentage}% through the roadmap journey"
		>
			<!-- Shine effect (only show when there's progress) -->
			{#if depthPercentage > 0}
				<div
					class="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
				/>
			{/if}
		</div>
	</div>

	<!-- Percentage Display -->
	{#if showPercentage}
		<div class="flex items-center justify-between w-full text-sm">
			<span class="text-gray-600">Journey Progress</span>
			<span class="text-xl font-bold text-gray-900" title="Progress: {depthPercentage}%">
				{depthPercentage}%
			</span>
		</div>
	{/if}

	<!-- Optional: Progress indicator text -->
	<div class="text-xs text-gray-500 text-center">
		{#if depthPercentage === 0}
			Begin your learning journey
		{:else if depthPercentage < 25}
			Just getting started
		{:else if depthPercentage < 50}
			Making good progress
		{:else if depthPercentage < 75}
			Well on your way
		{:else if depthPercentage < 100}
			Almost there!
		{:else}
			Journey complete!
		{/if}
	</div>
</div>
