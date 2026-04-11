import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '@breeyard/shared': '../../packages/core/shared/src/index.ts',
      '@breeyard/auth': '../../packages/core/auth/src/index.ts',
      '@breeyard/theme': '../../packages/core/theme/src/index.ts',
      '@breeyard/ui': '../../packages/core/ui/src/index.ts',
    },
  },
};

export default config;
