import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const POSTS_PATH = "src/content/posts/";
export const PAGES_PATH = "src/content/pages/";

const postsCollection = defineCollection({
	loader: glob({ pattern: "*.{md,mdx}", base: `./${POSTS_PATH}` }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.coerce.date(),
		updated: z.coerce.date().optional(),
		category: z.string().optional().default("Blog"),
		draft: z.boolean().default(false),
		lang: z.string().optional(),
		source: z.string().optional(),
		externalUrl: z.url().optional(),
	}),
});

const pagesCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: `./${PAGES_PATH}` }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		draft: z.boolean().default(false),
		lang: z.string().optional(),
	}),
});

export const collections = {
	posts: postsCollection,
	pages: pagesCollection,
};
