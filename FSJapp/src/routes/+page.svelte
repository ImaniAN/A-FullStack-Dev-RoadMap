<script>
	import ProgressBar from '../componenets/Misc/progressBar.svelte';
	import TitleHeader from '../componenets/TopNav/HeaderTitle/titleHeader.svelte';
	import Account from '../componenets/TopNav/UserProfile/account.svelte';
	import Settings from '../componenets/TopNav/UserProfile/settings.svelte';
</script>

<div class="h-max">
	<div class="grid grid-cols-3 gap-2 p-2">
		<TitleHeader />

		<div class="h-full rounded-lg bg-gray-100 p-1">
			<div class="grid grid-cols-2 gap-2 mb-1 h-3/4">
				<Account />
				<Settings />
			</div>
			<ProgressBar />
		</div>
	</div>

	<!-- Navigation Section -->
	<div class="grid grid-cols-4 gap-2 p-2 h-72">
		<div class="h-full rounded-lg bg-gray-300 flex items-center justify-center">
			<span class="text-gray-600 font-medium">Left Nav Comp</span>
		</div>
		<div class="h-full rounded-lg bg-gray-300 col-span-2 flex items-center justify-center">
			<span class="text-gray-600 font-medium">Navigation Cards Comp</span>
		</div>
		<div class="h-full rounded-lg bg-gray-300 flex items-center justify-center">
			<span class="text-gray-600 font-medium text-center">Data Legend Comp</span>
		</div>
	</div>
</div>
