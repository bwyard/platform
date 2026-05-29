import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

const stripTestIds = (): Plugin => ({
  name: 'strip-test-ids',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('.svelte') || process.env.NODE_ENV !== 'production') return;
    return { code: code.replace(/\s+data-testid="[^"]*"/g, ''), map: null };
  },
});

export default defineConfig({
  envDir: '../../',
  plugins: [tailwindcss(), sveltekit(), stripTestIds()],
  server: { port: 3015, strictPort: true },
});
