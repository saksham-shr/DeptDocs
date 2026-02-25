import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        // 1. Parse the JSON body instead of formData
        const { urls } = await req.json();

        if (!urls || urls.length === 0) {
            return NextResponse.json({ error: "No asset URLs provided" }, { status: 400 });
        }

        // 2. Fetch the files from the Supabase URLs and convert to base64
        const fileParts = await Promise.all(
            urls.map(async (url: string) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch file from Supabase: ${url}`);

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Dynamically get the mime type from the fetch response
                const mimeType = response.headers.get("content-type") || "application/pdf";

                return {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: mimeType,
                    },
                };
            })
        );

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Your tailored Christ University Prompt
        const prompt = `
      Analyze these Christ University event assets (Brochure, NFA, Attendance, Feedback). 
      Extract and cross-reference data for an official Activity Report.
      
      CRITICAL INSTRUCTIONS:
      1. ATTENDANCE: Manually count unique names in any document labeled 'Attendance List'. Do not rely on summary text if a list is present.
      2. NFA: Identify approved budget and department specific details.
      3. SUMMARY: Synthesize a professional 'Synopsis' using 'Highlights' and 'Key Takeaways' found in the text.
      
      Return valid JSON only matching this exact structure (leave blank strings if not found):
      {
        "title": "Event Title",
        "activityType": "Workshop",
        "venue": "Venue",
        "participants": { "student": number, "faculty": number, "scholar": number },
        "speakers": [{ "name": "", "designation": "", "org": "" }],
        "description": { "highlights": "", "summary": "", "takeaways": "" }
      }
    `;

        // 4. Send everything to Gemini
        const result = await model.generateContent([prompt, ...fileParts]);
        const text = result.response.text().replace(/```json|```/g, "").trim();

        return NextResponse.json(JSON.parse(text));
    } catch (error: any) {
        console.error("AI Extraction Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}