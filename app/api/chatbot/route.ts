import { NextRequest, NextResponse } from "next/server";
import { OLLAMA_API_KEY, OLLAMA_API_URL } from "@/lib/openai";


console.log("[DEBUG] OLLAMA_API_KEY present:", !!OLLAMA_API_KEY);

export async function POST(req: NextRequest) {
   const contentType = req.headers.get("content-type") || "";
  let messages, image;

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    image = formData.get("image"); // This is a File object
    const messagesRaw = formData.get("messages");
    if (typeof messagesRaw === "string") {
      messages = JSON.parse(messagesRaw);
    } else {
      messages = undefined;
    }
    // You can now process the image and messages
  } else {
    ({ messages } = await req.json());
  }
  const lastUserMsg = messages?.filter((m: any) => m.sender === "user").pop();
  let botReply = "Sorry, I didn't get that.";


  if (!OLLAMA_API_URL) {
    console.log("[DEBUG] No OLLAMA_API_URL found");
    // Fallback: echo
    if (lastUserMsg) {
      botReply = `You said: ${lastUserMsg.text}`;
    }
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ reply: botReply });
  }

  // Call Ollama API
  try {
    const apiRes = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(OLLAMA_API_KEY ? { Authorization: `Bearer ${OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: "llama2", // Change to your preferred Ollama model
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages.map((m: any) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        ],
        stream: false,
      }),
    });
    const data = await apiRes.json();
    console.log("[DEBUG] Ollama API response:", data);
    botReply = data?.message?.content?.trim() || "Sorry, I didn't get that.";
    return NextResponse.json({ reply: botReply });
  } catch (e: any) {
    console.error("[DEBUG] Ollama API error:", e);
    let errorMsg = "";
    if (e instanceof Error) {
      errorMsg = e.message;
    } else if (typeof e === "string") {
      errorMsg = e;
    } else {
      errorMsg = JSON.stringify(e);
    }
    if (lastUserMsg) {
      botReply = `Error: ${errorMsg}\nYou said: ${lastUserMsg.text}`;
    } else {
      botReply = `Error: ${errorMsg}`;
    }
    return NextResponse.json({ reply: botReply });
  }
}
