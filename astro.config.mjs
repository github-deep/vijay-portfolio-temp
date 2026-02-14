import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import rehypeExternalLinks from 'rehype-external-links';
import remarkDirective from 'remark-directive';
import { remarkGallery } from './src/plugins/remark-gallery.mjs';

export default defineConfig({
  integrations: [react()],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
      }],
    ],
    remarkPlugins: [
      remarkDirective,
      remarkGallery,
    ],
  },
});
