<script>
	import DataLegend from '../components/UI/DataLegend/dataLegend.svelte';
	import InfoCard from '../components/UI/InfoCard/navInfoCard.svelte';
	import SideNav from '../components/Navigation/SideNav/sideNav.svelte';
	import ProgressBar from '../components/UI/ProgressBar.svelte';
	import TitleHeader from '../components/Layout/Header/titleHeader.svelte';
	import Footer from '../components/Layout/Footer/footer.svelte';

	export let data;
</script>

<div class="min-h-screen flex flex-col">
	<div class="grid grid-cols-3 gap-2 p-2">
		<TitleHeader />
		<div
			class="h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
		>
			<ProgressBar />
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-2 p-1 flex-1 min-h-0">
		<SideNav sideNavData={data.sideNavData} />
		<InfoCard />
		<DataLegend />
	</div>
	<Footer />
</div>
