import { visit } from "unist-util-visit";
import type { Root, Text, Link, Image } from "mdast";

/**
 * Remark Obsidian Plugin
 *
 * Supports:
 * - Wikilinks:
 *   [[Page]]
 *   [[Page|Alias]]
 *   [[Page#Heading]]
 *   [[#Heading]]
 *
 * - Image embeds:
 *   ![[image.jpg]]
 *   ![[image.jpg|Alt]]
 *
 * - Comments:
 *   %%comment%%
 *
 * - Highlights:
 *   ==text==
 */

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function resolveWikiLink(target: string): string {
	// [[#heading]]

	if (target.startsWith("#")) {
		return `#${slugify(target.slice(1))}`;
	}

	let page = target;
	let anchor = "";

	// [[page#heading]]

	if (target.includes("#")) {
		const split = target.split("#");

		page = split[0];

		anchor = split[1];
	}

	// Remove folders

	const filename = page.split("/").pop() || page;

	// Remove extension

	const clean = filename.replace(/\.md$/, "");

	// Slugify filename only

	const slug = slugify(clean);

	// Add anchor if present

	if (anchor) {
		return `/${slug}#${slugify(anchor)}`;
	}

	return `/${slug}`;
}

function processFormatting(text: string): string {
	// Remove comments

	text = text.replace(/%%.*?%%/gs, "");

	// Highlights

	text = text.replace(/==(.*?)==/g, "<mark>$1</mark>");

	return text;
}

export function remarkObsidian() {
	return (tree: Root) => {
		visit(tree, "text", (node: Text, index, parent) => {
			if (!parent || index === undefined) {
				return;
			}

			const value = node.value;

			const newNodes: Array<Text | Link | Image> = [];

			let lastIndex = 0;

			// ![[image.jpg]]
			// ![[image.jpg|Alt]]

			const imageRegex = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

			// [[Page]]
			// [[Page|Alias]]

			const wikilinkRegex = /(?<!!)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

			type ImageMatch = {
				start: number;
				end: number;
				node: Image;
				kind: "image";
			};

			type LinkMatch = {
				start: number;
				end: number;
				node: Link;
				kind: "link";
			};

			const imageMatches: ImageMatch[] = [];

			let match: RegExpExecArray | null;

			// Collect image embeds

			while ((match = imageRegex.exec(value)) !== null) {
				const imagePath = match[1].trim();

				const alt = match[2]?.trim() || imagePath;

				imageMatches.push({
					start: match.index,

					end: match.index + match[0].length,
					kind: "image",

					node: {
						type: "image",
						url: imagePath,
						alt,
					},
				});
			}

			const wikilinkMatches: LinkMatch[] = [];

			wikilinkRegex.lastIndex = 0;

			// Collect wikilinks

			while ((match = wikilinkRegex.exec(value)) !== null) {
				// Ignore image embeds

				const matchIndex = match?.index ?? -1;

				const overlaps = imageMatches.some(
					(img) => matchIndex >= img.start && matchIndex < img.end,
				);

				if (overlaps) {
					continue;
				}

				const target = match[1].trim();

				const label = match[2]?.trim() || target;

				wikilinkMatches.push({
					start: match.index,

					end: match.index + match[0].length,
					kind: "link",

					node: {
						type: "link",
						url: resolveWikiLink(target),

						children: [
							{
								type: "text",
								value: label,
							},
						],
					},
				});
			}

			const matches = [...imageMatches, ...wikilinkMatches].sort((a, b) => a.start - b.start);

			// No wikilinks or embeds

			if (matches.length === 0) {
				const processed = processFormatting(value);

				if (processed !== value) {
					node.value = processed;
				}

				return;
			}

			// Build replacement nodes

			for (const m of matches) {
				// Text before match

				if (m.start > lastIndex) {
					const textBefore = processFormatting(value.slice(lastIndex, m.start));

					if (textBefore) {
						newNodes.push({
							type: "text",
							value: textBefore,
						});
					}
				}

				// Insert embed/link node

				newNodes.push(m.node);

				lastIndex = m.end;
			}

			// Remaining trailing text

			if (lastIndex < value.length) {
				const textAfter = processFormatting(value.slice(lastIndex));

				if (textAfter) {
					newNodes.push({
						type: "text",
						value: textAfter,
					});
				}
			}

			// Replace original node

			if (newNodes.length > 0) {
				parent.children.splice(index, 1, ...newNodes);

				return index + newNodes.length;
			}
		});
	};
}

export default remarkObsidian;
