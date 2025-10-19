<script>
	export let category;
	export let depth = 0;
	export let expandedCategories;
	export let topicsByCategory;
	export let toggleCategory;
	export let handleTaskClick;
	export let getCategoryIcon;
	export let getLevelColor;
	export let getStatusColor;
	export let getDifficultyIcon;

	function getDynamicIndentPx(depth) {
		return depth * 16;
	}

	function getDynamicBorder(depth) {
		const colors = [
			'border-blue-100',
			'border-green-100',
			'border-purple-100',
			'border-orange-100',
			'border-pink-100',
			'border-indigo-100',
			'border-teal-100',
			'border-gray-100'
		];
		return colors[Math.min(depth, colors.length - 1)] || 'border-gray-50';
	}

	function getDynamicPadding(depth) {
		return depth === 0 ? 'p-2' : depth <= 2 ? 'p-2' : 'p-1';
	}

	function getDynamicTextSize(depth) {
		return depth === 0 ? 'text-sm' : 'text-xs';
	}
</script>

<div class="border-l-2 {getDynamicBorder(depth)}">
	<button
		class="w-full text-left {getDynamicPadding(
			depth
		)} hover:bg-gray-50 rounded-r-lg transition-colors flex items-center justify-between group {getDynamicTextSize(
			depth
		)}"
		style="padding-left: {getDynamicIndentPx(depth) + 8}px"
		on:click={() => toggleCategory(category.id)}
	>
		<div class="flex items-center gap-2">
			<span>{getCategoryIcon(category)}</span>
			<span class={getLevelColor(category.level)}>{category.name}</span>
			<span class="text-xs text-gray-400">L{category.level}</span>
		</div>
		<span class="text-gray-400 text-xs">
			{expandedCategories.has(category.id) ? '▲' : '▼'}
		</span>
	</button>

	{#if expandedCategories.has(category.id)}
		{#if topicsByCategory[category.id]}
			<div class="mt-1 space-y-1" style="padding-left: {getDynamicIndentPx(depth + 1)}px">
				{#each topicsByCategory[category.id] as task}
					<button
						class="w-full text-left {getDynamicPadding(
							depth + 1
						)} text-xs hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-200"
						on:click={() => handleTaskClick(task)}
					>
						<div class="flex items-center gap-2">
							<span class="text-blue-400">↳</span>
							<span class={getStatusColor(task.status)}>
								{task.task_name || task.name}
							</span>
							<span title="Difficulty">{getDifficultyIcon(task.difficulty_level)}</span>
							{#if task.estimated_hours}
								<span class="text-gray-400 ml-auto text-xs">
									{task.estimated_hours}h
								</span>
							{/if}
						</div>

						{#if task.task_type}
							<div class="ml-4 mt-1">
								<span class="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
									{task.task_type}
								</span>
								{#if task.resources?.length > 0}
									<span class="text-xs text-blue-500 ml-2">
										{task.resources.length} resource{task.resources.length !== 1 ? 's' : ''}
									</span>
								{/if}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		{#if category.children?.length > 0}
			<div class="mt-1" style="padding-left: {getDynamicIndentPx(depth + 1)}px">
				{#each category.children as childCategory}
					<svelte:self
						category={childCategory}
						depth={depth + 1}
						{expandedCategories}
						{topicsByCategory}
						{toggleCategory}
						{handleTaskClick}
						{getCategoryIcon}
						{getLevelColor}
						{getStatusColor}
						{getDifficultyIcon}
					/>
				{/each}
			</div>
		{/if}
	{/if}
</div>
