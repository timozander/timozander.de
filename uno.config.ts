import { SOCIALS } from "./src/config";
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
  safelist: [...SOCIALS.map(i => i.iconName)],
  theme: {
    colors: {
      skin: {
        base: "rgb(var(--color-text-base))",
        fill: "rgb(var(--color-fill))",
        accent: "rgb(var(--color-accent))",
        line: "rgb(var(--color-border))",
      },
      font: {
        base: '"Open Sans", Helvetica, Arial, sans-serif',
        code: "",
      },
      // 'skin-base': 'rgb(var(--color-text-base))',
      // 'skin-accent': 'rgb(var(--color-accent))',
      // 'skin-fill': 'rgb(var(--color-text-base))',
      // 'skin-line': 'rgb(var(--color-border))',
    },
  },
});
