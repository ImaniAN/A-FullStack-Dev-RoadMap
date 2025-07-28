<script lang="ts">
	import { navigationContext, cumulativeCounts } from '$lib/stores/breadcrumbStore.js';
	import { getCategoryTierInfo } from '../utils/difficultySystem.js';

	export let category: any;
	export let subcategoriesCount: number = 0;
	export let resourcesCount: number = 0;
	export let propCumulativeCounts: any = {
		totalSubcategories: 0,
		totalResources: 0,
		totalTasks: 0
	};

	// Safe access with proper type checking
	$: navCtx = $navigationContext || {};
	$: topicsByCategory = (navCtx as any).topicsByCategory || {};
	$: categoryTasks = (category?.id && topicsByCategory[category.id]) || [];
	$: tierInfo = getCategoryTierInfo(Array.isArray(categoryTasks) ? categoryTasks : []);

	// Use the most up-to-date cumulative counts from the derived store or props
	$: dynamicCounts = $cumulativeCounts ||
		propCumulativeCounts || { totalSubcategories: 0, totalResources: 0, totalTasks: 0 };

	// Calculate a single combined count for all descendants, tasks, and resources
	$: totalDescendantsAndTasks =
		(dynamicCounts.totalSubcategories || 0) +
		(dynamicCounts.totalTasks || 0) +
		(dynamicCounts.totalResources || 0);

	// Fallback calculation if dynamic counts are not available
	$: fallbackTotal =
		(typeof subcategoriesCount === 'number' && !isNaN(subcategoriesCount)
			? subcategoriesCount
			: 0) + (typeof resourcesCount === 'number' && !isNaN(resourcesCount) ? resourcesCount : 0);

	// Use the dynamic count or fallback
	$: finalDescendantsTasksCount =
		totalDescendantsAndTasks > 0 ? totalDescendantsAndTasks : fallbackTotal;
</script>

{#if category && category.name}
	<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
		<!-- Header with category name -->
		<div class="flex items-start justify-between mb-4">
			<div class="flex-1">
				<h2 class="text-2xl font-bold text-gray-800 mb-2">{category.name}</h2>
				{#if category.description}
					<p class="text-gray-600 leading-relaxed mb-4">{category.description}</p>
				{/if}
			</div>
		</div>

		<!-- Tier Information Section -->
		{#if categoryTasks.length > 0 && tierInfo}
			<div
				class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-100"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						{#if tierInfo.icon}
							<span class="text-3xl">{tierInfo.icon}</span>
						{/if}
						<div>
							<h3 class="text-lg font-semibold text-gray-800">Difficulty Tier</h3>
							{#if tierInfo.tier}
								<span
									class="inline-block px-3 py-1 text-sm font-medium rounded-full {tierInfo.color ||
										'bg-gray-100 text-gray-600'}"
								>
									{tierInfo.tier} Tier
								</span>
							{/if}
						</div>
					</div>
					{#if tierInfo.description}
						<div class="text-sm text-gray-600 max-w-xs">
							{tierInfo.description}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Cumulative Statistics - Single Combined Count -->
		<div class="pt-4 border-t border-gray-100">
			<div
				class="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100"
			>
				<div class="text-4xl font-bold text-indigo-600 mb-2">{finalDescendantsTasksCount}</div>
				<div class="text-lg font-semibold text-gray-800 mb-1">Total topics/tasks</div>
			</div>
		</div>
	</div>
{/if}
