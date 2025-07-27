<script>
	export let data;
</script>

<div class="h-max">
	<div class="grid grid-cols-3 gap-2 p-2">
		<div class="h-full rounded-lg bg-gray-300 col-span-2 flex items-center justify-center">
			<span class="text-gray-600 font-mdium">Main Content</span>
		</div>

		<div class="h-full rounded-lg bg-gray-100 p-1">
			<div class="grid grid-cols-2 gap-2 mb-1 h-3/4">
				<div class="h-full rounded bg-gray-300 flex items-center justify-center">
					<span class="text-xs text-gray-600">Account</span>
				</div>
				<div class="h-full rounded bg-gray-300 flex items-center justify-center">
					<span class="text-xs text-gray-600">Settings</span>
				</div>
			</div>

			<!-- Progress Bar -->
			<div class=" h-1/6 rounded bg-gray-300 flex items-center justify-center">
				<span class="text-xs text-gray-600">Progress</span>
			</div>
		</div>
	</div>

	<!-- Navigation Section -->
	<div class="grid grid-cols-4 gap-2 p-2 h-72">
		<div class="h-full rounded-lg bg-gray-300 flex items-center justify-center">
			<span class="text-gray-600 font-medium">Left Nav</span>
		</div>
		<div class="h-full rounded-lg bg-gray-300 col-span-2 flex items-center justify-center">
			<span class="text-gray-600 font-medium">Navigation Cards</span>
		</div>
		<div class="h-full rounded-lg bg-gray-300 flex items-center justify-center">
			<span class="text-gray-600 font-medium text-center">Data Legend</span>
		</div>
	</div>

	<!-- Footer Section -->
	<div class="p-2">
		<div class="h-full rounded-lg bg-gray-300 flex items-center justify-center">
			<span class="text-gray-600 font-medium">Footer Content</span>
		</div>
	</div>
</div>
