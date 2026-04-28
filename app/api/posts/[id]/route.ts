import { deletePostById } from "@/lib/posts";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const deleted = await deletePostById(id);

  if (!deleted) {
    return Response.json({ error: "Post not found." }, { status: 404 });
  }

  return Response.json({ message: "Post deleted successfully." });
}
