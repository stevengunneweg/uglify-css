import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/uglify-css.ts',
			formats: ['es'],
		},
		outDir: 'dist/bin',
		rollupOptions: {
			external: [
				...builtinModules,
				...builtinModules.map((m) => `node:${m}`),
			],
		},
		target: 'node24',
	},
});
