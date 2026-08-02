import fs from "node:fs";
import path from "node:path";

const postsDir = path.resolve("src/content/posts");
const postFilePattern = /^(\d{3})-[a-z0-9-]+\.(md|mdx)$/;
const publishedPattern = /^published:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*$/m;

const entries = fs.readdirSync(postsDir, { withFileTypes: true });
const nestedDirectories = entries.filter((entry) => entry.isDirectory());
const postFiles = entries
  .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const errors = [];

if (nestedDirectories.length > 0) {
  errors.push(
    `Posts must live directly in src/content/posts/. Found nested directories: ${nestedDirectories
      .map((entry) => entry.name)
      .join(", ")}`,
  );
}

const posts = postFiles.map((fileName) => {
  const match = fileName.match(postFilePattern);

  if (!match) {
    errors.push(
      `Invalid post filename: ${fileName}. Expected format 001-my-post.md`,
    );
  }

  const prefix = Number(match?.[1]);
  const fullPath = path.join(postsDir, fileName);
  const content = fs.readFileSync(fullPath, "utf8");
  const publishedMatch = content.match(publishedPattern);

  if (!publishedMatch) {
    errors.push(`Missing published date in ${fileName}`);
  }

  return {
    fileName,
    prefix,
    published: publishedMatch?.[1] ?? "",
  };
});

for (const [index, post] of posts.entries()) {
  const expectedPrefix = index + 1;

  if (post.prefix !== expectedPrefix) {
    errors.push(
      `Invalid prefix for ${post.fileName}. Expected ${String(expectedPrefix).padStart(3, "0")}.`,
    );
  }
}

const expectedOrder = [...posts].sort((a, b) => {
  const dateCompare = a.published.localeCompare(b.published);

  if (dateCompare !== 0) {
    return dateCompare;
  }

  return a.fileName.localeCompare(b.fileName);
});

for (const [index, post] of posts.entries()) {
  if (post.fileName !== expectedOrder[index]?.fileName) {
    errors.push(
      [
        "Post numbering must follow ascending published dates.",
        `Expected #${String(index + 1).padStart(3, "0")} to be ${expectedOrder[index]?.fileName},`,
        `but found ${post.fileName}.`,
      ].join(" "),
    );
  }
}

if (errors.length > 0) {
  console.error("\nPost ordering lint failed:\n");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log(`Post ordering OK (${posts.length} posts checked)`);
