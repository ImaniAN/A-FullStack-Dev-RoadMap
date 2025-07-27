<script lang="ts">
	// Props - will receive depthPercentage from parent component
	export let depthPercentage = 69; // Default to 0%
	export let label = 'Depth'; // Customizable label
	export let showPercentage = true; // Toggle depthPercentage display
	export let color: 'blue' | 'green' | 'purple' | 'orange' = 'blue';

	// TODO: Connect to user activity data
	// TODO: Calculate progress based on completed tasks/sections
	// TODO: Add animation when depthPercentage changes

	// Color variants for different themes
	const colorClasses = {
		blue: 'from-blue-500 to-blue-600',
		green: 'from-green-500 to-green-600',
		purple: 'from-purple-500 to-purple-600',
		orange: 'from-orange-500 to-orange-600'
	};

	// Ensure depthPercentage is between 0 and 100
	$: depthPercentage = Math.min(Math.max(depthPercentage, 0), 100);
</script>

<div class="h-1/6 rounded pb-2 flex items-center justify-center">
	<h3 class="text-sm font-medium text-gray-700">{label}</h3>
	<!-- Depth Bar Container -->
	<div class="w-3/4 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner mx-1">
		<!-- Depth Bar Fill -->
		<div
			class="h-full rounded-full transition-all duration-700 ease-out shadow-sm bg-gradient-to-r {colorClasses[
				color
			]}"
			style="width: {depthPercentage}%"
		>
			<!-- Shine effect -->
			<div
				class="h-full w-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse"
			/>
		</div>
	</div>
	{#if showPercentage}
		<span class="text-sm font-semibold text-gray-900">{depthPercentage}%</span>
	{/if}
</div>
