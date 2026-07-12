import { generateText } from "ai";
import { provider, EXTRACT_MODEL } from "@/lib/ai";

interface ExtractedProfile {
  gpa: number;
  intendedMajor: string;
  interests: string[];
  gradeLevel?: "8th" | "freshman" | "sophomore" | "junior" | "senior" | "gap-year" | "college";
  currentActivities?: {
    name: string;
    type: "club" | "sport" | "volunteer" | "work" | "research" | "art" | "other";
    leadership: boolean;
  }[];
  careerGoal?: string;
  apCourses?: string[];
}

const EMPTY_RESULT: ExtractedProfile = {
  gpa: 0,
  intendedMajor: "",
  interests: [],
};

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return Response.json({ error: "Missing 'text' field" }, { status: 400 });
  }

  if (text.length > 2000) {
    return Response.json({ error: "Text too long (max 2000 chars)" }, { status: 400 });
  }

  try {
    const { text: raw } = await generateText({
      model: provider.chat(EXTRACT_MODEL),
      system: `You are a helpful college admissions assistant. Extract academic profile information from the student's self-description.

You MUST respond with valid JSON only — no markdown, no explanation, no wrapping.

Schema:
{
  "gpa": number (0-5, 0 if not mentioned),
  "intendedMajor": string (empty string if not mentioned),
  "interests": string[] (specific interests like "programming", "biology"; empty array if none),
  "gradeLevel": "8th" | "freshman" | "sophomore" | "junior" | "senior" | "gap-year" | "college" (omit if not mentioned),
  "currentActivities": [{ "name": string, "type": "club"|"sport"|"volunteer"|"work"|"research"|"art"|"other", "leadership": boolean }] (omit if none),
  "careerGoal": string (omit if not mentioned),
  "apCourses": string[] (omit if none)
}

Rules:
- Only extract information that is explicitly stated or very clearly implied.
- Do NOT guess or fabricate values.
- For GPA, convert to a 4.0 scale if another scale is mentioned.
- For gradeLevel, only set it if the student explicitly mentions their grade or year.
- Interests should be specific (e.g., "programming" not "STEM").
- Return ONLY the JSON object, nothing else.`,
      prompt: text,
      temperature: 0.1,
    });

    const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<ExtractedProfile>;

    const result: ExtractedProfile = {
      gpa: typeof parsed.gpa === "number" && parsed.gpa >= 0 && parsed.gpa <= 5 ? parsed.gpa : 0,
      intendedMajor: typeof parsed.intendedMajor === "string" ? parsed.intendedMajor : "",
      interests: Array.isArray(parsed.interests) ? parsed.interests.filter((i): i is string => typeof i === "string") : [],
    };

    if (parsed.gradeLevel && ["8th", "freshman", "sophomore", "junior", "senior", "gap-year", "college"].includes(parsed.gradeLevel)) {
      result.gradeLevel = parsed.gradeLevel;
    }
    if (Array.isArray(parsed.currentActivities)) {
      result.currentActivities = parsed.currentActivities.filter(
        (a) => a && typeof a.name === "string" && ["club", "sport", "volunteer", "work", "research", "art", "other"].includes(a.type)
      );
    }
    if (typeof parsed.careerGoal === "string" && parsed.careerGoal) {
      result.careerGoal = parsed.careerGoal;
    }
    if (Array.isArray(parsed.apCourses)) {
      result.apCourses = parsed.apCourses.filter((c): c is string => typeof c === "string");
    }

    return Response.json(result);
  } catch (error) {
    console.error("AI extract-profile error:", error);
    return Response.json(
      { error: "Failed to extract profile information", detail: String(error) },
      { status: 500 }
    );
  }
}
