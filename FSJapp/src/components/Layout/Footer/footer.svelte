<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const yearElement = document.getElementById('current-year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear().toString();
		}
	});
</script>

<footer class="m-2 mt-auto">
	<div
		class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50"
	>
		<div class="px-6 py-8">
			<div class="flex flex-col lg:flex-row justify-between items-center gap-6">
				<!-- Brand & Info -->
				<div class="flex flex-col items-center lg:items-start text-center lg:text-left">
					<div class="flex items-center gap-3 mb-3">
						<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<span class="text-xl font-bold text-white">🗺️</span>
						</div>
						<div>
							<h3 class="text-lg font-semibold text-white">FullStack RoadMap</h3>
							<p class="text-sm text-slate-300">Your development journey</p>
						</div>
					</div>
					<p class="text-sm text-slate-400 max-w-md">
						A comprehensive guide to becoming a full-stack developer.
					</p>
				</div>

				<!-- Social Links -->
				<div class="flex flex-col items-center lg:items-end gap-4">
					<h4 class="text-sm font-medium text-slate-300 uppercase tracking-wider">Connect</h4>
					<div class="flex items-center gap-3">
						<a
							href="https://github.com/ImaniAN"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300"
						>
							<svg
								class="w-5 h-5 text-slate-400 group-hover:text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							<span class="text-sm font-medium text-slate-300 group-hover:text-white">Profile</span>
						</a>

						<a
							href="https://github.com/ImaniAN/A-FullStack-Dev-RoadMap"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-300"
						>
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
								/>
							</svg>
							<span class="text-sm font-medium text-white">Source</span>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-slate-700/50 px-6 py-4 bg-slate-800/50 rounded-b-xl">
			<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
				<div class="flex items-center gap-2 text-sm text-slate-400">
					<span>© <span id="current-year" /> ImaniAN</span>
					<span class="hidden sm:inline">•</span>
					<span class="text-xs">Built with 💙 for developers</span>
				</div>

				<div class="flex items-center gap-4 text-xs text-slate-500">
					<a
						href="https://github.com/ImaniAN/A-FullStack-Dev-RoadMap/blob/master/LICENSE"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-slate-300 transition-colors duration-200"
					>
						MIT License
					</a>
					<span>•</span>
					<span>v1.0.0</span>
				</div>
			</div>
		</div>
	</div>
</footer>
