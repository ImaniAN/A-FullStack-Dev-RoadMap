<script lang="ts">
	import { DIFFICULTY_SYSTEM } from '../utils/difficultySystem.js';

	export let statistics: {
		averageDifficulty?: number;
		maxDepth?: number;
		difficultyDistribution?: Record<string, number>;
	} = {};

	// Safe extraction with proper defaults and validation
	$: averageDifficulty =
		typeof statistics?.averageDifficulty === 'number' && !isNaN(statistics.averageDifficulty)
			? statistics.averageDifficulty
			: 1;

	$: maxDepth =
		typeof statistics?.maxDepth === 'number' && !isNaN(statistics.maxDepth)
			? statistics.maxDepth
			: 0;

	$: difficultyDistribution =
		statistics?.difficultyDistribution && typeof statistics.difficultyDistribution === 'object'
			? statistics.difficultyDistribution
			: {};

	$: totalTierCount = Object.values(difficultyDistribution)
		.filter((count) => typeof count === 'number' && !isNaN(count))
		.reduce((sum, count) => sum + count, 0);

	$: difficultyEntries = Object.entries(DIFFICULTY_SYSTEM)
		.map(([tier, config]) => {
			const count = difficultyDistribution[config.level] || 0;
			const validCount = typeof count === 'number' && !isNaN(count) ? count : 0;
			const percentage = totalTierCount > 0 ? Math.round((validCount / totalTierCount) * 100) : 0;

			return {
				tier,
				...config,
				count: validCount,
				percentage: typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0
			};
		})
		.sort((a, b) => a.level - b.level)
		.filter((entry) => entry.count > 0);
</script>

<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
	<h3 class="text-lg font-semibold text-gray-800 mb-4">Learning Statistics</h3>

	<div class="grid grid-cols-2 gap-4 mb-6">
		<div class="text-center">
			<div class="text-2xl font-bold text-purple-600">{averageDifficulty.toFixed(1)}</div>
			<div class="text-sm text-gray-600">Avg Difficulty</div>
		</div>
		<div class="text-center">
			<div class="text-2xl font-bold text-orange-600">L{maxDepth}</div>
			<div class="text-sm text-gray-600">Max Level</div>
		</div>
	</div>

	{#if difficultyEntries.length > 0}
		<div>
			<h4 class="text-md font-medium text-gray-700 mb-3">Tier Distribution</h4>
			<div class="space-y-2">
				{#each difficultyEntries as { tier, icon, color, count, percentage }}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="text-lg">{icon || '❓'}</span>
							<span class="text-sm font-medium {color?.split(' ')[0] || 'text-gray-600'}"
								>{tier} Tier</span
							>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600">{count}</span>
							<div class="w-16 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-500 h-2 rounded-full" style="width: {percentage}%" />
							</div>
							<span class="text-xs text-gray-500 w-8">{percentage}%</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="text-center text-gray-500 py-4">
			<p class="text-sm">No difficulty data available yet.</p>
		</div>
	{/if}
</div>
