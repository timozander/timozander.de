import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import getSortedPosts from "@utils/getSortedPosts";

export async function GET() {
	const posts = await getCollection("blog");

	const sortedPosts = getSortedPosts(posts, []);

	return rss({
		title: SITE.metaTitle,
		description: SITE.desc,
		site: SITE.website,
		items: sortedPosts.map(({ slug, data }) => ({
			link: `blog/${slug}/`,
			title: data.title,
			description: data.description,
			pubDate: new Date(data.date),
		})),
	});
}
