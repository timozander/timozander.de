// @ts-check
import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import siteConfig from "./src/site.config";
import rehypeUnwrapImages from "rehype-unwrap-images";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rawFonts } from "./src/plugins/rawFonts";
import { unified } from "@astrojs/markdown-remark";
import remarkCallouts from "./src/plugins/remark-callouts";
import { remarkImageProcessing } from "./src/plugins/remark-image-processing";
import { remarkExternalLinks } from "./src/plugins/remark-external-links.ts";
import { remarkObsidian } from "./src/plugins/remark-obsidian.ts";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  redirects: {
    "/archive": "/posts",
    "/published-elsewhere": "/posts",
    "/projects": "/about",
    "/legal": "/imprint",
    "/blog": "/posts",
    "/blog/[...slug]": "/posts/[...slug]",
    "/talk/enterjs-astro-2023":
      "/posts/astro-back-to-the-future-with-static-websites",
    "/posts/alpinejs": "/posts/alpine-js-the-swiss-army-knife-for-dynamic-uis",
    "/posts/astro-introduction":
      "/posts/creating-blazingly-fast-websites-with-astro",
    "/posts/bun-interview-2022":
      "/posts/framework-bun-faster-than-anyone-would-believe-interview-with-jarred-sumner",
    "/posts/cli-apps-with-ts": "/posts/creating-cli-apps-with-typescript",
    "/posts/gan-ai-generated-images":
      "/posts/art-out-of-the-box-ai-generated-images-with-gans",
    "/posts/senacor-materialized-views":
      "/posts/materialized-views-in-postgres-our-experience-and-insights",
    "/posts/tailwindcss-jit":
      "/posts/into-the-future-tailwindcss-presents-its-new-just-in-time-compiler",
    "/posts/typescript-compiler":
      "/posts/from-design-to-api-understanding-and-working-with-the-typescript-compiler",
    "/posts/vitejs-2021":
      "/posts/vite-js-blazing-fast-build-tool-by-the-vue-js-foundry",
    "/posts/vuejs-compiler-virtualdom":
      "/posts/speeding-up-the-virtual-dom-with-vue-js",
    "/posts/wad-2022":
      "/posts/in-the-dawn-of-the-ai-understanding-and-implementing-ai-generated-images",
    "/posts/talks/enterjs-astro-2023":
      "/posts/astro-back-to-the-future-with-static-websites",
    "/posts/tips-for-speaking-at-conferences":
      "/posts/5-tips-for-speaking-at-conferences-as-a-regular-person",
    "/posts/using-pulumi-with-hcloud":
      "/posts/managing-infrastructure-on-hetzner-cloud-using-pulumi",
    "/posts/why-you-should-teach":
      "/posts/why-you-should-teach-at-a-community-college",
  },

  image: {
    responsiveStyles: true,
  },

  experimental: {
    contentIntellisense: true,
    svgOptimizer: svgoOptimizer(),
  },

  fonts: [
    {
      name: "Manrope",
      cssVariable: "--font-lipi-sans",
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["sans-serif"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Literata",
      cssVariable: "--font-lipi-serif",
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Fira Code",
      cssVariable: "--font-lipi-mono",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["monospace"],
      formats: ["woff", "ttf"],
    },
    {
      name: "Caveat",
      cssVariable: "--font-lipi-hand",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      fallbacks: ["serif"],
      formats: ["woff", "ttf"],
    },
  ],

  vite: {
    // server: {
    //   watch: {
    //     ignored: ['**/.obsidian/**', '**/_bases/**', '**/bases/**', '**/_home/**', '**/home/**', '**/_base/**', '**/base/**']
    //   }
    // },
    // assetsInclude: ['**/*.base', '**/.obsidian/**', '**/_bases/**'],
    build: {
      // Per-page CSS splitting. Caches better than one giant bundle for
      // return visitors who navigate between pages.
      cssCodeSplit: true,
      // Use Vite's default minifier.
    },
    css: {
      transformer: "lightningcss",
      lightningcss: {
        // Modern targets — drops legacy prefixes.
        targets: {
          chrome: 110 << 16,
          firefox: 115 << 16,
          safari: 16 << 16,
        },
      },
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    plugins: [tailwindcss(), rawFonts([".ttf", ".otf"])],
  },

  integrations: [mdx(), sitemap()],

  build: {
    // Inline small stylesheets into the HTML (~4KB threshold), keep larger
    // ones as separate files so they're cacheable across pages.
    inlineStylesheets: "auto",
    assets: "_astro",
  },

  markdown: {
    processor: unified({
      gfm: true,
      smartypants: true,
      remarkPlugins: [
        // remarkObsidianCore,
        // remarkGfm,
        remarkObsidian,
        remarkExternalLinks,
        remarkImageProcessing,
        remarkCallouts,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeUnwrapImages,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["heading-anchor"],
              ariaLabel: "Copy heading link",
            },
            content: {
              type: "text",
              value: "↗",
            },
          },
        ],
      ],
    }),
  },
});
