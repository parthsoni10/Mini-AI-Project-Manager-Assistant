const { GoogleGenerativeAI } = require("@google/generative-ai");
const { TaskArraySchema } = require("../schemas/taskSchema");

const extractTasks = async (rawText, retryCount = 1) => {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: `You are an AI assistant that extracts actionable tasks from unstructured meeting notes.
Today's date is: ${today}.
For each task, you must extract:
1. "description": A concise, actionable task description.
2. "dueDate": The deadline as a string in YYYY-MM-DD format, or null if not mentioned. If a relative date is mentioned (e.g., 'Friday' or 'next week'), resolve it relative to today's date (${today}).
3. "owner": The name of the person responsible, or null if not specified.
4. "priority": One of "Low", "Medium", or "High". Default to "Medium" unless notes explicitly state the priority or context strongly implies it.
5. "sourceText": The exact text snippet or sentence from the meeting notes that contains the task information.

You must return a JSON object with a single key "tasks", containing an array of task objects.
Format:
{
  "tasks": [
    {
      "description": "task description",
      "dueDate": "YYYY-MM-DD" or null,
      "owner": "Name" or null,
      "priority": "Low" | "Medium" | "High",
      "sourceText": "original sentence"
    }
  ]
}`
  });

  try {
    const result = await model.generateContent(rawText);
    const response = await result.response;
    const responseText = response.text();

    console.log("LLM Response Text:", responseText);

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parsing error on LLM response:", parseError);
      if (retryCount > 0) {
        console.log("Retrying LLM extraction...");
        return await extractTasks(rawText, retryCount - 1);
      }
      throw new Error("Failed to parse LLM response as JSON.");
    }

    // Validate with Zod
    const validated = TaskArraySchema.safeParse(parsed);
    if (!validated.success) {
      console.error("Zod validation error:", validated.error);
      if (retryCount > 0) {
        console.log("Retrying LLM extraction due to Zod validation failure...");
        return await extractTasks(rawText, retryCount - 1);
      }
      throw new Error("LLM output did not conform to the expected task schema.");
    }

    return validated.data.tasks;
  } catch (error) {
    console.error("Error in llmService.extractTasks:", error);
    throw error;
  }
};

module.exports = {
  extractTasks,
};
