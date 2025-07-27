<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Breadcrumb item type
	interface BreadcrumbItem {
		label: string;
		href: string;
		active?: boolean;
	}

	let breadcrumbs: BreadcrumbItem[] = [];

	// TODO: Connect to actual routing data
	// TODO: Generate breadcrumbs based on current route
	// TODO: Add dynamic breadcrumb generation from route params

	onMount(() => {
		// Mock breadcrumb data - replace with actual route-based logic
		breadcrumbs = [
			{ label: 'Home', href: '/' },
			{ label: 'Frontend', href: '/frontend' },
			{ label: 'React', href: '/frontend/react', active: true }
		];
	});

	// Generate breadcrumbs from current route
	function generateBreadcrumbs(currentPath: string): BreadcrumbItem[] {
		const segments = currentPath.split('/').filter(Boolean);
		const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

		let path = '';
		segments.forEach((segment, index) => {
			path += `/${segment}`;
			const isLast = index === segments.length - 1;

			items.push({
				label: segment.charAt(0).toUpperCase() + segment.slice(1),
				href: path,
				active: isLast
			});
		});

		return items;
	}

	// React to route changes
	$: if ($page?.url?.pathname) {
		breadcrumbs = generateBreadcrumbs($page.url.pathname);
	}
</script>

<nav aria-label="Breadcrumb" class="flex items-center">
	<ol class="flex items-center gap-1 text-sm text-gray-600">
		{#each breadcrumbs as crumb, index}
			<li class="flex items-center">
				{#if crumb.active}
					<span class="font-medium text-gray-900">{crumb.label}</span>
				{:else}
					<a href={crumb.href} class="transition-colors hover:text-gray-900 hover:underline">
						{crumb.label}
					</a>
				{/if}
			</li>

			<!-- Separator (don't show after last item) -->
			{#if index < breadcrumbs.length - 1}
				<li class="rtl:rotate-180 mx-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4 text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
