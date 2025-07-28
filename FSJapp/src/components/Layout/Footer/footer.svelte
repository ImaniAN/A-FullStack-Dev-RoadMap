<script>
	import { onMount } from 'svelte';

	onMount(() => {
		// Set current year dynamically
		const yearElement = document.getElementById('current-year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear().toString();
		}
	});
</script>

<!-- Modern Footer Section -->
<footer class="m-2 mt-auto">
	<div
		class="bg-gradient-choc-primary rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-sm"
	>
		<!-- Main Footer Content -->
		<div class="px-6 py-8">
			<div class="flex flex-col lg:flex-row justify-between items-center gap-6">
				<!-- Left Side - Brand & Info -->
				<div class="flex flex-col items-center lg:items-start text-center lg:text-left">
					<div class="flex items-center gap-3 mb-3">
						<div
							class="w-10 h-10 bg-gradient-choc-cyber rounded-lg flex items-center justify-center"
						>
							<span class="text-xl font-bold text-white">🗺️</span>
						</div>
						<div>
							<h3 class="text-lg font-semibold text-white">FullStack RoadMap</h3>
							<p class="text-sm text-slate-300">Your development journey</p>
						</div>
					</div>
					<p class="text-sm text-slate-400 max-w-md">
						A comprehensive guide to becoming a full-stack developer. Track your progress, learn
						systematically, and build amazing projects.
					</p>
				</div>

				<!-- Center - Quick Links -->
				<div class="flex flex-col items-center gap-3">
					<h4 class="text-sm font-medium text-slate-300 uppercase tracking-wider">Quick Links</h4>
					<div class="flex flex-wrap justify-center gap-3">
						<button
							class="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs text-slate-300 hover:text-white transition-all duration-200 backdrop-blur"
						>
							📚 Resources
						</button>
						<button
							class="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs text-slate-300 hover:text-white transition-all duration-200 backdrop-blur"
						>
							🎯 Roadmap
						</button>
						<button
							class="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs text-slate-300 hover:text-white transition-all duration-200 backdrop-blur"
						>
							📈 Progress
						</button>
					</div>
				</div>

				<!-- Right Side - Social Links -->
				<div class="flex flex-col items-center lg:items-end gap-4">
					<h4 class="text-sm font-medium text-slate-300 uppercase tracking-wider">Connect</h4>
					<div class="flex items-center gap-3">
						<!-- GitHub Profile Link -->
						<a
							href="https://github.com/ImaniAN"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 backdrop-blur"
						>
							<svg
								class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
							<span
								class="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200"
								>Profile</span
							>
						</a>

						<!-- Project Repository Link -->
						<a
							href="https://github.com/ImaniAN/A-FullStack-Dev-RoadMap"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 px-4 py-2 bg-choc-blue/20 hover:bg-choc-blue/30 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur"
						>
							<svg
								class="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
								/>
							</svg>
							<span
								class="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200"
								>Source</span
							>
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-slate-700/50 px-6 py-4 bg-slate-800/30 rounded-b-xl backdrop-blur">
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
						class="hover:text-slate-300 transition-colors duration-200 flex items-center gap-1"
					>
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clip-rule="evenodd"
							/>
						</svg>
						MIT License
					</a>
					<span>•</span>
					<span>v1.0.0</span>
				</div>
			</div>
		</div>
	</div>
</footer>
