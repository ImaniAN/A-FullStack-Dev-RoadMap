<script lang="ts">
	import { navigationContext, cumulativeCounts } from '$lib/stores/breadcrumbStore.js';
	import { onMount } from 'svelte';

	// Static imports with fallback handling
	let CategoryOverview: any, ProgressCard: any, StatisticsCard: any, ResourcesList: any;
	let componentsLoaded = false;

	onMount(async () => {
		try {
			// Async imports with better error handling
			const categoryOverview = await import('./components/CategoryOverview.svelte');
			const progressCard = await import('./components/ProgressCard.svelte');
			const statisticsCard = await import('./components/StatisticsCard.svelte');
			const resourcesList = await import('./components/ResourcesList.svelte');

			CategoryOverview = categoryOverview.default || categoryOverview;
			ProgressCard = progressCard.default || progressCard;
			StatisticsCard = statisticsCard.default || statisticsCard;
			ResourcesList = resourcesList.default || resourcesList;
			componentsLoaded = true;
		} catch (error) {
			console.warn('Failed to import some components:', error);
			componentsLoaded = false;
		}
	});

	// Subscribe to navigation context with proper null checks
	$: selectedCategory = $navigationContext?.selectedCategory || null;
	$: categoryHierarchy = $navigationContext?.categoryHierarchy || [];
	$: topicsByCategory = $navigationContext?.topicsByCategory || {};
	$: allResources = ($navigationContext as any)?.allResources || [];
	$: allCategories = categoryHierarchy || [];

	// Extract data based on selected category with null safety
	$: subcategories =
		selectedCategory && categoryHierarchy
			? (categoryHierarchy as any[]).filter(
					(cat: any) => cat?.parent_id === (selectedCategory as any).id
			  )
			: [];

	$: resources =
		selectedCategory && topicsByCategory && allResources
			? getResourcesForCategory((selectedCategory as any).id, topicsByCategory, allResources)
			: [];

	// Use the derived store for cumulative counts - no need to calculate here
	$: dynamicCumulativeCounts = $cumulativeCounts;

	// Helper function with proper null checks
	function getResourcesForCategory(categoryId: any, topicsByCategory: any, allResources: any) {
		if (!categoryId || !topicsByCategory || !allResources || !Array.isArray(allResources)) {
			return [];
		}

		const categoryTasks = topicsByCategory[categoryId] || [];
		if (!Array.isArray(categoryTasks)) return [];

		const taskIds = categoryTasks.map((task) => task?.id).filter((id) => id != null);
		return allResources.filter(
			(resource) => resource?.task_id && taskIds.includes(resource.task_id)
		);
	}

	// Fixed statistics calculation with proper null checks and defaults
	$: statistics = {
		averageDifficulty: calculateAverageDifficulty(),
		maxDepth: calculateMaxLevel(),
		difficultyDistribution: calculateDifficultyDistribution()
	};

	function calculateMaxLevel() {
		if (!categoryHierarchy || !Array.isArray(categoryHierarchy) || categoryHierarchy.length === 0) {
			return 0;
		}

		const levels = (categoryHierarchy as any[])
			.map((cat: any) => cat?.level ?? cat?.depth ?? 0)
			.filter((level: number) => typeof level === 'number' && !isNaN(level));

		return levels.length > 0 ? Math.max(...levels) : 0;
	}

	function calculateAverageDifficulty() {
		if (!topicsByCategory || typeof topicsByCategory !== 'object') {
			return 1;
		}

		const allTasks = Object.values(topicsByCategory)
			.flat()
			.filter((task) => task && typeof task === 'object');

		if (allTasks.length === 0) return 1;

		const validDifficulties = allTasks.map((task) => {
			const difficulty = task?.difficulty_level;
			return typeof difficulty === 'number' && !isNaN(difficulty)
				? Math.max(1, Math.min(7, difficulty))
				: 1;
		});

		if (validDifficulties.length === 0) return 1;

		const totalDifficulty = validDifficulties.reduce((sum, diff) => sum + diff, 0);
		const average = totalDifficulty / validDifficulties.length;

		return typeof average === 'number' && !isNaN(average) ? Number(average.toFixed(1)) : 1;
	}

	function calculateDifficultyDistribution() {
		if (!topicsByCategory || typeof topicsByCategory !== 'object') {
			return {};
		}

		const distribution: { [key: number]: number } = {};
		const allTasks = Object.values(topicsByCategory)
			.flat()
			.filter((task) => task && typeof task === 'object');

		allTasks.forEach((task: any) => {
			const difficulty = task?.difficulty_level;
			if (typeof difficulty === 'number' && !isNaN(difficulty)) {
				const level = Math.max(1, Math.min(7, difficulty));
				distribution[level] = (distribution[level] || 0) + 1;
			}
		});

		return distribution;
	}
</script>

<div class="h-full rounded-lg bg-white shadow-sm border overflow-hidden flex flex-col">
	<div class="space-y-6 flex-1 p-4 overflow-y-auto scrollbar-hide">
		{#if componentsLoaded}
			{#if selectedCategory && CategoryOverview && ProgressCard && ResourcesList}
				<!-- Category Overview -->
				<svelte:component
					this={CategoryOverview}
					category={selectedCategory}
					subcategoriesCount={subcategories?.length || 0}
					resourcesCount={resources?.length || 0}
					propCumulativeCounts={dynamicCumulativeCounts}
				/>
				<!-- Progress Tracking -->
				<svelte:component
					this={ProgressCard}
					category={selectedCategory}
					allCategories={allCategories || []}
				/>
				<!-- Resources List -->
				<svelte:component this={ResourcesList} resources={resources || []} />
			{:else if StatisticsCard}
				<!-- Global Statistics when no category selected -->
				<svelte:component this={StatisticsCard} statistics={statistics || {}} />
				<div class="bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-2">
						Welcome to Full Stack Developer Roadmap
					</h3>
					<div class="text-center mb-4">
						<span class="text-2xl">🎓</span>
						<p class="text-xs text-gray-500 mt-1">F-Tier (Start Here)</p>
					</div>
					<p class="text-gray-700 leading-relaxed">
						Select a category from the navigation menu to explore learning resources, track your
						progress, and dive deep into full stack development topics.
					</p>
				</div>
			{/if}
		{:else}
			<div class="text-center text-gray-500 py-8">
				<p>Loading components...</p>
			</div>
		{/if}
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
