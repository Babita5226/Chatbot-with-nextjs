"use client";

import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState([]); // Array of File
  const [imagePreviews, setImagePreviews] = useState([]); // Array of string (data URLs)
  // Add welcome message only on client
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! How can I help you today?",
        ts: new Date().toLocaleTimeString(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() && images.length === 0) return;

    const userMsg = {
      sender: "user",
      text: input,
      ts: new Date().toLocaleTimeString(),
      images: imagePreviews,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setImages([]);
    setImagePreviews([]);
    setLoading(true);

    try {
      let body;
      let headers = {};
      if (images.length > 0) {
        body = new FormData();
        images.forEach((img, i) => body.append("images", img));
        body.append("messages", JSON.stringify([...messages, userMsg]));
      } else {
        body = JSON.stringify({ messages: [...messages, userMsg] });
        headers["Content-Type"] = "application/json";
      }
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: data.reply,
          ts: new Date().toLocaleTimeString(),
        },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Sorry, there was a problem. Try again.",
          ts: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(setImagePreviews);
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-200/70 via-white to-blue-100/80 relative">
      {/* Decorative blurred shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-2xl z-0" />

      {/* Header */}
      <header className="flex items-center gap-3 px-8 py-5 bg-white/90 shadow border-b border-blue-100 z-10">
        <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600 drop-shadow" />
        <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight drop-shadow">
          Dialogix AI
        </h1>
      </header>

      {/* Chat area fills all available space */}
      <main className="flex-1 flex flex-col justify-end w-full max-w-5xl mx-auto px-2 sm:px-8 py-6 z-10">
        <div className="flex-1 flex flex-col justify-end gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex group ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div
                className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                {msg.sender === "bot" ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-200 flex items-center justify-center border-2 border-blue-300 shadow">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-blue-400 shadow">
                    <span className="font-bold text-white text-lg">U</span>
                  </div>
                )}
                {/* Message bubble */}
                <div
                  className={`relative px-5 py-3 max-w-[70vw] sm:max-w-2xl shadow-md text-base transition-all duration-200 border-l-4
                    ${
                      msg.sender === "user"
                        ? "bg-blue-500/90 text-white rounded-2xl rounded-br-md whitespace-pre-line border-blue-400"
                        : "bg-white/90 text-gray-900 rounded-2xl rounded-bl-md border border-blue-100 border-l-blue-200"
                    }
                  `}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <div className="flex items-start gap-2 my-2 text-blue-900 text-base">
                            <span className="text-xl leading-none select-none">
                              🔹
                            </span>
                            <span>{children}</span>
                          </div>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-2 my-2 text-blue-900 text-base list-none">
                            <span className="text-xl leading-none select-none">
                              🔹
                            </span>
                            <span>{children}</span>
                          </li>
                        ),
                        ul: ({ children }) => (
                          <ul className="space-y-2">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="space-y-2 list-decimal list-inside">
                            {children}
                          </ol>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-blue-700 font-semibold bg-blue-100 px-1 rounded">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-black px-1 rounded text-green-300 font-mono text-xs">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-black text-green-300 rounded-lg p-3 overflow-x-auto my-2 border border-blue-800">
                            <code>{children}</code>
                          </pre>
                        ),
                        img: ({ src, alt }) => (
                          <img
                            src={src || ""}
                            alt={alt || ""}
                            className="rounded-lg border border-blue-100 my-2 max-h-64 mx-auto"
                          />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-line">{msg.text}</span>
                  )}
                  <span
                    className={`block text-xs mt-2 text-right font-semibold tracking-wide ${msg.sender === "user" ? "text-white/90 drop-shadow" : "text-blue-500"}`}
                  >
                    {msg.ts}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex mb-4 justify-start">
              <div className="rounded-2xl px-4 py-2 max-w-[70vw] sm:max-w-2xl shadow text-base font-medium bg-white/80 text-blue-400 border border-blue-100 animate-pulse flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-blue-200 rounded-full animate-bounce" />
                <span className="inline-block w-3 h-3 bg-blue-300 rounded-full animate-bounce delay-150" />
                <span className="inline-block w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300" />
                <span className="ml-2">AI is typing…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Sticky input area at the bottom */}
      <form
        onSubmit={handleSend}
        className="p-5 border-t bg-white/90 backdrop-blur-md flex gap-3 w-full max-w-5xl mx-auto sticky bottom-0 z-10"
        autoComplete="off"
      >
        {/* Image upload button */}
        <label className="flex items-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={loading}
          />
          <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 transition text-sm font-semibold">
            📷
          </span>
        </label>
        {imagePreviews.map((src, idx) => (
          <div key={idx} className="relative flex items-center ml-2">
            <img
              src={src}
              alt={`preview-${idx}`}
              className="h-10 w-10 object-cover rounded-lg border border-blue-200"
            />
            <button
              type="button"
              onClick={() => {
                setImages(images.filter((_, i) => i !== idx));
                setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
              }}
              className="absolute -top-2 -right-2 bg-white border border-blue-300 rounded-full w-5 h-5 flex items-center justify-center text-blue-500 hover:bg-blue-100 shadow"
              tabIndex={-1}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        {/* Text input */}
        <textarea
          className="flex-1 border border-blue-200 rounded-xl px-5 py-3 
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
  bg-blue-50/60 text-base shadow-md placeholder:text-blue-300 
  resize-none overflow-y-auto"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);

            // auto resize with limit
            e.target.style.height = "auto";

            const maxHeight = 120; // 👈 adjust this (approx 4–5 lines)
            if (e.target.scrollHeight <= maxHeight) {
              e.target.style.height = e.target.scrollHeight + "px";
              e.target.style.overflowY = "hidden"; // no scrollbar yet
            } else {
              e.target.style.height = maxHeight + "px";
              e.target.style.overflowY = "auto"; // show scrollbar
            }
          }}
          placeholder="Type your message..."
          disabled={loading}
          rows={2}
        />
        {/* Send button */}
        <button
          type="submit"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-60 shadow-lg font-semibold text-base"
          disabled={loading || (!input.trim() && !images)}
          aria-label="Send"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </form>
      {/* Footer */}
      <footer className="w-full text-center py-6 text-blue-300 text-sm font-medium z-10 relative select-none">
        &copy; {new Date().getFullYear()} Dialogix AI &mdash; All rights
        reserved.
      </footer>
    </div>
  );
}
