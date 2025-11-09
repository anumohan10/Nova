"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/test-vertex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      // Match the JSON returned from route.ts
      setResponse(data.output || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to Vertex AI API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-black dark:text-zinc-50">
          ✨ Vertex AI Chat ✨
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Vertex something..."
            rows={4}
            className="border rounded-lg p-3 dark:bg-zinc-800 dark:text-zinc-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-zinc-800 transition"
          >
            {loading ? "Thinking..." : "Ask Vertex"}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <h2 className="font-semibold mb-2 text-black dark:text-zinc-50">Response:</h2>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {response}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
