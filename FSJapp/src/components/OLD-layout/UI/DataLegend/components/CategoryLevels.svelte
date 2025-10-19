<script>
	import CollapsibleHeader from './CollapsibleHeader.svelte';

	export let isExpanded = false;

	function toggleSection() {
		isExpanded = !isExpanded;
	}

	const categoryLevels = [
		{ icon: '📁', level: 'Level 0', color: 'text-blue-700', description: 'Main Categories' },
		{ icon: '📂', level: 'Level 1', color: 'text-green-600', description: 'Sub Categories' },
		{ icon: '🗂️', level: 'Level 2', color: 'text-purple-600', description: 'Specific Topics' },
		{ icon: '📝', level: 'Level 3+', color: 'text-pink-600', description: 'Leaf Categories' }
	];
</script>

<div class="mb-4">
	<CollapsibleHeader title="Category Levels" icon="📁" {isExpanded} onToggle={toggleSection} />

	{#if isExpanded}
		<div class="space-y-2 mt-3">
			{#each categoryLevels as level}
				<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
					<span class="text-lg">{level.icon}</span>
					<div>
						<span class="text-sm font-medium {level.color}">{level.level}</span>
						<p class="text-xs text-gray-500">{level.description}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
