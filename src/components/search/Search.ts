import type { BlogFrontmatter } from "@content/_schemas";

export type SearchInformation = Pick<
  BlogFrontmatter,
  "title" | "description"
> & { slug: string };
