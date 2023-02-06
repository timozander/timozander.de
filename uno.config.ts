import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  shortcuts: [
    { "i-logo": "i-logos-astro w-6em h-6em transform transition-800" },
  ],
  transformers: [transformerDirectives()],
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetTypography({
      cssExtend: {
        a: {
          color: "#f43f5e",
        },
        "a:hover": {
          color: "#14b8a6",
        },
      },
    }),
  ],
  theme: {
    colors: {
      skin: {
        base: "rgb(var(--color-text-base))",
        accent: "rgb(var(--color-accent))",
        line: "rgb(var(--color-border))",
      },
      // 'skin-base': 'rgb(var(--color-text-base))',
      // 'skin-accent': 'rgb(var(--color-accent))',
      // 'skin-fill': 'rgb(var(--color-text-base))',
      // 'skin-line': 'rgb(var(--color-border))',
    },
  },
});
