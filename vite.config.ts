import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Automatically determine base path for GitHub Pages or custom domains
function getBasePath(): string {
  // 1. Explicit override via environment variable
  const explicitBase = process.env.BASE_PATH || process.env.VITE_BASE_PATH;
  if (explicitBase) {
    if (explicitBase === './') return './';
    return explicitBase.endsWith('/') ? explicitBase : `${explicitBase}/`;
  }

  // 2. Automated detection in GitHub Actions
  const githubRepo = process.env.GITHUB_REPOSITORY;
  if (githubRepo) {
    const [, repoName] = githubRepo.split('/');
    if (repoName) {
      // User or organization site: e.g. username.github.io
      if (repoName.toLowerCase().endsWith('.github.io')) {
        return '/';
      }
      // Project repository site: e.g. /nedian-connect-institute/
      return `/${repoName}/`;
    }
  }

  // 3. Fallback for static branch deployment (docs/) or relative hosting
  return './';
}

export default defineConfig(() => {
  const base = getBasePath();

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
