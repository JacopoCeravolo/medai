import { LangfuseClient } from "@langfuse/client";
 

// Initialize Langfuse client
const langfuse = new LangfuseClient({
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL || "https://cloud.langfuse.com",
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PromptTemplate {
  name: string;
  version?: number;
  variables: Record<string, string>;
  messages: ChatMessage[];
}

export type GeminiPrompt = string | ChatMessage[] | PromptTemplate;

export async function getPromptTemplate(
  promptName: string,
  variables: Record<string, string>
): Promise<PromptTemplate> {
  try {
    // Get the prompt template from Langfuse
    const prompt = await langfuse.prompt.get(promptName, {
      label: "latest",
      type: "chat",
    }); 
    
    if (!prompt) {
      throw new Error(`Prompt template '${promptName}' not found in Langfuse`);
    }

    // Convert the prompt to the expected format
    const compiledPrompt: PromptTemplate = {
      name: promptName,
      variables,
      messages: Array.isArray(prompt) 
        ? prompt.map(msg => ({
            role: msg.role || 'user',
            content: msg.content || String(msg)
          }))
        : [{
            role: 'user',
            content: typeof prompt === 'string' ? prompt : JSON.stringify(prompt)
          }]
    };

    console.log("Processed prompt template:", compiledPrompt);
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
