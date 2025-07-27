import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: './src/components'
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
