import { defineConfig } from "astro/config";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeExternalLinks from "rehype-external-links";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
import vue from "@astrojs/vue";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://timozander.de/",
  integrations: [
    mdx(),
    UnoCSS(),
    sitemap({
      filter: page => !page.match(/\/blog\/\d+\//),
    }),
    vue(),
    compress({
      css: true,
      html: false,
    }),
  ],
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
