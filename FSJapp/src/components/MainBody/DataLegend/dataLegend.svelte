<script>
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';

	$: totalCategories = $navigationContext?.categoryHierarchy?.length || 0;
	$: totalTasks = Object.values($navigationContext?.topicsByCategory || {}).reduce(
		(sum, tasks) => sum + tasks.length,
		0
	);

	// Collapsible sections state - initialize all as collapsed
	let expandedSections = {
		categoryLevels: false,
		taskTypes: false,
		difficultyLevels: false,
		taskStatus: false,
		resourceTypes: false,
		navigation: false,
		statistics: false,
		dataStructure: false
	};

	/**
	 * Toggle section visibility
	 * @param {string} section
	 */
	function toggleSection(section) {
		expandedSections[section] = !expandedSections[section];
	}
</script>

<div class="h-full rounded-lg bg-white shadow-sm border overflow-y-auto">
	<div class="p-4">
		<!-- Header -->
		<div class="mb-4 pb-3 border-b border-gray-200">
			<h2 class="text-lg font-semibold text-gray-900 text-center">Data Legend</h2>
			<p class="text-sm text-gray-500 text-center mt-1">Understanding the roadmap symbols</p>
		</div>

		<!-- Category Levels -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('categoryLevels')}
			>
				<h3 class="text-sm font-semibold text-gray-700">📁 Category Levels</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.categoryLevels ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.categoryLevels}
				<div class="space-y-2 mt-3">
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">📁</span>
						<div>
							<span class="text-sm font-medium text-blue-700">Level 0</span>
							<p class="text-xs text-gray-500">Main Categories (Web Dev, Math, OS, etc.)</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">📂</span>
						<div>
							<span class="text-sm font-medium text-green-600">Level 1</span>
							<p class="text-xs text-gray-500">Sub Categories (HTML, CSS, JavaScript)</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">📄</span>
						<div>
							<span class="text-sm font-medium text-purple-600">Level 2</span>
							<p class="text-xs text-gray-500">Specific Topics (Theory, Forms, Graphics)</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">📝</span>
						<div>
							<span class="text-sm font-medium text-gray-600">Level 3+</span>
							<p class="text-xs text-gray-500">Framework Details (Bootstrap, React)</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Task Types -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('taskTypes')}
			>
				<h3 class="text-sm font-semibold text-gray-700">🎯 Task Types</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.taskTypes ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.taskTypes}
				<div class="grid grid-cols-2 gap-2 mt-3">
					<div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">📚</span>
						<div>
							<span class="text-xs font-medium">Theory</span>
							<p class="text-xs text-gray-500">Conceptual learning</p>
						</div>
					</div>
					<div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">🔧</span>
						<div>
							<span class="text-xs font-medium">Practical</span>
							<p class="text-xs text-gray-500">Hands-on practice</p>
						</div>
					</div>
					<div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">⚡</span>
						<div>
							<span class="text-xs font-medium">Framework</span>
							<p class="text-xs text-gray-500">Library/framework</p>
						</div>
					</div>
					<div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
						<span class="text-lg">⚙️</span>
						<div>
							<span class="text-xs font-medium">Setup</span>
							<p class="text-xs text-gray-500">Environment setup</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Difficulty Levels -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('difficultyLevels')}
			>
				<h3 class="text-sm font-semibold text-gray-700">🎚️ Difficulty Levels</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.difficultyLevels ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.difficultyLevels}
				<div class="space-y-2 mt-3">
					<div class="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
						<span class="text-lg">🟢</span>
						<div>
							<span class="text-sm font-medium text-green-700">Beginner</span>
							<p class="text-xs text-green-600">Basic concepts, entry level</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
						<span class="text-lg">🟡</span>
						<div>
							<span class="text-sm font-medium text-yellow-700">Intermediate</span>
							<p class="text-xs text-yellow-600">Some experience required</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
						<span class="text-lg">🔴</span>
						<div>
							<span class="text-sm font-medium text-red-700">Advanced</span>
							<p class="text-xs text-red-600">Complex, expert level</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Task Status -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('taskStatus')}
			>
				<h3 class="text-sm font-semibold text-gray-700">📊 Task Status</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.taskStatus ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.taskStatus}
				<div class="space-y-2 mt-3">
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<div class="w-3 h-3 bg-gray-400 rounded-full" />
						<div>
							<span class="text-sm font-medium text-gray-700">Not Started</span>
							<p class="text-xs text-gray-500">Ready to begin</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
						<div class="w-3 h-3 bg-blue-500 rounded-full" />
						<div>
							<span class="text-sm font-medium text-blue-700">In Progress</span>
							<p class="text-xs text-blue-600">Currently working on</p>
						</div>
					</div>
					<div class="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
						<div class="w-3 h-3 bg-green-500 rounded-full" />
						<div>
							<span class="text-sm font-medium text-green-700">Completed</span>
							<p class="text-xs text-green-600">Task finished</p>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Resource Types -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('resourceTypes')}
			>
				<h3 class="text-sm font-semibold text-gray-700">📚 Resource Types</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.resourceTypes ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.resourceTypes}
				<div class="grid grid-cols-2 gap-2 text-xs mt-3">
					<div class="p-2 bg-blue-50 rounded">
						<span class="font-medium text-blue-700">Tutorial</span>
						<p class="text-blue-600">Step-by-step guides</p>
					</div>
					<div class="p-2 bg-purple-50 rounded">
						<span class="font-medium text-purple-700">Documentation</span>
						<p class="text-purple-600">Official docs</p>
					</div>
					<div class="p-2 bg-green-50 rounded">
						<span class="font-medium text-green-700">Video</span>
						<p class="text-green-600">Video tutorials</p>
					</div>
					<div class="p-2 bg-orange-50 rounded">
						<span class="font-medium text-orange-700">Tool</span>
						<p class="text-orange-600">Interactive tools</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Navigation Symbols -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('navigation')}
			>
				<h3 class="text-sm font-semibold text-gray-700">🧭 Navigation</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.navigation ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.navigation}
				<div class="space-y-2 text-xs mt-3">
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-blue-400">↳</span>
						<span>Task indicator</span>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span>▼</span>
						<span>Expanded category</span>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span>▲</span>
						<span>Collapsed category</span>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-green-600 bg-green-100 px-2 py-1 rounded">FREE</span>
						<span>Free resource</span>
					</div>
					<div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
						<span class="text-yellow-600">★ 4.5</span>
						<span>Resource rating</span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Statistics -->
		<div class="mb-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('statistics')}
			>
				<h3 class="text-sm font-semibold text-gray-700">📈 Current Stats</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.statistics ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.statistics}
				<div class="grid grid-cols-2 gap-4 mt-3">
					<div class="bg-blue-50 p-3 rounded-lg text-center">
						<div class="text-lg font-bold text-blue-700">{totalCategories}</div>
						<div class="text-xs text-blue-600">Categories</div>
					</div>
					<div class="bg-green-50 p-3 rounded-lg text-center">
						<div class="text-lg font-bold text-green-700">{totalTasks}</div>
						<div class="text-xs text-green-600">Tasks</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Database Structure Info -->
		<div class="border-t pt-4">
			<button
				class="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
				on:click={() => toggleSection('dataStructure')}
			>
				<h3 class="text-sm font-semibold text-gray-700">🗃️ Data Structure</h3>
				<span class="text-gray-400 text-xs">
					{expandedSections.dataStructure ? '▲' : '▼'}
				</span>
			</button>
			{#if expandedSections.dataStructure}
				<div class="space-y-2 text-xs text-gray-600 mt-3">
					<div class="bg-gray-50 p-2 rounded">
						<span class="font-medium">roadmap_categories:</span> Hierarchical learning paths
					</div>
					<div class="bg-gray-50 p-2 rounded">
						<span class="font-medium">roadmap_tasks:</span> Individual learning units
					</div>
					<div class="bg-gray-50 p-2 rounded">
						<span class="font-medium">roadmap_resources:</span> Learning materials & links
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
