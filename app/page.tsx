"use client";
import type { Post } from "@/types/post";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      const data = (await response.json()) as Post[];
      setPosts(data);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Unable to load posts right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPosts();
  }, [loadPosts]);

  const deletePost = async (id: string) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete post.");
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
  };

  return (
    <main className="app-canvas relative flex-1 overflow-hidden">
      <section className="relative mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-16 lg:px-12">
        <header className="reveal-up max-w-3xl">
          <p className="inline-flex rounded-full border border-[color:var(--surface-border)] bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Studio Journal
          </p>
          <h1 className="font-display mt-5 text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
            Build Notes For Curious Minds
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[color:var(--muted)] sm:text-lg">
            Small, practical reads about building product features, fixing
            mistakes, and learning in public.
          </p>
            <Link
              href="/chat"
              className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:pr-5"
              style={{ background: "linear-gradient(90deg,#3b82f6,#1e40af)" }}
            >
              💬 Try the Chatbot
            </Link>
        </header>
        <Link
          href="/create"
          className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:pr-5"
          style={{ backgroundColor: "#d05b42" }}
        >
          Create New Blog
        </Link>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="text-sm text-[color:var(--muted)]">Loading posts...</p>
          ) : null}

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          {posts.map((post, index) => {
            const delayClass =
              index === 0
                ? "reveal-up-delay-1"
                : index === 1
                  ? "reveal-up-delay-2"
                  : "reveal-up-delay-3";

            return (
              <article
                key={post.id}
                className={`surface-card reveal-up ${delayClass} group flex min-h-64 flex-col rounded-3xl p-6`}
              >
                
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)] flex justify-between">
                  <span>
                    Issue {post.id.padStart(2, "0")}
                  </span>
                  <div
                    onClick={() => deletePost(post.id)}
                    className="text-red-500 cursor-pointer"
                  >
                    Delete
                  </div>
                </span>
                <h2 className="font-display mt-4 text-2xl leading-tight text-[color:var(--foreground)]">
                  {post.title}
                </h2>
                <p className="mt-4 text-sm text-[color:var(--muted)]">
                  {post.content}
                </p>
                <div className="mt-auto pt-8">
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:pr-5"
                    style={{
                      backgroundColor: "#d05b42",
                    }}
                  >
                    Read Story
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
