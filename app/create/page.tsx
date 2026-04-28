"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      alert("Failed to create post.");
      return;
    }

    alert("Post created successfully!");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="app-canvas relative flex-1 overflow-hidden">
      <section className="relative mx-auto w-full max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
        <form
          onSubmit={handleSubmit}
          className="surface-card reveal-up rounded-[2rem] p-7 sm:p-10"
        >
          <header className="max-w-3xl">
            <p className="inline-flex rounded-full border border-[color:var(--surface-border)] bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Create New Blog
            </p>
            <h1 className="font-display mt-5 text-4xl leading-tight text-[color:var(--foreground)] sm:text-5xl">
              Write A New Entry
            </h1>
          </header>

          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mt-6 w-full rounded-md border border-gray-300 px-3 py-2"
          />

          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="mt-4 h-40 w-full rounded-md border border-gray-300 px-3 py-2"
          />

          <button
            type="submit"
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:pr-5"
            style={{ backgroundColor: "#d05b42" }}
          >
            Create Post
          </button>
        </form>
      </section>
    </main>
  );
}
