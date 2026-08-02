import { visit } from "unist-util-visit";
import type { Properties } from "hast";
import type { Plugin } from "unified";
import type { Root, Image, Paragraph, PhrasingContent, RootContent, Html, Text } from "mdast";
import type { VFile } from "vfile";

declare module "hast" {
	interface Properties {
		"data-caption"?: string | undefined;
	}
}

/**
 * Consolidated image processing plugin for Astro Base
 *
 * Handles:
 * - Image path resolution for posts/ and pages/ collections
 * - Image captions from title attribute
 * - Image grid class assignment for consecutive images
 * - loading="lazy" and decoding="async" on all images
 */

function ensureNodeData(node: Image | Paragraph) {
	node.data ??= {};
	return node.data;
}

function ensureHProperties(node: Image | Paragraph): Properties {
	const data = ensureNodeData(node);
	data.hProperties ??= {};
	return data.hProperties;
}

function isBlankText(node: PhrasingContent): node is Text {
	return node.type === "text" && node.value.trim() === "";
}

function isImageNode(node: PhrasingContent): node is Image {
	return node.type === "image";
}

function createHtml(value: string): Html {
	return {
		type: "html",
		value,
	};
}

// ── Path Resolution ──────────────────────────────────────────────────────────

function resolveImagePaths(tree: Root, file: VFile) {
	visit(tree, "image", (node: Image) => {
		if (!node.url) return;

		if (node.url.startsWith("http://") || node.url.startsWith("https://")) return;
		if (node.url.startsWith("/")) return;
		if (node.url.startsWith("./") || node.url.startsWith("../")) return;

		const url = node.url;

		if (!url.includes("/")) {
			node.url = `./attachments/${url}`;
			return;
		}

		if (url.startsWith("attachments/") || url.startsWith("images/")) {
			node.url = `./${url}`;
			return;
		}

		const filePath = file.path;
		if (typeof filePath === "string") {
			const normalizedPath = filePath.replace(/\\/g, "/");
			const contentIndex = normalizedPath.indexOf("/src/content/");

			if (contentIndex !== -1) {
				const contentRoot = normalizedPath
					.slice(contentIndex + "/src/content/".length)
					.replace(/\/[^/]+\.md$/, "");

				if (url.startsWith(`${contentRoot}/`)) {
					node.url = `./${url.slice(contentRoot.length + 1)}`;
					return;
				}

				const collectionName = contentRoot.split("/")[0];
				if (url.startsWith(`${collectionName}/`)) {
					const pathWithinCollection = url.slice(collectionName.length + 1);
					node.url = `./${pathWithinCollection}`;
					return;
				}
			}
		}

		node.url = `./${url}`;
	});
}

// ── Image Attributes ─────────────────────────────────────────────────────────

function addImageAttributes(tree: Root) {
	visit(tree, "image", (node: Image) => {
		const props = ensureHProperties(node);
		props.loading ??= "lazy";
		props.decoding ??= "async";
	});
}

// ── Image Captions ───────────────────────────────────────────────────────────

function processImageCaptions(tree: Root) {
	visit(tree, "image", (node: Image) => {
		if (!node.title) return;

		const props = ensureHProperties(node);
		props["data-caption"] = node.title;
		props.title = node.title;
	});
}

// ── Image Grids ───────────────────────────────────────────────────────────────

function isImageOnlyParagraph(node: RootContent): node is Paragraph {
	return (
		node.type === "paragraph" &&
		node.children.length > 0 &&
		node.children.every((child) => isImageNode(child) || isBlankText(child))
	);
}

function mergeConsecutiveImageParagraphs(tree: Root) {
	if (!tree.children.length) return;

	let i = 0;
	while (i < tree.children.length) {
		const node = tree.children[i];
		if (!isImageOnlyParagraph(node)) {
			i++;
			continue;
		}

		const group: Paragraph[] = [node];
		let j = i + 1;

		while (j < tree.children.length) {
			const next = tree.children[j];
			if (!isImageOnlyParagraph(next)) break;
			group.push(next);
			j++;
		}

		if (group.length > 1) {
			const merged = group[0];
			merged.children = group.flatMap((paragraph) => paragraph.children.filter(isImageNode));
			tree.children.splice(i + 1, group.length - 1);
		}

		i++;
	}
}

function wrapImageInGalleryItem(image: Image): PhrasingContent[] {
	ensureHProperties(image).className = ["gallery-item__image"];

	return [createHtml('<div class="gallery-item">'), image, createHtml("</div>")];
}

function processImageGrids(tree: Root) {
	visit(tree, "paragraph", (node: Paragraph) => {
		if (!node.children.length) return;

		const existingClass = node.data?.hProperties?.className?.[0] ?? "";
		if (existingClass === "gallery-grid" || existingClass === "gallery-single") return;

		const images = node.children.filter(isImageNode);
		const otherContent = node.children.filter(
			(child) => !isImageNode(child) && !isBlankText(child),
		);

		if (images.length === 0 || otherContent.length > 0) return;

		const data = ensureNodeData(node);
		const props = ensureHProperties(node);
		data.hName = "div";
		props.className = [images.length === 1 ? "gallery-single" : "gallery-grid"];
		node.children = images.flatMap(wrapImageInGalleryItem);
	});
}

// ── Main Plugin ───────────────────────────────────────────────────────────────

export const remarkImageProcessing: Plugin<[], Root> = () => {
	return (tree, file) => {
		resolveImagePaths(tree, file);
		addImageAttributes(tree);
		processImageCaptions(tree);
		mergeConsecutiveImageParagraphs(tree);
		processImageGrids(tree);
	};
};

export default remarkImageProcessing;
