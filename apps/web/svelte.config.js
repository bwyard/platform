import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** @param {string} rel */
const pkg = (rel) => path.resolve(__dirname, `../../packages/${rel}/src/index.ts`);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib',
      '$lib/*': './src/lib/*',
      '@breeyard/shared': pkg('core/shared'),
      '@breeyard/auth': pkg('core/auth'),
      '@breeyard/seo': pkg('core/seo'),
      '@breeyard/theme': pkg('core/theme'),
      '@breeyard/ui': pkg('core/ui'),
    },
  },
};

export default config;
