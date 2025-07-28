<script>
	import DataLegend from '../components/MainBody/DataLegend/dataLegend.svelte';
	import NavInfoCard from '../components/MainBody/NavInfoCard/navInfoCard.svelte';
	import SideNav from '../components/MainBody/SideNav/sideNav.svelte';
	import ProgressBar from '../components/Misc/progressBar.svelte';
	import TitleHeader from '../components/TopNav/HeaderTitle/titleHeader.svelte';
	import Account from '../components/TopNav/UserProfile/account.svelte';
	import Settings from '../components/TopNav/UserProfile/settings.svelte';

	export let data;
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

	<div class="grid grid-cols-4 gap-2 p-2 h-[80vh]">
		<SideNav sideNavData={data.sideNavData} />
		<NavInfoCard />
		<DataLegend />
	</div>
</div>
