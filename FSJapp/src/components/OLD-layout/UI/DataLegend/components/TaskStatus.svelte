<script>
	import CollapsibleHeader from './CollapsibleHeader.svelte';

	export let isExpanded = false;

	function toggleSection() {
		isExpanded = !isExpanded;
	}

	const statusTypes = [
		{
			color: 'bg-green-600',
			label: 'Completed',
			textColor: 'text-green-700',
			bgColor: 'bg-green-50'
		},
		{
			color: 'bg-yellow-600',
			label: 'In Progress',
			textColor: 'text-yellow-700',
			bgColor: 'bg-yellow-50'
		},
		{
			color: 'bg-gray-400',
			label: 'Not Started',
			textColor: 'text-gray-700',
			bgColor: 'bg-gray-50'
		}
	];
</script>

<div class="mb-4">
	<CollapsibleHeader title="Status Colors" icon="📊" {isExpanded} onToggle={toggleSection} />

	{#if isExpanded}
		<div class="space-y-2 mt-3">
			{#each statusTypes as status}
				<div class="flex items-center gap-3 p-2 {status.bgColor} rounded-lg">
					<span class="w-3 h-3 {status.color} rounded-full" />
					<span class="text-sm {status.textColor}">{status.label}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
