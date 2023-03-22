import { z } from "astro:content";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    date: z.date(),
    title: z.string(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    description: z.string(),
  })
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;

export const externalPostsSchema = z.object({
  source: z.string(),
  title: z.string(),
  language: z.union([z.literal("en"), z.literal("de")]),
  date: z.date(),
});

export type ExternalPostsFrontmatter = z.infer<typeof externalPostsSchema>;
export type Language = ExternalPostsFrontmatter["language"];
