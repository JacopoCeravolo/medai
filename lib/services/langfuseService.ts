import { LangfuseClient } from "@langfuse/client";
 

// Initialize Langfuse client
const langfuse = new LangfuseClient({
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL || "https://cloud.langfuse.com",
});

export interface PromptTemplate {
  name: string;
  version?: number;
  variables: Record<string, string>;
}

export async function getPromptTemplate(
  promptName: string,
  variables: Record<string, string>
): Promise<any> {
  try {
    // Get the prompt template from Langfuse
    const prompt = await langfuse.prompt.get(promptName, {
      label: "latest",
      type: "chat",
    }); 
    
    if (!prompt) {
      throw new Error(`Prompt template '${promptName}' not found in Langfuse`);
    }

    // Insert variables into chat prompt template
    const compiledPrompt = prompt.compile(variables);

    console.log("compiledPrompt", compiledPrompt);

    return compiledPrompt;
  } catch (error) {
    console.error('Error fetching prompt from Langfuse:', error);
    throw new Error(`Failed to fetch prompt template: ${error}`);
  }
}

/* export async function logGeneration(
  promptName: string,
  input: string,
  output: string,
  metadata?: Record<string, any>
) {
  try {
    const trace = langfuse.trace.create({
      name: "report-generation",
      metadata: {
        promptName,
        ...metadata,
      },
    });

    trace.generation({
      name: promptName,
      input,
      output,
      model: "gemini-pro",
    });

    await langfuse.flushAsync();
  } catch (error) {
    console.error('Error logging to Langfuse:', error);
    // Don't throw here to avoid breaking the main flow
  }
} */
