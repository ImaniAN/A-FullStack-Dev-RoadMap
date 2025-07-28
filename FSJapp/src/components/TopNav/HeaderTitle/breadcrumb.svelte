<script lang="ts">
	import { page } from '$app/stores';
	import { navigationContext, updateBreadcrumbs } from '$lib/stores/breadcrumbStore.js';

	// Breadcrumb item type
	interface BreadcrumbItem {
		label: string;
		href: string;
		active?: boolean;
		categoryId?: number;
		taskId?: number;
	}

	let breadcrumbs: BreadcrumbItem[] = [];

	// React to navigation context changes
	$: if ($navigationContext?.breadcrumbs) {
		breadcrumbs = $navigationContext.breadcrumbs;
	} else {
		// Default fallback breadcrumbs
		breadcrumbs = [{ label: 'Home', href: '/', active: true }];
	}

	// Generate breadcrumbs from current route (kept for potential future use)
	function generateBreadcrumbs(currentPath: string): BreadcrumbItem[] {
		const segments = currentPath.split('/').filter(Boolean);
		const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

		let path = '';
		segments.forEach((segment, index) => {
			path += `/${segment}`;
			const isLast = index === segments.length - 1;

			items.push({
				label: segment.charAt(0).toUpperCase() + segment.slice(1),
				href: path,
				active: isLast
			});
		});

		return items;
	}

	/**
	 * Auto-expand parent categories when navigating via breadcrumb
	 * @param {number} categoryId
	 * @param {any[]} categoryHierarchy
	 */
	function expandParentCategories(categoryId, categoryHierarchy) {
		const category = findCategoryById(categoryId, categoryHierarchy);
		if (category) {
			// Find and expand all parent categories
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

			// Update the navigation context with expanded categories
			navigationContext.update((ctx) => ({
				...ctx,
				expandedCategories: new Set([...ctx.expandedCategories, ...categoriesToExpand])
			}));
		}
	}

	/**
	 * Handle breadcrumb click - navigate using the same system as sideNav
	 * @param {BreadcrumbItem} crumb
	 */
	function handleBreadcrumbClick(crumb) {
		if (crumb.categoryId && $navigationContext?.categoryHierarchy) {
			const category = findCategoryById(crumb.categoryId, $navigationContext.categoryHierarchy);
			if (category) {
				// Auto-expand the clicked category and its parents
				expandParentCategories(crumb.categoryId, $navigationContext.categoryHierarchy);

				// If it's a task breadcrumb, find the task too
				if (crumb.taskId) {
					const tasks = $navigationContext.topicsByCategory[crumb.categoryId] || [];
					const task = tasks.find((t) => t.id === crumb.taskId);
					updateBreadcrumbs(category, task || null, $navigationContext.categoryHierarchy);
				} else {
					updateBreadcrumbs(category, null, $navigationContext.categoryHierarchy);
				}
			}
		}
	}

	/**
	 * Find category by ID in hierarchy
	 * @param {number} categoryId
	 * @param {any[]} categories
	 * @returns {any|null}
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
	 * Handle home click - reset navigation to home state
	 */
	function handleHomeClick() {
		navigationContext.update((ctx) => ({
			...ctx,
			breadcrumbs: [{ label: 'Home', href: '/', active: true }],
			selectedCategory: null,
			selectedTask: null
		}));
	}
</script>

<nav aria-label="Breadcrumb" class="flex items-center">
	<ol class="flex items-center gap-1 text-sm text-gray-600">
		{#each breadcrumbs as crumb, index}
			<li class="flex items-center">
				{#if crumb.active}
					<span
						class="font-medium text-gray-900"
						title={crumb.categoryId ? `Category ID: ${crumb.categoryId}` : ''}
					>
						{crumb.label}
					</span>
				{:else if crumb.categoryId}
					<!-- Use button for navigation breadcrumbs -->
					<button
						class="transition-colors hover:text-gray-900 hover:underline text-left"
						title={crumb.categoryId ? `Category ID: ${crumb.categoryId}` : ''}
						on:click={() => handleBreadcrumbClick(crumb)}
					>
						{crumb.label}
					</button>
				{:else}
					<!-- Handle Home and other non-category links -->
					{#if crumb.label === 'Home'}
						<button
							class="transition-colors hover:text-gray-900 hover:underline text-left"
							on:click={handleHomeClick}
						>
							{crumb.label}
						</button>
					{:else}
						<a href={crumb.href} class="transition-colors hover:text-gray-900 hover:underline">
							{crumb.label}
						</a>
					{/if}
				{/if}
			</li>

			<!-- Separator (don't show after last item) -->
			{#if index < breadcrumbs.length - 1}
				<li class="rtl:rotate-180 mx-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
