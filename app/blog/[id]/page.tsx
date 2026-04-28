import { getPostById, getPosts } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Blog({ params }: BlogProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    notFound();
  }

  const posts = await getPosts();
  const currentIndex = posts.findIndex((entry) => entry.id === id);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex >= 0 && currentIndex < posts.length - 1
      ? posts[currentIndex + 1]
      : undefined;

  return (
    <main className="app-canvas relative flex-1 overflow-hidden">
      <section className="relative mx-auto w-full max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <Link
          href="/"
          className="reveal-up inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
        >
          <span aria-hidden="true">←</span>
          All Stories
        </Link>

        <article className="surface-card reveal-up reveal-up-delay-1 mt-6 rounded-[2rem] p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Issue {id.padStart(2, "0")}
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[color:var(--foreground)]/90">
            {post.content}
          </p>

          <div className="mt-10 grid gap-3 border-t border-[color:var(--surface-border)] pt-6 sm:grid-cols-2">
            {previousPost ? (
              <Link
                href={`/blog/${previousPost.id}`}
                className="rounded-2xl border border-[color:var(--surface-border)] bg-white/70 px-4 py-3 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:-translate-y-0.5"
              >
                <span className="block text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Previous
                </span>
                {previousPost.title}
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--surface-border)] px-4 py-3 text-sm text-[color:var(--muted)]">
                Start of journal
              </div>
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.id}`}
                className="rounded-2xl border border-[color:var(--surface-border)] bg-white/70 px-4 py-3 text-sm font-medium text-[color:var(--foreground)] transition-transform hover:-translate-y-0.5"
              >
                <span className="block text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  Next
                </span>
                {nextPost.title}
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--surface-border)] px-4 py-3 text-sm text-[color:var(--muted)] sm:text-right">
                Latest entry
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
