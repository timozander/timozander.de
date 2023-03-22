import { defineCollection } from "astro:content";
import { blogSchema, externalPostsSchema } from "./_schemas";

const blog = defineCollection({
  schema: blogSchema,
});

const externalPosts = defineCollection({
  schema: externalPostsSchema,
});

export const collections = { blog, externalPosts };
