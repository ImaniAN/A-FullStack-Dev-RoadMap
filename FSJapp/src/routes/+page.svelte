<script>
	import DataLegend from '../components/MainBody/DataLegend/dataLegend.svelte';
	import NavInfoCard from '../components/MainBody/NavInfoCard/navInfoCard.svelte';
	import SideNav from '../components/MainBody/SideNav/sideNav.svelte';
	import ProgressBar from '../components/Misc/progressBar.svelte';
	import TitleHeader from '../components/TopNav/HeaderTitle/titleHeader.svelte';
	import Footer from '../components/Footer/footer.svelte';

	export let data;
</script>

<div class="h-max">
	<div class="grid grid-cols-3 gap-2 p-2">
		<TitleHeader />
		<div
			class="h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
		>
			<ProgressBar />
		</div>
	</div>

	<div class="grid grid-cols-4 gap-2 p-2 h-[80vh]">
		<SideNav sideNavData={data.sideNavData} />
		<NavInfoCard />
		<DataLegend />
	</div>

	<!-- Footer Component -->
	<Footer />
</div>
