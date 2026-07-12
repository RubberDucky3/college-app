import { streamText } from "ai";
import { provider, MENTOR_MODEL } from "@/lib/ai";
import { generateTasks, tasksToAIContext } from "@/lib/task-engine";
import type { StudentGraph } from "@/types/student-graph";

export async function POST(request: Request) {
  const { messages, studentContext, studentGraph } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "Missing 'messages' array" }, { status: 400 });
  }

  // Build system prompt with student context
  const contextBlocks: string[] = [];

  if (studentContext?.firstName) {
    contextBlocks.push(`Student name: ${studentContext.firstName}`);
  }
  if (studentContext?.track) {
    contextBlocks.push(`Track: ${studentContext.track}`);
  }
  if (studentContext?.gradeLevel) {
    contextBlocks.push(`Grade level: ${studentContext.gradeLevel}`);
  }
  if (studentContext?.gpa && studentContext.gpa > 0) {
    contextBlocks.push(`GPA: ${studentContext.gpa}`);
  }
  if (studentContext?.intendedMajor) {
    contextBlocks.push(`Intended major: ${studentContext.intendedMajor}`);
  }
  if (studentContext?.dreamSchools?.length > 0) {
    contextBlocks.push(`Dream schools: ${studentContext.dreamSchools.join(", ")}`);
  }
  if (studentContext?.extracurriculars?.length > 0) {
    contextBlocks.push(
      `Activities (${studentContext.extracurriculars.length}): ${studentContext.extracurriculars.map((ec: { name: string }) => ec.name).join(", ")}`
    );
  }
  if (studentContext?.interests?.length > 0) {
    contextBlocks.push(`Interests: ${studentContext.interests.join(", ")}`);
  }

  let taskContext = "";
  if (studentGraph && typeof studentGraph === "object") {
    try {
      const graph = studentGraph as StudentGraph;
      const summary = generateTasks(graph);
      taskContext = tasksToAIContext(summary);
    } catch {
      // malformed graph — skip task context
    }
  }

  const systemPrompt = `You are a knowledgeable and encouraging college admissions coach. You have access to a student's profile information and provide personalized guidance.

Student Profile:
${contextBlocks.length > 0 ? contextBlocks.join("\n") : "No profile data available yet."}
${taskContext ? `\nStudent Task Status:\n${taskContext}` : ""}

Guidelines:
- Be encouraging but honest about admissions competitiveness.
- Provide specific, actionable advice based on the student's profile.
- When discussing reach/match/safety schools, use the student's GPA and test scores.
- Proactively reference the student's current tasks and deadlines when giving advice.
- Suggest activities, courses, and improvements relevant to their interests.
- Keep responses concise (2-4 paragraphs max) and conversational.
- If you don't know something, say so rather than guessing.
- Never share or fabricate specific admissions statistics for schools.
- End with a question to keep the conversation going.`;

  try {
    const result = streamText({
      model: provider.chat(MENTOR_MODEL),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI mentor error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
