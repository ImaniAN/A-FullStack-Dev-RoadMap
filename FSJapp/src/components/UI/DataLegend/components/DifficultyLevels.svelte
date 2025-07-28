<script>
	import CollapsibleHeader from './CollapsibleHeader.svelte';

	export let isExpanded = false;

	function toggleSection() {
		isExpanded = !isExpanded;
	}

	const difficultyLevels = [
		{
			tier: 'S',
			level: 'S-Tier',
			color: 'text-purple-700',
			bgColor: 'bg-purple-50',
			borderColor: 'border-purple-300',
			icon: '💎',
			description: 'Deep technical concepts'
		},
		{
			tier: 'A',
			level: 'A-Tier',
			color: 'text-red-700',
			bgColor: 'bg-red-50',
			borderColor: 'border-red-300',
			icon: '🔥',
			description: 'Complex topics'
		},
		{
			tier: 'B',
			level: 'B-Tier',
			color: 'text-orange-700',
			bgColor: 'bg-orange-50',
			borderColor: 'border-orange-300',
			icon: '⚡',
			description: 'Moderate challenge'
		},
		{
			tier: 'C',
			level: 'C-Tier',
			color: 'text-yellow-700',
			bgColor: 'bg-yellow-50',
			borderColor: 'border-yellow-300',
			icon: '🌟',
			description: 'Some experience needed'
		},
		{
			tier: 'D',
			level: 'D-Tier',
			color: 'text-green-700',
			bgColor: 'bg-green-50',
			borderColor: 'border-green-300',
			icon: '🌱',
			description: 'Baby steps level'
		},
		{
			tier: 'E',
			level: 'E-Tier',
			color: 'text-blue-700',
			bgColor: 'bg-blue-50',
			borderColor: 'border-blue-300',
			icon: '🎯',
			description: 'Super simple stuff'
		},
		{
			tier: 'F',
			level: 'F-Tier',
			color: 'text-gray-700',
			bgColor: 'bg-gray-50',
			borderColor: 'border-gray-300',
			icon: '🎓',
			description: 'Hand-holding mode'
		}
	];
</script>

<div class="mb-4">
	<CollapsibleHeader title="Difficulty" icon="🎯" {isExpanded} onToggle={toggleSection} />

	{#if isExpanded}
		<div class="mt-3">
			<!-- Tier Scale Overview -->
			<div class="mb-3 p-3 bg-gray-50 rounded-lg">
				<h4 class="text-xs font-semibold text-gray-700 mb-2">Complete Difficulty Scale:</h4>
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
					<span>Hardest</span>
					<span>Easiest</span>
				</div>
			</div>

			<!-- Detailed Explanations -->
			<div class="space-y-2">
				<h4 class="text-xs font-semibold text-gray-700">Difficulty Levels:</h4>
				{#each difficultyLevels.slice(0, 5) as difficulty}
					<div class="flex items-center gap-3 p-2 {difficulty.bgColor} rounded-lg">
						<span class="text-lg">{difficulty.icon}</span>
						<div class="flex-1">
							<p class="text-sm text-gray-700">{difficulty.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
