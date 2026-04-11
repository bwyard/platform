import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Load .env from monorepo root so INTERNAL_API_URL / PUBLIC_API_URL are available
  envDir: '../../',
  plugins: [tailwindcss(), sveltekit()],
});
