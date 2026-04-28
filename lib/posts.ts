import { promises as fs } from "node:fs";
import path from "node:path";
import type { Post } from "@/types/post";

const POSTS_FILE = path.join(process.cwd(), "data", "posts.json");

const seedPosts: Post[] = [
  {
    id: "1",
    title: "First Blog",
    content: "This is the content of my first blog",
  },
  {
    id: "2",
    title: "Second Blog",
    content: "This is the content of my second blog",
  },
  {
    id: "3",
    title: "Third Blog",
    content: "This is the content of my third blog",
  },
];

async function ensurePostsFile(): Promise<void> {
  try {
    await fs.access(POSTS_FILE);
  } catch {
    await fs.mkdir(path.dirname(POSTS_FILE), { recursive: true });
    await fs.writeFile(POSTS_FILE, JSON.stringify(seedPosts, null, 2), "utf8");
  }
}

async function readPostsFromDisk(): Promise<Post[]> {
  await ensurePostsFile();
  const fileContents = await fs.readFile(POSTS_FILE, "utf8");

  try {
    const parsed = JSON.parse(fileContents) as unknown;
    if (!Array.isArray(parsed)) {
      return [...seedPosts];
    }

    return parsed
      .filter((post) => {
        return (
          typeof post === "object" &&
          post !== null &&
          "id" in post &&
          "title" in post &&
          "content" in post
        );
      })
      .map((post) => {
        const record = post as {
          id: string;
          title: string;
          content: string;
        };
        return {
          id: String(record.id),
          title: String(record.title),
          content: String(record.content),
        };
      });
  } catch {
    return [...seedPosts];
  }
}

async function writePostsToDisk(posts: Post[]): Promise<void> {
  await ensurePostsFile();
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
}

export async function getPosts(): Promise<Post[]> {
  return readPostsFromDisk();
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await readPostsFromDisk();
  return posts.find((post) => post.id === id);
}

export async function createPost(data: Omit<Post, "id">): Promise<Post> {
  const posts = await readPostsFromDisk();
  const nextId = (
    Math.max(0, ...posts.map((post) => Number(post.id) || 0)) + 1
  ).toString();

  const newPost: Post = {
    id: nextId,
    title: data.title,
    content: data.content,
  };

  posts.push(newPost);
  await writePostsToDisk(posts);
  return newPost;
}

export async function deletePostById(id: string): Promise<boolean> {
  const posts = await readPostsFromDisk();
  const filteredPosts = posts.filter((post) => post.id !== id);

  if (filteredPosts.length === posts.length) {
    return false;
  }

  await writePostsToDisk(filteredPosts);
  return true;
}
