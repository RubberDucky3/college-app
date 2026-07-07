import { generateObject } from "ai";
import { z } from "zod";
import { provider, EXTRACT_MODEL } from "@/lib/ai";

const ExtractProfileSchema = z.object({
  gpa: z.number().min(0).max(5).describe("Weighted GPA (0-5 scale)"),
  intendedMajor: z.string().describe("Intended college major / field of study"),
  interests: z.array(z.string()).describe("Academic / extracurricular interests"),
  gradeLevel: z
    .enum(["8th", "freshman", "sophomore", "junior", "senior", "gap-year", "college"])
    .optional()
    .describe("Detected grade level"),
  currentActivities: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(["club", "sport", "volunteer", "work", "research", "art", "other"]),
        leadership: z.boolean(),
      })
    )
    .optional()
    .describe("Extracurricular activities mentioned"),
  careerGoal: z.string().optional().describe("Career aspiration if mentioned"),
  apCourses: z.array(z.string()).optional().describe("AP/IB/Honors courses mentioned"),
});

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return Response.json({ error: "Missing 'text' field" }, { status: 400 });
  }

  if (text.length > 2000) {
    return Response.json({ error: "Text too long (max 2000 chars)" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: provider(EXTRACT_MODEL),
      schema: ExtractProfileSchema,
      system: `You are a helpful college admissions assistant. Extract academic profile information from the student's self-description.

Rules:
- Only extract information that is explicitly stated or very clearly implied.
- Do NOT guess or fabricate values.
- For GPA, convert to a 4.0 scale if another scale is mentioned.
- For gradeLevel, only set it if the student explicitly mentions their grade or year.
- Interests should be specific (e.g., "programming" not "STEM").
- If nothing can be extracted, return empty/default values.`,
      prompt: text,
      temperature: 0.1,
    });

    return Response.json(object);
  } catch (error) {
    console.error("AI extract-profile error:", error);
    return Response.json(
      { error: "Failed to extract profile information" },
      { status: 500 }
    );
  }
}
