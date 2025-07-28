<script lang="ts">
	import { navigationContext, updateBreadcrumbs } from '$lib/stores/breadcrumbStore.js';
	import { onMount } from 'svelte';
	import CategoryNode from './CategoryNode.svelte';

	export let sideNavData = {
		categoryHierarchy: [],
		topicsByCategory: {},
		totalCategories: 0,
		totalTopics: 0,
		categoryStats: {},
		allResources: [],
		recentlyAdded: [],
		difficultyDistribution: {},
		completionStats: {},
		resourceStats: {},
		learningPathStats: {}
	};

	$: ({
		categoryHierarchy,
		topicsByCategory,
		totalCategories,
		totalTopics,
		categoryStats,
		allResources,
		recentlyAdded,
		difficultyDistribution,
		completionStats,
		resourceStats,
		learningPathStats
	} = sideNavData);

	let expandedCategories = new Set();
	let isNavigating = false;

	onMount(() => {
		navigationContext.update((ctx) => ({
			...ctx,
			...sideNavData
		}));
	});

	$: if (categoryHierarchy.length > 0) {
		navigationContext.update((ctx) => ({
			...ctx,
			...sideNavData
		}));
	}

	$: if ($navigationContext?.expandedCategories) {
		expandedCategories = $navigationContext.expandedCategories;
	}

	function expandParentCategories(categoryId: string): void {
		const category = findCategoryById(categoryId, categoryHierarchy);
		if (!category) return;

		let currentCategory = category;
		const categoriesToExpand = [];

		while (currentCategory) {
			categoriesToExpand.push(currentCategory.id);
			if (currentCategory.parent_id) {
				currentCategory = findCategoryById(currentCategory.parent_id, categoryHierarchy);
			} else {
				break;
			}
		}

		categoriesToExpand.forEach((id) => expandedCategories.add(id));
		expandedCategories = expandedCategories;

		navigationContext.update((ctx) => ({
			...ctx,
			expandedCategories: new Set(expandedCategories)
		}));
	}

	function collapseToCategory(categoryId: string): void {
		expandedCategories.clear();

		const category = findCategoryById(categoryId, categoryHierarchy);
		if (!category) return;

		let currentCategory = category;
		const pathCategories = [];

		while (currentCategory) {
			pathCategories.push(currentCategory.id);
			if (currentCategory.parent_id) {
				currentCategory = findCategoryById(currentCategory.parent_id, categoryHierarchy);
			} else {
				break;
			}
		}

		pathCategories.forEach((id) => expandedCategories.add(id));
		expandedCategories = expandedCategories;

		navigationContext.update((ctx) => ({
			...ctx,
			expandedCategories: new Set(expandedCategories)
		}));
	}

	function toggleCategory(categoryId: string): void {
		if (isNavigating) return;

		const category = findCategoryById(categoryId, categoryHierarchy);
		if (category) {
			collapseToCategory(categoryId);
			updateBreadcrumbs(category, categoryHierarchy, null);
		}
	}

	async function handleTaskClick(task: { category_id: string }): Promise<void> {
		if (isNavigating || !task.category_id || !categoryHierarchy.length) return;

		isNavigating = true;
		try {
			const category = findCategoryById(task.category_id, categoryHierarchy);
			if (category) {
				collapseToCategory(task.category_id);
				updateBreadcrumbs(category, categoryHierarchy, task);
			}
		} finally {
			isNavigating = false;
		}
	}

	function findCategoryById(categoryId: string, categories: any[]): any {
		for (const category of categories) {
			if (category.id === categoryId) return category;
			if (category.children?.length > 0) {
				const found = findCategoryById(categoryId, category.children);
				if (found) return found;
			}
		}
		return null;
	}

	function getStatusColor(status: string): string {
		const colors = {
			completed: 'text-green-600',
			in_progress: 'text-yellow-600'
		};
		return colors[status as keyof typeof colors] || 'text-gray-400';
	}

	// Simplified functions without external dependencies
	function getDifficultyIcon(level: number): string {
		const icons = ['🎓', '🥉', '🥈', '🥇', '💎', '👑', '⭐'];
		return icons[Math.min(level - 1, icons.length - 1)] || '🎓';
	}

	function getProgressForCategory(category: any): string {
		// Simple progress calculation without external dependencies
		if (!category || !categoryHierarchy.length) return '0%';

		// Basic progress based on category position in hierarchy
		const totalCategories = categoryHierarchy.length;
		const categoryIndex = categoryHierarchy.findIndex((cat) => cat.id === category.id);
		const progress = categoryIndex >= 0 ? Math.round((categoryIndex / totalCategories) * 100) : 0;

		return `${progress}%`;
	}

	function getCategoryIcon(category: any): string {
		// Use folder icons when category has children, document icons when it's a leaf
		if (category.children && category.children.length > 0) {
			// Different folder types based on level for better visual hierarchy
			switch (category.level) {
				case 0:
					return '📁'; // Main categories - closed folder
				case 1:
					return '📂'; // Level 1 - open folder
				case 2:
					return '🗂️'; // Level 2 - card file box
				default:
					return '📋'; // Deeper levels - clipboard
			}
		} else {
			// Different document types for leaf categories
			switch (category.level) {
				case 0:
				case 1:
				case 2:
					return '📝'; // Standard document
				case 3:
					return '📄'; // Page document
				case 4:
					return '🔖'; // Bookmark
				case 5:
					return '🏷️'; // Label
				default:
					return '▫️'; // Small square for very deep levels
			}
		}
	}

	function getLevelColor(level: number): string {
		const colors = [
			'text-blue-700 font-semibold', // Level 0
			'text-green-600 font-medium', // Level 1
			'text-purple-600', // Level 2
			'text-orange-600', // Level 3
			'text-pink-600', // Level 4
			'text-indigo-600', // Level 5
			'text-teal-600' // Level 6+
		];
		return colors[Math.min(level, colors.length - 1)] || 'text-gray-600';
	}
</script>

<div
	class="h-full max-h-full col-span-2 rounded-lg bg-white shadow-sm border overflow-hidden flex flex-col"
>
	<div class="p-4 flex-1 overflow-y-auto scrollbar-hide">
		<!-- Header -->
		<div class="mb-4 pb-3 border-b border-gray-200">
			<p class="text-lg text-center text-gray-500 mt-1">
				{totalCategories} categories • {totalTopics} tasks
			</p>
		</div>

		<!-- Navigation Tree -->
		<div class="space-y-1">
			{#if categoryHierarchy && categoryHierarchy.length > 0}
				{#each categoryHierarchy as category}
					<CategoryNode
						{category}
						depth={0}
						{expandedCategories}
						{topicsByCategory}
						{toggleCategory}
						{handleTaskClick}
						{getCategoryIcon}
						{getLevelColor}
						{getStatusColor}
						{getDifficultyIcon}
					/>
				{/each}
			{:else}
				<div class="text-center text-gray-500 py-8">
					<p>No categories available</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
