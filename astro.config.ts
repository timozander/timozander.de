import { defineConfig } from "astro/config"
import remarkToc from "remark-toc"
import remarkCollapse from "remark-collapse"
import rehypeExternalLinks from "rehype-external-links"
import sitemap from "@astrojs/sitemap"
import UnoCSS from "unocss/astro"
import vue from "@astrojs/vue"
import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
  site: "https://timozander.de/",
  integrations: [
    mdx(),
    UnoCSS({
      injectReset: true,
      injectEntry: true,
    }),
    sitemap({
      filter: (page) => !page.match(/\/blog\/\d+\//),
    }),
    vue(),
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
      theme: "material-theme-ocean",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
})
