import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PDFParser } from "pdf2json";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    let prompt = "";

    const pdfPath = path.join(process.cwd(), "db", "VinothKumarResume.pdf");

    // console.log("Looking for file at:", pdfPath);

    // Update permissions (optional for Windows)
    fs.chmod(pdfPath, 0o777, (err) => {
      if (err) {
        console.error("Failed to set permissions:", err);
      } else {
        console.log("Permissions updated to 0777 (Unix-style)");
      }
    });

    const pdfText = await extractTextFromPDF(pdfPath);

    prompt = `
Below is the resume of Vinoth Kumar:
-----------------------------
${pdfText}

Now answer this user question based on the resume:
"${message}"
    `;

    // Call Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No response.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ reply: "AI processing failed." }, { status: 500 });
  }
}

// ✅ Extract text from PDF using pdf2json
function extractTextFromPDF(pdfPath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const { default: PDFParser } = await import("pdf2json");
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });

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