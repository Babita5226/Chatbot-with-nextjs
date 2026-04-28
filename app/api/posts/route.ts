import { createPost, getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const posts = await getPosts();
  return Response.json(posts);
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as {
    title?: string;
    content?: string;
  };

  const title = body.title?.trim();
  const content = body.content?.trim();

  if (!title || !content) {
    return Response.json(
      { error: "Both title and content are required." },
      { status: 400 },
    );
  }

  const newPost = await createPost({ title, content });
  return Response.json(newPost, { status: 201 });
}
