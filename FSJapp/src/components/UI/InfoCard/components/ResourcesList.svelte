<script>
	export let resources = [];
	export let showTitle = true;

	// Group resources by type
	$: resourcesByType = resources.reduce((acc, resource) => {
		const type = resource.type || resource.resource_type || 'other';
		if (!acc[type]) acc[type] = [];
		acc[type].push(resource);
		return acc;
	}, {});

	// Get icon for resource type
	function getResourceIcon(type) {
		const icons = {
			documentation: '📚',
			tutorial: '🎓',
			video: '🎥',
			article: '📄',
			tool: '🔧',
			book: '📖',
			course: '🎯',
			practice: '💪',
			other: '🔗'
		};
		return icons[type] || icons.other;
	}

	// Get color for resource type
	function getResourceColor(type) {
		const colors = {
			documentation: 'text-blue-600 bg-blue-50 border-blue-200',
			tutorial: 'text-green-600 bg-green-50 border-green-200',
			video: 'text-red-600 bg-red-50 border-red-200',
			article: 'text-purple-600 bg-purple-50 border-purple-200',
			tool: 'text-orange-600 bg-orange-50 border-orange-200',
			book: 'text-indigo-600 bg-indigo-50 border-indigo-200',
			course: 'text-yellow-600 bg-yellow-50 border-yellow-200',
			practice: 'text-pink-600 bg-pink-50 border-pink-200',
			other: 'text-gray-600 bg-gray-50 border-gray-200'
		};
		return colors[type] || colors.other;
	}
</script>

{#if resources.length > 0}
	<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
		{#if showTitle}
			<h3 class="text-lg font-semibold text-gray-800 mb-4">Resources ({resources.length})</h3>
		{/if}

		<div class="space-y-4">
			{#each Object.entries(resourcesByType) as [type, typeResources]}
				<div class="border-l-4 border-gray-300 pl-4">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-lg">{getResourceIcon(type)}</span>
						<h4 class="text-md font-medium text-gray-700 capitalize">{type}</h4>
						<span class="text-sm text-gray-500">({typeResources.length})</span>
					</div>

					<div class="space-y-2">
						{#each typeResources as resource}
							<div class="group hover:bg-gray-50 rounded-md p-2 transition-colors">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										{#if resource.url || resource.resource_url}
											<a
												href={resource.url || resource.resource_url}
												target="_blank"
												rel="noopener noreferrer"
												class="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
											>
												{resource.title || resource.resource_name}
											</a>
										{:else}
											<span class="font-medium text-sm text-gray-800"
												>{resource.title || resource.resource_name}</span
											>
										{/if}

										{#if resource.description}
											<p class="text-xs text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
										{/if}
									</div>

									<span
										class="ml-2 px-2 py-1 text-xs rounded {getResourceColor(
											resource.type || resource.resource_type || 'other'
										)}"
									>
										{resource.type || resource.resource_type || 'other'}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else if showTitle}
	<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
		<h3 class="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
		<p class="text-gray-500 text-center py-8">No resources available for this category yet.</p>
	</div>
{/if}
