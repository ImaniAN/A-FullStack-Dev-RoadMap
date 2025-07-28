<script>
	import CollapsibleHeader from './CollapsibleHeader.svelte';

	export let totalCategories = 0;
	export let totalTasks = 0;
	export let isExpanded = false;

	function toggleSection() {
		isExpanded = !isExpanded;
	}

	const statistics = [
		{
			label: 'Total Categories',
			value: totalCategories,
			color: 'text-blue-700',
			bgColor: 'bg-blue-50'
		},
		{ label: 'Total Tasks', value: totalTasks, color: 'text-green-700', bgColor: 'bg-green-50' }
	];
</script>

<div class="mb-4">
	<CollapsibleHeader title="Statistics" icon="📈" {isExpanded} onToggle={toggleSection} />

	{#if isExpanded}
		<div class="space-y-2 mt-3">
			{#each statistics as stat}
				<div class="flex justify-between items-center p-2 {stat.bgColor} rounded-lg">
					<span class="text-sm {stat.color}">{stat.label}</span>
					<span class="font-medium text-gray-900">{stat.value}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
