<script>
	import { navigationContext, updateBreadcrumbs } from '$lib/stores/breadcrumbStore.js';
	import { onMount } from 'svelte';
	import CategoryNode from './CategoryNode.svelte';

	export let sideNavData = {
		categoryHierarchy: [],
		topicsByCategory: {},
		totalCategories: 0,
		totalTopics: 0
	};

	$: ({ categoryHierarchy, topicsByCategory, totalCategories, totalTopics } = sideNavData);

	let expandedCategories = new Set();
	let isNavigating = false;

	onMount(() => {
		navigationContext.update((ctx) => ({
			...ctx,
			categoryHierarchy,
			topicsByCategory
		}));
	});

	$: if (categoryHierarchy.length > 0) {
		navigationContext.update((ctx) => ({
			...ctx,
			categoryHierarchy,
			topicsByCategory
		}));
	}

	$: if ($navigationContext?.expandedCategories) {
		expandedCategories = $navigationContext.expandedCategories;
	}

	function expandParentCategories(categoryId) {
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

	function collapseToCategory(categoryId) {
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

	function toggleCategory(categoryId) {
		if (isNavigating) return;

		const category = findCategoryById(categoryId, categoryHierarchy);
		if (category) {
			collapseToCategory(categoryId);
			updateBreadcrumbs(category, categoryHierarchy, null);
		}
	}

	async function handleTaskClick(task) {
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

	function findCategoryById(categoryId, categories) {
		for (const category of categories) {
			if (category.id === categoryId) return category;
			if (category.children?.length > 0) {
				const found = findCategoryById(categoryId, category.children);
				if (found) return found;
			}
		}
		return null;
	}

	function getStatusColor(status) {
		const colors = {
			completed: 'text-green-600',
			in_progress: 'text-yellow-600'
		};
		return colors[status] || 'text-gray-400';
	}

	function getDifficultyIcon(level) {
		const icons = {
			Advanced: '�',
			Intermediate: '⚡',
			Beginner: '🌱'
		};
		return icons[level] || '🎯';
	}

	function getCategoryIcon(category) {
		if (category.children?.length > 0) {
			const levelIcons = ['📁', '📂', '🗂️', '📋'];
			return levelIcons[Math.min(category.level, levelIcons.length - 1)] || '�';
		} else {
			const leafIcons = ['�', '📄', '🔖', '🏷️', '▫️'];
			return leafIcons[Math.min(category.level, leafIcons.length - 1)] || '▫️';
		}
	}

	function getLevelColor(level) {
		const colors = [
			'text-blue-700 font-semibold',
			'text-green-600 font-medium',
			'text-purple-600',
			'text-orange-600',
			'text-pink-600',
			'text-indigo-600',
			'text-teal-600'
		];
		return colors[Math.min(level, colors.length - 1)] || 'text-gray-600';
	}
</script>

<div class="h-full col-span-2 rounded-lg bg-white shadow-sm border overflow-y-auto scrollbar-hide">
	<div class="p-4">
		<div class="mb-4 pb-3 border-b border-gray-200">
			<p class="text-lg text-center text-gray-500 mt-1">
				{totalCategories} categories • {totalTopics} tasks
			</p>
		</div>

		<div class="space-y-1">
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
		</div>
	</div>
</div>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
