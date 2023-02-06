import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
// https://astro.build/config
export default defineConfig({
  site: "https://astro-paper.pages.dev/",
  integrations: [UnoCSS(), sitemap()],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
