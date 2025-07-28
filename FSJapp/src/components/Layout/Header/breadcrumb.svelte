<script>
	import { navigationContext, updateBreadcrumbs } from '$lib/stores/breadcrumbStore.js';

	let breadcrumbs = [];

	$: if ($navigationContext?.breadcrumbs) {
		breadcrumbs = $navigationContext.breadcrumbs;
	} else {
		breadcrumbs = [{ label: 'Home', href: '/', active: true }];
	}

	function collapseToCategory(categoryId, categoryHierarchy) {
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

		navigationContext.update((ctx) => ({
			...ctx,
			expandedCategories: new Set(pathCategories)
		}));
	}

	function handleBreadcrumbClick(crumb) {
		if (crumb.categoryId && $navigationContext?.categoryHierarchy) {
			const category = findCategoryById(crumb.categoryId, $navigationContext.categoryHierarchy);
			if (category) {
				collapseToCategory(crumb.categoryId, $navigationContext.categoryHierarchy);

				if (crumb.taskId) {
					const tasks = $navigationContext.topicsByCategory[crumb.categoryId] || [];
					const task = tasks.find((t) => t.id === crumb.taskId);
					updateBreadcrumbs(category, $navigationContext.categoryHierarchy, task || null);
				} else {
					updateBreadcrumbs(category, $navigationContext.categoryHierarchy, null);
				}
			}
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

	function handleHomeClick() {
		navigationContext.update((ctx) => ({
			...ctx,
			breadcrumbs: [{ label: 'Home', href: '/', active: true }],
			selectedCategory: null,
			selectedTask: null,
			expandedCategories: new Set()
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
					<button
						class="transition-colors hover:text-gray-900 hover:underline text-left"
						title={crumb.categoryId ? `Category ID: ${crumb.categoryId}` : ''}
						on:click={() => handleBreadcrumbClick(crumb)}
					>
						{crumb.label}
					</button>
				{:else if crumb.label === 'Home'}
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
			</li>

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
