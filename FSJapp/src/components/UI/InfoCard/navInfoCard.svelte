<script>
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';

	$: selectedCategory = $navigationContext?.selectedCategory;
	$: selectedTask = $navigationContext?.selectedTask;
	$: tasksInCategory = selectedCategory
		? $navigationContext?.topicsByCategory[selectedCategory.id] || []
		: [];

	function getDifficultyColor(level) {
		const colors = {
			Advanced: 'text-purple-600 bg-purple-50',
			Intermediate: 'text-orange-600 bg-orange-50',
			Beginner: 'text-green-600 bg-green-50'
		};
		return colors[level] || 'text-gray-600 bg-gray-50';
	}

	function getDifficultyIcon(level) {
		const icons = {
			Advanced: '💎',
			Intermediate: '⚡',
			Beginner: '🌱'
		};
		return icons[level] || '🎯';
	}

	function getStatusColor(status) {
		const colors = {
			completed: 'text-green-600 bg-green-50',
			in_progress: 'text-blue-600 bg-blue-50',
			not_started: 'text-gray-600 bg-gray-50'
		};
		return colors[status] || 'text-gray-600 bg-gray-50';
	}

	function getTaskTypeIcon(type) {
		const icons = {
			Theory: '📚',
			Practical: '🔧',
			Framework: '⚡',
			Setup: '⚙️'
		};
		return icons[type] || '📄';
	}
</script>

<div class="h-full rounded-lg bg-white shadow-sm border overflow-y-auto">
	{#if selectedTask}
		<div class="p-6">
			<div class="mb-4">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-2xl">{getTaskTypeIcon(selectedTask.task_type)}</span>
					<h2 class="text-xl font-semibold text-gray-900">
						{selectedTask.task_name || selectedTask.name}
					</h2>
				</div>
				<p class="text-sm text-gray-500">Task Details</p>
			</div>

			<dl class="grid grid-cols-2 gap-4 mb-6">
				<div>
					<dt class="text-sm font-medium text-gray-500">Task Type</dt>
					<dd class="mt-1 text-sm text-gray-900">{selectedTask.task_type}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Difficulty</dt>
					<dd class="mt-1">
						<span
							class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full {getDifficultyColor(
								selectedTask.difficulty_level
							)}"
						>
							<span>{getDifficultyIcon(selectedTask.difficulty_level)}</span>
							{selectedTask.difficulty_level}
						</span>
					</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Status</dt>
					<dd class="mt-1">
						<span
							class="inline-flex px-2 py-1 text-xs font-medium rounded-full {getStatusColor(
								selectedTask.status
							)}"
						>
							{selectedTask.status.replace('_', ' ').toUpperCase()}
						</span>
					</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Estimated Hours</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{selectedTask.estimated_hours ? `${selectedTask.estimated_hours}h` : 'Not specified'}
					</dd>
				</div>
			</dl>

			{#if selectedTask.prerequisites}
				<div class="mb-4">
					<dt class="text-sm font-medium text-gray-500 mb-2">Prerequisites</dt>
					<dd class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
						{selectedTask.prerequisites}
					</dd>
				</div>
			{/if}

			{#if selectedTask.resources?.length > 0}
				<div class="mt-6">
					<h3 class="text-sm font-medium text-gray-500 mb-3">
						Resources ({selectedTask.resources.length})
					</h3>
					<div class="space-y-2">
						{#each selectedTask.resources as resource}
							<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<span class="text-sm font-medium text-gray-900">{resource.resource_name}</span>
										{#if resource.is_free}
											<span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">FREE</span
											>
										{/if}
									</div>
									<p class="text-xs text-gray-500">{resource.resource_type}</p>
								</div>
								{#if resource.rating}
									<div class="text-xs text-yellow-600">★ {resource.rating}</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else if selectedCategory}
		<div class="p-6">
			<div class="mb-4">
				<div class="flex items-center gap-2 mb-2">
					<span class="text-2xl">📁</span>
					<h2 class="text-xl font-semibold text-gray-900">{selectedCategory.name}</h2>
				</div>
				<p class="text-sm text-gray-500">Category Overview</p>
			</div>

			<dl class="grid grid-cols-2 gap-4 mb-6">
				<div>
					<dt class="text-sm font-medium text-gray-500">Level</dt>
					<dd class="mt-1 text-sm text-gray-900">Level {selectedCategory.level}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Tasks</dt>
					<dd class="mt-1 text-sm text-gray-900">{tasksInCategory.length} tasks</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Created</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{selectedCategory.created_at
							? new Date(selectedCategory.created_at).toLocaleDateString()
							: 'N/A'}
					</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Sub-categories</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{selectedCategory.children?.length || 0} sub-categories
					</dd>
				</div>
			</dl>

			{#if selectedCategory.description}
				<div class="mb-6">
					<dt class="text-sm font-medium text-gray-500 mb-2">Description</dt>
					<dd class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
						{selectedCategory.description}
					</dd>
				</div>
			{/if}

			{#if tasksInCategory.length > 0}
				<div class="mt-6">
					<h3 class="text-sm font-medium text-gray-500 mb-3">Tasks in this Category</h3>
					<div class="space-y-2 max-h-48 overflow-y-auto">
						{#each tasksInCategory as task}
							<div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
								<div class="flex items-center gap-2">
									<span>{getTaskTypeIcon(task.task_type)}</span>
									<span class="text-sm font-medium text-gray-900">
										{task.task_name || task.name}
									</span>
								</div>
								<div class="flex items-center gap-2">
									<span
										class="inline-flex items-center gap-1 text-xs {getDifficultyColor(
											task.difficulty_level
										)} px-2 py-1 rounded"
									>
										<span>{getDifficultyIcon(task.difficulty_level)}</span>
										{task.difficulty_level}
									</span>
									{#if task.estimated_hours}
										<span class="text-xs text-gray-500">{task.estimated_hours}h</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="p-6 flex flex-col items-center justify-center h-full text-center">
			<div class="mb-4">
				<span class="text-6xl">🗺️</span>
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2">Welcome to Your Roadmap</h2>
			<p class="text-sm text-gray-500 mb-4">
				Select a category or task from the navigation to view detailed information here.
			</p>

			<div class="grid grid-cols-3 gap-4 w-full max-w-md">
				<div class="text-center">
					<div class="text-2xl mb-1">📚</div>
					<p class="text-xs text-gray-600">Theory</p>
				</div>
				<div class="text-center">
					<div class="text-2xl mb-1">🔧</div>
					<p class="text-xs text-gray-600">Practical</p>
				</div>
				<div class="text-center">
					<div class="text-2xl mb-1">⚡</div>
					<p class="text-xs text-gray-600">Framework</p>
				</div>
			</div>
		</div>
	{/if}
</div>
