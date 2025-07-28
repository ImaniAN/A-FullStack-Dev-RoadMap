<script>
	import { navigationContext } from '$lib/stores/breadcrumbStore.js';

	export let label = 'Roadmap Progress';
	export let showPercentage = true;
	export let color = 'blue';

	let depthPercentage = 0;

	const colorClasses = {
		blue: 'from-blue-500 to-blue-600',
		green: 'from-green-500 to-green-600',
		purple: 'from-purple-500 to-purple-600',
		orange: 'from-orange-500 to-orange-600'
	};

	function getTotalItems(categories) {
		let total = 0;
		for (const category of categories) {
			total += 1;
			const tasks = $navigationContext?.topicsByCategory[category.id] || [];
			total += tasks.length;
			if (category.children?.length > 0) {
				total += getTotalItems(category.children);
			}
		}
		return total;
	}

	function getCurrentPosition(selectedCategory, selectedTask, categoryHierarchy) {
		if (!selectedCategory) return 0;

		let position = 0;
		let found = false;

		function traverseCategories(categories) {
			if (found) return;
			for (const category of categories) {
				if (found) return;
				position += 1;

				if (category.id === selectedCategory.id) {
					if (selectedTask) {
						const tasks = $navigationContext?.topicsByCategory[category.id] || [];
						const taskIndex = tasks.findIndex((task) => task.id === selectedTask.id);
						if (taskIndex !== -1) {
							position += taskIndex + 1;
						}
					}
					found = true;
					return;
				}

				const tasks = $navigationContext?.topicsByCategory[category.id] || [];
				position += tasks.length;

				if (category.children?.length > 0) {
					traverseCategories(category.children);
				}
			}
		}

		traverseCategories(categoryHierarchy);
		return position;
	}

	$: if ($navigationContext) {
		const totalItems = getTotalItems($navigationContext.categoryHierarchy);
		const currentPosition = getCurrentPosition(
			$navigationContext.selectedCategory,
			$navigationContext.selectedTask,
			$navigationContext.categoryHierarchy
		);
		depthPercentage = totalItems > 0 ? Math.round((currentPosition / totalItems) * 100) : 0;
	}

	$: depthPercentage = Math.min(Math.max(depthPercentage, 0), 100);

	function getProgressMessage(percentage) {
		if (percentage === 0) return 'Begin your learning journey';
		if (percentage < 25) return 'Just getting started';
		if (percentage < 50) return 'Making good progress';
		if (percentage < 75) return 'Well on your way';
		if (percentage < 100) return 'Almost there!';
		return 'Journey complete!';
	}
</script>

<div class="h-full rounded-lg p-4 flex flex-col justify-center items-center space-y-3 bg-white/50">
	<h3 class="text-lg font-semibold text-gray-800 text-center">{label}</h3>

	<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
		<div
			class="h-full rounded-full transition-all duration-700 ease-out shadow-sm bg-gradient-to-r {colorClasses[
				color
			]}"
			style="width: {depthPercentage}%"
			title="Current position: {depthPercentage}% through the roadmap journey"
		>
			{#if depthPercentage > 0}
				<div
					class="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
				/>
			{/if}
		</div>
	</div>

	{#if showPercentage}
		<div class="flex items-center justify-between w-full text-sm">
			<span class="text-gray-600">Journey Progress</span>
			<span class="text-xl font-bold text-gray-900" title="Progress: {depthPercentage}%">
				{depthPercentage}%
			</span>
		</div>
	{/if}

	<div class="text-xs text-gray-500 text-center">
		{getProgressMessage(depthPercentage)}
	</div>
</div>
