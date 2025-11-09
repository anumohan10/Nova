import { VertexAI } from "@google-cloud/vertexai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const vertex = new VertexAI({
      project: "nova-crm-project",
      location: "us-central1",
    });

    const model = vertex.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response text found.";

    return Response.json({ success: true, output: text });
  } catch (err) {
    console.error("Vertex AI Error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ success: false, error: message });
  }
}
