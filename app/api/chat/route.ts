export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const pdfPath = path.join(process.cwd(), "db", "VinothKumarResume.pdf");

    // Optional permission fix (for Unix, not needed in Windows usually)
    fs.chmod(pdfPath, 0o777, (err) => {
      if (err) console.error("chmod failed:", err);
    });

    const pdfText = await extractTextFromPDF(pdfPath);

    const truncatedText = pdfText.slice(0, 15000); // Optional: avoid overloading prompt

    const prompt = `
Below is the resume of Vinoth Kumar:
-----------------------------
${truncatedText}

Now answer this user question based on the resume:
"${message}"
    `;

    // Add timeout logic
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const reply = chatCompletion.choices[0]?.message?.content || "No response.";
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Error:", error?.message || error);
    if (error.name === "AbortError") {
      return NextResponse.json({ reply: "AI took too long to respond." }, { status: 504 });
    }
    return NextResponse.json({ reply: "AI processing failed." }, { status: 500 });
  }
}

// ✅ Extract PDF text with pdf2json
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const { default: PDFParser } = await import("pdf2json");
  const pdfParser = new PDFParser();

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const text = pdfData?.Pages?.map((page: any) =>
        page.Texts.map((textObj: any) =>
          decodeURIComponent(textObj.R.map((r: any) => r.T).join(""))
        ).join(" ")
      ).join("\n");
      resolve(text || "");
    });

    pdfParser.loadPDF(pdfPath);
  });
}
