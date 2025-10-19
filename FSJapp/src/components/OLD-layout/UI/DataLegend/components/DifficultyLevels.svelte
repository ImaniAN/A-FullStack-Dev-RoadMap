<script>
	import CollapsibleHeader from './CollapsibleHeader.svelte';
	import { DIFFICULTY_SYSTEM } from '../../InfoCard/utils/difficultySystem.js';

	export let isExpanded = false;

	function toggleSection() {
		isExpanded = !isExpanded;
	}

	// Convert DIFFICULTY_SYSTEM to array format for display
	$: difficultyLevels = Object.entries(DIFFICULTY_SYSTEM)
		.map(([tier, config]) => ({
			tier,
			level: `${tier}-Tier`,
			color: config.color.split(' ')[0], // Extract just the text color
			bgColor: config.color.split(' ')[1], // Extract background color
			borderColor: config.color.split(' ')[2], // Extract border color
			icon: config.icon,
			description: config.description,
			sortLevel: config.level
		}))
		.sort((a, b) => a.sortLevel - b.sortLevel); // Show F-S order (F at top, easiest first)
</script>

<div class="mb-4">
	<CollapsibleHeader title="Tiers" icon="🎯" {isExpanded} onToggle={toggleSection} />

	{#if isExpanded}
		<div class="mt-3">
			<!-- Tier Scale Overview -->
			<div class="mb-3 p-3 bg-gray-50 rounded-lg">
				<h4 class="text-xs font-semibold text-gray-700 mb-2">Complete Tier Scale:</h4>
				<div class="flex justify-between items-center gap-1">
					{#each difficultyLevels as tier}
						<div class="flex flex-col items-center">
							<div
								class="w-8 h-8 flex items-center justify-center rounded border-2 {tier.borderColor} {tier.bgColor} font-mono text-xs font-bold {tier.color}"
							>
								{tier.tier}
							</div>
							<span class="text-xs text-gray-600 mt-1">{tier.tier}</span>
						</div>
					{/each}
				</div>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>Easiest</span>
					<span>Hardest</span>
				</div>
			</div>

			<!-- Detailed Explanations -->
			<div class="space-y-2">
				<h4 class="text-xs font-semibold text-gray-700">All Tiers:</h4>
				{#each difficultyLevels as difficulty}
					<div class="flex items-center gap-3 p-2 {difficulty.bgColor} rounded-lg">
						<span class="text-lg">{difficulty.icon}</span>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium {difficulty.color}">{difficulty.tier}-Tier</span>
								<span class="text-xs text-gray-500">(Level {difficulty.sortLevel})</span>
							</div>
							<p class="text-sm text-gray-700">{difficulty.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
