<script>
	// @ts-check
	import { navigationContext, updateBreadcrumbs } from '$lib/stores/breadcrumbStore.js';
	import { onMount } from 'svelte';
	import CategoryNode from './CategoryNode.svelte';

	/**
	 * @typedef {Object} Category
	 * @property {number} id
	 * @property {string} name
	 * @property {number|null} parent_id
	 * @property {number} level
	 * @property {string|null} description
	 * @property {string} created_at
	 * @property {Category[]} children
	 */

	/**
	 * @typedef {Object} Task
	 * @property {number} id
	 * @property {string} task_name
	 * @property {number} category_id
	 * @property {string} task_type
	 * @property {string} difficulty_level
	 * @property {number|null} estimated_hours
	 * @property {string|null} prerequisites
	 * @property {string} status
	 * @property {string} name
	 * @property {any[]} resources
	 */

	/**
	 * @typedef {Object} SideNavData
	 * @property {Category[]} categoryHierarchy
	 * @property {Record<number, Task[]>} topicsByCategory
	 * @property {number} totalCategories
	 * @property {number} totalTopics
	 */

	/** @type {SideNavData} */
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
		// Initialize navigation context with side nav data
		navigationContext.update((ctx) => ({
			...ctx,
			categoryHierarchy,
			topicsByCategory
		}));
	});

	// Update breadcrumbs when data changes
	$: if (categoryHierarchy.length > 0) {
		navigationContext.update((ctx) => ({
			...ctx,
			categoryHierarchy,
			topicsByCategory
		}));
	}

	// Sync expanded categories with navigation context
	$: if ($navigationContext?.expandedCategories) {
		expandedCategories = $navigationContext.expandedCategories;
	}

	/**
	 * Auto-expand parent categories when a task is selected
	 * @param {number} categoryId
	 */
	function expandParentCategories(categoryId) {
		const category = findCategoryById(categoryId, categoryHierarchy);
		if (category) {
			// Find and expand all parent categories
			let currentCategory = category;
			const categoriesToExpand = [];

			while (currentCategory) {
				categoriesToExpand.push(currentCategory.id);
				if (currentCategory.parent_id) {
					const parentCategory = findCategoryById(currentCategory.parent_id, categoryHierarchy);
					if (parentCategory) {
						currentCategory = parentCategory;
					} else {
						break;
					}
				} else {
					break;
				}
			}

			categoriesToExpand.forEach((id) => expandedCategories.add(id));
			expandedCategories = expandedCategories;

			// Update navigation context
			navigationContext.update((ctx) => ({
				...ctx,
				expandedCategories: new Set(expandedCategories)
			}));
		}
	}

	/**
	 * @param {number} categoryId
	 */
	function toggleCategory(categoryId) {
		if (isNavigating) return; // Prevent multiple clicks

		const category = findCategoryById(categoryId, categoryHierarchy);
		if (category) {
			// Only update breadcrumbs if category is being expanded
			if (!expandedCategories.has(categoryId)) {
				updateBreadcrumbs(category, categoryHierarchy, null);
			}
		}

		if (expandedCategories.has(categoryId)) {
			expandedCategories.delete(categoryId);
		} else {
			expandedCategories.add(categoryId);
		}
		expandedCategories = expandedCategories;

		// Update navigation context
		navigationContext.update((ctx) => ({
			...ctx,
			expandedCategories: new Set(expandedCategories)
		}));
	}

	/**
	 * @param {{ id?: number; task_name: any; category_id?: number; task_type?: string; difficulty_level?: string; estimated_hours?: number | null; prerequisites?: string | null; status?: string; name: any; resources?: any[]; }} task
	 */
	async function handleTaskClick(task) {
		if (isNavigating) return; // Prevent double-clicks

		// Prevent navigation if no valid category
		if (!task.category_id || !categoryHierarchy.length) {
			console.warn('Cannot navigate: Invalid task or missing category data');
			return;
		}

		isNavigating = true;
		try {
			const category = findCategoryById(task.category_id, categoryHierarchy);
			if (category) {
				// Auto-expand parent categories
				expandParentCategories(task.category_id);
				updateBreadcrumbs(category, categoryHierarchy, task);
			} else {
				console.warn('Category not found for task:', task.task_name || task.name);
			}
			console.log('Task clicked:', task.task_name || task.name);
		} finally {
			isNavigating = false;
		}
	}

	/**
	 * Find category by ID in hierarchy
	 * @param {number} categoryId
	 * @param {Category[]} categories
	 * @returns {Category|null}
	 */
	function findCategoryById(categoryId, categories) {
		for (const category of categories) {
			if (category.id === categoryId) {
				return category;
			}
			if (category.children && category.children.length > 0) {
				const found = findCategoryById(categoryId, category.children);
				if (found) return found;
			}
		}
		return null;
	}

	/**
	 * @param {string} status
	 */
	function getStatusColor(status) {
		switch (status) {
			case 'completed':
				return 'text-green-600';
			case 'in_progress':
				return 'text-yellow-600';
			default:
				return 'text-gray-400';
		}
	}

	/**
	 * @param {string} level
	 */
	function getDifficultyIcon(level) {
		switch (level) {
			case 'Beginner':
				return '🟢';
			case 'Intermediate':
				return '🟡';
			case 'Advanced':
				return '🔴';
			default:
				return '⚪';
		}
	}

	/**
	 * @param {number} level
	 */
	function getLevelIcon(level) {
		switch (level) {
			case 0:
				return '📁';
			case 1:
				return '📂';
			case 2:
				return '📄';
			default:
				return '📝';
		}
	}

	/**
	 * Get icon based on whether category has children (subtopics)
	 * @param {Category} category
	 */
	function getCategoryIcon(category) {
		// Use folder icons when category has children, paper/pencil when it's a leaf
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

	/**
	 * @param {number} level
	 */
	function getLevelIndent(level) {
		return `ml-${level * 4}`;
	}

	/**
	 * @param {number} level
	 */
	function getLevelColor(level) {
		switch (level) {
			case 0:
				return 'text-blue-700 font-semibold';
			case 1:
				return 'text-green-600 font-medium';
			case 2:
				return 'text-purple-600';
			case 3:
				return 'text-orange-600';
			case 4:
				return 'text-pink-600';
			case 5:
				return 'text-indigo-600';
			case 6:
				return 'text-teal-600';
			default:
				return 'text-gray-600';
		}
	}

	/**
	 * Recursively render category and its children
	 * @param {Category} category
	 * @param {number} depth
	 */
	function renderCategory(category, depth = 0) {
		return {
			category,
			depth,
			isExpanded: expandedCategories.has(category.id),
			tasks: topicsByCategory[category.id] || [],
			children: category.children || []
		};
	}
</script>

<div class="h-full col-span-2 rounded-lg bg-white shadow-sm border overflow-y-auto">
	<div class="p-4">
		<!-- Header -->
		<div class="mb-4 pb-3 border-b border-gray-200">
			<p class="text-lg text-center text-gray-500 mt-1">
				{totalCategories} categories • {totalTopics} tasks
			</p>
		</div>

		<!-- Navigation Tree -->
		<div class="space-y-1">
			{#each categoryHierarchy as category}
				<CategoryNode
					{category}
					depth={0}
					{expandedCategories}
					{topicsByCategory}
					{toggleCategory}
					{handleTaskClick}
					{getLevelIcon}
					{getCategoryIcon}
					{getLevelColor}
					{getStatusColor}
					{getDifficultyIcon}
				/>
			{/each}
		</div>
	</div>
</div>
