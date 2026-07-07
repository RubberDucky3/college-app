"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useStudentGraph } from "@/contexts/StudentGraph";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIMentor() {
  const { graph } = useStudentGraph();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your admissions coach. Ask me anything about colleges, your profile, or what to do next.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || streaming) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
          studentContext: {
            firstName: graph.firstName,
            track: graph.track,
            gradeLevel: graph.gradeLevel,
            gpa: graph.gpa,
            intendedMajor: graph.intendedMajor,
            dreamSchools: graph.dreamSchools,
            extracurriculars: graph.extracurriculars.map((ec) => ({
              name: ec.name,
              type: ec.type,
              leadership: ec.leadership,
            })),
            interests: graph.interests,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      // Read stream
      const decoder = new TextDecoder();
      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, graph]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl active:scale-95"
        aria-label="AI Mentor"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-over panel */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-80 sm:w-96 origin-bottom-right transition-all duration-200 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex h-[500px] flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm dark:bg-blue-900/50">
              🎓
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Admissions Coach
              </h3>
              {graph.firstName && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  Personalized for {graph.firstName}
                </p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {msg.content || (
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.1s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 dark:border-gray-700">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                disabled={streaming}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                className="flex items-center justify-center rounded-xl bg-blue-600 px-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              Your profile context is shared for personalized advice
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
