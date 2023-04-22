import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeExternalLinks from "rehype-external-links";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: "https://timozander.de/",
  integrations: [UnoCSS(), sitemap(), vue()],
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
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["noreferrer", "noopener"],
          target: "_blank",
        },
      ],
    ],
    shikiConfig: {
      theme: "material-ocean",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
