<script>
	import CollapsibleHeader from './CollapsibleHeader.svelte';

	export let isExpanded = false;

	function toggleSection() {
		isExpanded = !isExpanded;
	}

	const taskTypes = [
		{ icon: '📚', type: 'Theory' },
		{ icon: '🔧', type: 'Practical' },
		{ icon: '⚡', type: 'Framework' },
		{ icon: '⚙️', type: 'Setup' }
	];
</script>

<div class="mb-4">
	<CollapsibleHeader title="Task Types" icon="📚" {isExpanded} onToggle={toggleSection} />

	{#if isExpanded}
		<div class="space-y-2 mt-3">
			{#each taskTypes as task}
				<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
					<span class="text-lg">{task.icon}</span>
					<span class="text-sm text-gray-700">{task.type}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
