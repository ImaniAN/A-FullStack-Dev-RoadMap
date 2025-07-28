<script>
	export let title;
	export let icon;
	export let isExpanded;
	export let onToggle;
</script>

<button
	class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
	on:click={onToggle}
>
	<h3 class="text-sm font-semibold text-gray-700">{icon} {title}</h3>
	<span class="text-gray-400 text-xs">
		{isExpanded ? '▲' : '▼'}
	</span>
</button>
