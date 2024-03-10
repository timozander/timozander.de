import { SOCIALS } from "./src/config";
import {
	defineConfig,
	presetIcons,
	presetTypography,
	presetUno,
	transformerDirectives,
} from "unocss";

export default defineConfig({
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
	safelist: [...SOCIALS.map((i) => i.iconName)],
	theme: {
		colors: {
			skin: {
				base: "rgb(var(--color-text-base))",
				muted: "rgb(var(--color-text-muted))",
				fill: "rgb(var(--color-fill))",
				accent: {
					base: "rgb(var(--color-accent))",
					hover: "rgb(var(--color-accent-hover))",
				},
				line: "rgb(var(--color-border))",
			},
			font: {
				base: '"Open Sans", Helvetica, Arial, sans-serif',
				code: "",
			},
		},
	},
});
