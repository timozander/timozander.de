import type { CollectionEntry } from "astro:content"

const getSortedPosts = (
  posts: CollectionEntry<"blog">[],
  externalPosts: CollectionEntry<"externalPosts">[],
) =>
  [...posts, ...externalPosts]
    .filter(
      ({ data }) =>
        !("draft" in data) || data.draft === undefined || data.draft === false,
    )
    .sort(
      (a, b) =>
        Math.floor(new Date(b.data.date).getTime() / 1000) -
        Math.floor(new Date(a.data.date).getTime() / 1000),
    )

export default getSortedPosts
