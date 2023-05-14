import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@config";

export async function get() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return rss({
    title: SITE.metaTitle,
    description: SITE.desc,
    site: SITE.website,
    items: posts.map(({ slug, data }) => ({
      link: `blog/${slug}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.date),
    })),
  });
}
