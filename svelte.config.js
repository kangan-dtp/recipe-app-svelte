import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte'],
  preprocess: vitePreprocess(),  // Use vitePreprocess for handling TypeScript and other preprocessing
  kit: {
    adapter: adapter(),  // Auto adapter for deployment
    alias: {
      $lib: path.resolve('./src/lib')  // Alias for importing modules
    }
  }
};

export default config;
