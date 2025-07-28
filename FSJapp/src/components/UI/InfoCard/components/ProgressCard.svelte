<script>
	import { getContext } from 'svelte';

	// Get the navigation context and cumulative counts
	const navigationContext = getContext('navigationContext');
	const cumulativeCounts = getContext('cumulativeCounts');

	// Props
	export let category = {};
	export let currentTask = null;
	export let allCategories = []; // Fallback prop

	// Reactive statements to get navigation context
	const navCtx = navigationContext || {};
	$: categoryHierarchy = navCtx.categoryHierarchy || allCategories || [];
	$: topicsByCategory = navCtx.topicsByCategory || {};

	// Get the current L0 branch root category
	$: currentL0Branch = findCurrentL0Branch(category, categoryHierarchy);
	$: branchName = currentL0Branch?.name || 'Current Branch';

	// Calculate progress within the current L0 branch (ALL descendant levels)
	$: progressData = calculateBranchProgress(category, currentL0Branch);

	// Debug logging
	$: {
		console.log('ProgressCard Debug:', {
			category: category,
			categoryHierarchy: categoryHierarchy,
			topicsByCategory: topicsByCategory,
			currentL0Branch: currentL0Branch,
			progressData: progressData
		});
	}

	/**
	 * Find the L0 (top-level) category that contains the current category
	 * @param {any} category
	 * @param {any[]} categoryHierarchy
	 * @returns {any|null}
	 */
	function findCurrentL0Branch(category, categoryHierarchy) {
		if (!category?.id || !categoryHierarchy?.length) return null;

		console.log('Finding L0 branch for category:', category);

		// Check different possible level indicators
		const isL0 =
			category.level === 'L0' ||
			category.level === 0 ||
			category.depth === 0 ||
			!category.parent_id;

		// If current category is L0, return it
		if (isL0) {
			console.log('Category is L0:', category);
			return category;
		}

		// Find the L0 ancestor by traversing up the hierarchy
		let current = category;
		let attempts = 0;
		while (current && attempts < 10) {
			// Prevent infinite loops
			attempts++;
			console.log(`Attempt ${attempts}, current category:`, current);

			// Check if current is L0
			const currentIsL0 =
				current.level === 'L0' || current.level === 0 || current.depth === 0 || !current.parent_id;

			if (currentIsL0) {
				console.log('Found L0 ancestor:', current);
				return current;
			}

			// Find parent in hierarchy
			const parent = categoryHierarchy.find((cat) =>
				cat.children?.some((child) => child.id === current.id)
			);

			if (parent) {
				current = parent;
			} else {
				// If no parent found, try finding by parent_id
				if (current.parent_id) {
					const parentById = categoryHierarchy.find((cat) => cat.id === current.parent_id);
					if (parentById) {
						current = parentById;
					} else {
						break;
					}
				} else {
					break;
				}
			}
		}

		console.log('No L0 branch found, returning current:', current);
		return current;
	}

	/**
	 * Flatten category hierarchy for easier traversal
	 * @param {any[]} categories
	 * @returns {any[]}
	 */
	function flattenCategories(categories) {
		const flattened = [];
		function traverse(cats) {
			for (const cat of cats) {
				flattened.push(cat);
				if (cat.children?.length) {
					traverse(cat.children);
				}
			}
		}
		traverse(categories);
		return flattened;
	}

	/**
	 * Count total items (categories + tasks + resources) in ALL levels under L0 branch
	 * @param {any} rootCategory
	 * @returns {number}
	 */
	function getTotalItemsInBranch(rootCategory) {
		if (!rootCategory) return 0;

		let total = 0;

		function countInBranch(category) {
			// Count ALL categories under L0 (L1, L2, L3, etc.) - exclude only L0 itself
			const isL0 =
				category.level === 'L0' ||
				category.level === 0 ||
				category.depth === 0 ||
				!category.parent_id;

			if (!isL0) {
				total += 1; // Count the category itself

				// Count tasks for this category
				const tasks = topicsByCategory[category.id] || [];
				total += tasks.length;

				// Count resources (if we have them in the context)
				const resources = navCtx?.resourcesByCategory?.[category.id] || [];
				total += resources.length;
			}

			// Recursively count ALL children (L1, L2, L3, etc.)
			if (category.children?.length) {
				category.children.forEach(countInBranch);
			}
		}

		countInBranch(rootCategory);
		return total;
	}

	/**
	 * Calculate current position within ALL nodes under the L0 branch
	 * @param {any} category
	 * @param {any} currentTask
	 * @param {any} rootCategory
	 * @returns {number}
	 */
	function getCurrentPositionInBranch(category, currentTask, rootCategory) {
		if (!rootCategory) return 0;

		let position = 0;
		let found = false;

		function traverseBranch(cat) {
			if (found) return;

			// Process ALL categories under L0 (L1, L2, L3, etc.)
			const isL0 = cat.level === 'L0' || cat.level === 0 || cat.depth === 0 || !cat.parent_id;

			if (!isL0) {
				// If this is our current category, stop here
				if (cat.id === category?.id) {
					position += 1; // Count the category

					// If we have a current task, add its position within this category
					if (currentTask) {
						const tasks = topicsByCategory[cat.id] || [];
						const taskIndex = tasks.findIndex((task) => task.id === currentTask.id);
						if (taskIndex >= 0) {
							position += taskIndex; // Add task position within category
						}
					}
					found = true;
					return;
				}

				// Count this category and ALL its tasks/resources (since we haven't reached current yet)
				position += 1; // Count the category
				const tasks = topicsByCategory[cat.id] || [];
				position += tasks.length; // Count all tasks in this category
				const resources = navCtx?.resourcesByCategory?.[cat.id] || [];
				position += resources.length; // Count all resources
			}

			// Recursively traverse ALL children levels
			if (cat.children?.length && !found) {
				cat.children.forEach(traverseBranch);
			}
		}

		traverseBranch(rootCategory);
		return position;
	}

	/**
	 * Calculate progress percentage within the entire L0 branch
	 * @param {any} category
	 * @param {any} rootCategory
	 * @returns {{ percentage: number, current: number, total: number }}
	 */
	function calculateBranchProgress(category, rootCategory) {
		if (!rootCategory || !category) {
			return { percentage: 0, current: 0, total: 0 };
		}

		const total = getTotalItemsInBranch(rootCategory);
		const current = getCurrentPositionInBranch(category, currentTask, rootCategory);
		const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

		console.log('Branch Progress Calculation:', {
			rootCategory: rootCategory.name,
			currentCategory: category.name,
			current,
			total,
			percentage
		});

		return { percentage, current, total };
	}
</script>

{#if category}
	<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
		<h3 class="text-lg font-semibold text-gray-800 mb-4">Path Progress</h3>

		<div class="space-y-4">
			<!-- Complete Branch Progress (All nodes under L0) -->
			<div>
				<div class="flex justify-between items-center mb-2">
					<span class="text-sm font-medium text-gray-700">
						{branchName} Journey
					</span>
					<span class="text-sm font-bold text-blue-600">
						{progressData.percentage}% ({progressData.current}/{progressData.total})
					</span>
				</div>
				<div class="w-full bg-gray-200 rounded-full h-4">
					<div
						class="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-blue-600"
						style="width: {progressData.percentage}%"
					>
						{#if progressData.percentage > 0}
							<div
								class="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
							/>
						{/if}
					</div>
				</div>
				<p class="text-xs text-gray-500 mt-1">
					Your position within the entire {branchName} journey
					{#if currentL0Branch}
						<br />
						<span class="text-xs text-gray-400">
							(Includes all categories, tasks, and resources in this learning path)
						</span>
					{/if}
				</p>
			</div>
		</div>
	</div>
{/if}
