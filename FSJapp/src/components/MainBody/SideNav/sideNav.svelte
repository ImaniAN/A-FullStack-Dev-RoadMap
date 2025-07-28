<script>
	// @ts-check
	import { navigationContext, updateBreadcrumbs } from '$lib/stores/breadcrumbStore.js';
	import { onMount } from 'svelte';

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

	/**
	 * @param {number} categoryId
	 */
	function toggleCategory(categoryId) {
		const category = findCategoryById(categoryId, categoryHierarchy);
		if (category) {
			updateBreadcrumbs(category, null, categoryHierarchy);
		}

		if (expandedCategories.has(categoryId)) {
			expandedCategories.delete(categoryId);
		} else {
			expandedCategories.add(categoryId);
		}
		expandedCategories = expandedCategories;
	}

	/**
	 * @param {{ id?: number; task_name: any; category_id?: number; task_type?: string; difficulty_level?: string; estimated_hours?: number | null; prerequisites?: string | null; status?: string; name: any; resources?: any[]; }} task
	 */
	function handleTaskClick(task) {
		// Add null/undefined check before calling findCategoryById
		if (task.category_id != null) {
			const category = findCategoryById(task.category_id, categoryHierarchy);
			if (category) {
				updateBreadcrumbs(category, task, categoryHierarchy);
			}
		}
		console.log('Task clicked:', task.task_name || task.name);
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

<div class="h-full rounded-lg bg-white shadow-sm border overflow-y-auto">
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
				{@const categoryData = renderCategory(category)}
				<div class="border-l-2 border-blue-100">
					<!-- Category Header -->
					<button
						class="w-full text-left p-2 hover:bg-gray-50 rounded-r-lg transition-colors flex items-center justify-between group"
						on:click={() => toggleCategory(category.id)}
					>
						<div class="flex items-center gap-2">
							<span>{getLevelIcon(category.level)}</span>
							<span class="{getLevelColor(category.level)} text-sm">{category.name}</span>
							<span class="text-xs text-gray-400">Level {category.level}</span>
						</div>
						<span class="text-gray-400 text-xs">
							{expandedCategories.has(category.id) ? '▲' : '▼'}
						</span>
					</button>

					<!-- Only show content when category is expanded -->
					{#if expandedCategories.has(category.id)}
						<!-- Tasks in Category -->
						{#if topicsByCategory[category.id]}
							<div class="ml-6 mt-1 space-y-1">
								{#each topicsByCategory[category.id] as task}
									<button
										class="w-full text-left p-2 text-xs hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-200"
										on:click={() => handleTaskClick(task)}
									>
										<div class="flex items-center gap-2">
											<span class="text-blue-400">↳</span>
											<span class={getStatusColor(task.status)}>
												{task.task_name || task.name}
											</span>
											<span title="Difficulty">{getDifficultyIcon(task.difficulty_level)}</span>
											{#if task.estimated_hours}
												<span class="text-gray-400 ml-auto text-xs">
													{task.estimated_hours}h
												</span>
											{/if}
										</div>

										{#if task.task_type}
											<div class="ml-6 mt-1">
												<span class="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
													{task.task_type}
												</span>
												{#if task.resources && task.resources.length > 0}
													<span class="text-xs text-blue-500 ml-2">
														{task.resources.length} resource{task.resources.length !== 1 ? 's' : ''}
													</span>
												{/if}
											</div>
										{/if}
									</button>
								{/each}
							</div>
						{/if}

						<!-- Subcategories (Level 1 within Level 0) -->
						{#if category.children && category.children.length > 0}
							<div class="ml-4 mt-1">
								{#each category.children as subCategory}
									<div class="border-l border-gray-200 pl-2">
										<button
											class="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors flex items-center justify-between group"
											on:click={() => toggleCategory(subCategory.id)}
										>
											<div class="flex items-center gap-2">
												<span>{getLevelIcon(subCategory.level)}</span>
												<span class="{getLevelColor(subCategory.level)} text-xs">
													{subCategory.name}
												</span>
												<span class="text-xs text-gray-400">Level {subCategory.level}</span>
											</div>
											<span class="text-gray-400 text-xs">
												{expandedCategories.has(subCategory.id) ? '▲' : '▼'}
											</span>
										</button>

										<!-- Only show subcategory content when it's expanded -->
										{#if expandedCategories.has(subCategory.id)}
											<!-- Tasks in Subcategory -->
											{#if topicsByCategory[subCategory.id]}
												<div class="ml-6 mt-1 space-y-1">
													{#each topicsByCategory[subCategory.id] as task}
														<button
															class="w-full text-left p-1 text-xs hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-2"
															on:click={() => handleTaskClick(task)}
														>
															<span class="text-blue-300">↳</span>
															<span class={getStatusColor(task.status)}>
																{task.task_name || task.name}
															</span>
															<span title="Difficulty"
																>{getDifficultyIcon(task.difficulty_level)}</span
															>
														</button>
													{/each}
												</div>
											{/if}

											<!-- Level 2 subcategories if they exist -->
											{#if subCategory.children && subCategory.children.length > 0}
												<div class="ml-4 mt-1">
													{#each subCategory.children as subSubCategory}
														<div class="border-l border-gray-100 pl-2">
															<button
																class="w-full text-left p-1 hover:bg-gray-50 rounded transition-colors flex items-center justify-between text-xs"
																on:click={() => toggleCategory(subSubCategory.id)}
															>
																<div class="flex items-center gap-2">
																	<span>{getLevelIcon(subSubCategory.level)}</span>
																	<span class={getLevelColor(subSubCategory.level)}>
																		{subSubCategory.name}
																	</span>
																</div>
																<span class="text-gray-400">
																	{expandedCategories.has(subSubCategory.id) ? '▲' : '▼'}
																</span>
															</button>

															{#if expandedCategories.has(subSubCategory.id) && topicsByCategory[subSubCategory.id]}
																<div class="ml-4 mt-1 space-y-1">
																	{#each topicsByCategory[subSubCategory.id] as task}
																		<button
																			class="w-full text-left p-1 text-xs hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-2"
																			on:click={() => handleTaskClick(task)}
																		>
																			<span class="text-blue-200">↳</span>
																			<span class={getStatusColor(task.status)}>
																				{task.task_name || task.name}
																			</span>
																		</button>
																	{/each}
																</div>
															{/if}
														</div>
													{/each}
												</div>
											{/if}
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
