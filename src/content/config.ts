import { defineCollection } from "astro:content";
import { blogSchema, externalPostsSchema, talkSchema } from "./_schemas";

const blog = defineCollection({
	schema: blogSchema,
});

const externalPosts = defineCollection({
	schema: externalPostsSchema,
});

const talks = defineCollection({
	schema: talkSchema,
});

export const collections = { blog, externalPosts, talks };
