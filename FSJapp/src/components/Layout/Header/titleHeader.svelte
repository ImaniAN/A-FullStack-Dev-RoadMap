<script>
	import Breadcrumb from './breadcrumb.svelte';
</script>

<div
	class="h-full rounded-lg bg-gray-300 col-span-2 flex flex-col justify-center px-6 py-4 shadow-lg border border-gray-400"
>
	<!-- Main Title Section -->
	<div class="flex items-center justify-center mb-3">
		<div class="flex items-center gap-3">
			<h1 class="text-gray-800 font-bold text-xl tracking-wide">Full Stack Development Roadmap</h1>
		</div>
	</div>

	<!-- Breadcrumb Navigation Section -->
	<div class="flex items-center justify-center">
		<div class="bg-gray-200/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-300">
			<Breadcrumb />
		</div>
	</div>
</div>
