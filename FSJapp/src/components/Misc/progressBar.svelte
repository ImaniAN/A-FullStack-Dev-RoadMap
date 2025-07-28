<script lang="ts">
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';

	// Props - customizable appearance
	export let label = 'Depth'; // Customizable label
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
	 * Calculate maximum depth in the category hierarchy
	 * @param {any[]} categories
	 * @param {number} currentDepth
	 * @returns {number}
	 */
	function getMaxDepth(categories: any[], currentDepth = 0): number {
		let maxDepth = currentDepth;

		for (const category of categories) {
			if (category.children && category.children.length > 0) {
				const childDepth = getMaxDepth(category.children, currentDepth + 1);
				maxDepth = Math.max(maxDepth, childDepth);
			}
		}

		return maxDepth;
	}

	/**
	 * Calculate current navigation depth based on selected category/task
	 * @param {any} selectedCategory
	 * @param {any} selectedTask
	 * @param {any[]} categoryHierarchy
	 * @returns {number}
	 */
	function getCurrentDepth(
		selectedCategory: any,
		selectedTask: any,
		categoryHierarchy: any[]
	): number {
		if (!selectedCategory) return 0;

		// Find the path to current category
		const path = findCategoryPath(selectedCategory.id, categoryHierarchy);
		let depth = path ? path.length - 1 : 0;

		// Add 1 more level if a task is selected
		if (selectedTask) {
			depth += 1;
		}

		return depth;
	}

	/**
	 * Find the path to a category in the hierarchy
	 * @param {number} categoryId
	 * @param {any[]} categories
	 * @param {any[]} path
	 * @returns {any[] | null}
	 */
	function findCategoryPath(categoryId: number, categories: any[], path: any[] = []): any[] | null {
		for (const category of categories) {
			const currentPath = [...path, category];

			if (category.id === categoryId) {
				return currentPath;
			}

			if (category.children && category.children.length > 0) {
				const foundPath = findCategoryPath(categoryId, category.children, currentPath);
				if (foundPath) return foundPath;
			}
		}
		return null;
	}

	// Calculate depth percentage based on navigation context
	$: if ($navigationContext) {
		const maxDepth = getMaxDepth($navigationContext.categoryHierarchy);
		const currentDepth = getCurrentDepth(
			$navigationContext.selectedCategory,
			$navigationContext.selectedTask,
			$navigationContext.categoryHierarchy
		);

		// Calculate percentage (avoid division by zero)
		depthPercentage = maxDepth > 0 ? Math.round((currentDepth / maxDepth) * 100) : 0;
	}

	// Ensure percentage is between 0 and 100
	$: depthPercentage = Math.min(Math.max(depthPercentage, 0), 100);
</script>

<div class="h-1/6 rounded pb-2 flex items-center justify-center">
	<h3 class="text-sm font-medium text-gray-700">{label}</h3>
	<!-- Depth Bar Container -->
	<div class="w-3/4 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner mx-1">
		<!-- Depth Bar Fill -->
		<div
			class="h-full rounded-full transition-all duration-700 ease-out shadow-sm bg-gradient-to-r {colorClasses[
				color
			]}"
			style="width: {depthPercentage}%"
			title="Current navigation depth: {depthPercentage}% of maximum hierarchy depth"
		>
			<!-- Shine effect (only show when there's progress) -->
			{#if depthPercentage > 0}
				<div
					class="h-full w-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-ping"
				/>
			{/if}
		</div>
	</div>
	{#if showPercentage}
		<span class="text-sm font-semibold text-gray-900" title="Depth: {depthPercentage}%">
			{depthPercentage}%
		</span>
	{/if}
</div>
