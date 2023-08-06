import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	return {
		plugins: [vue()],
		base: command === 'serve' ? '' : '/sakai-vue/',
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'@board': fileURLToPath(new URL('./src/components/board', import.meta.url))
			}
		}
	};
});