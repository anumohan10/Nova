import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Handle multipart form data (file upload)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Forward file to FastAPI backend
    const backendResponse = await fetch("http://127.0.0.1:8000/transcribe-audio/", {
      method: "POST",
      body: formData,
    });

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in Next.js route:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
