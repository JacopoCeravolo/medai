import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export async function generateContent(
  prompt: string,
  config: GenerationConfig = {}
): Promise<string> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: config.temperature || 0.7,
        topK: config.topK || 40,
        topP: config.topP || 0.95,
        maxOutputTokens: config.maxOutputTokens || 2048,
      },
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No content generated from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error(`Failed to generate content: ${error}`);
  }
}

export async function generateReportContent(
  promptTemplate: any
): Promise<string> {
  try {
    // Convert chat format from Langfuse to single string for Gemini
    let finalPrompt = "";
    
    if (typeof promptTemplate === 'string') {
      finalPrompt = promptTemplate;
    } else if (Array.isArray(promptTemplate)) {
      // Handle chat format: concatenate system and user messages
      finalPrompt = promptTemplate
        .map((message: any) => {
          if (message.role === 'system') {
            return `System: ${message.content}`;
          } else if (message.role === 'user') {
            return `User: ${message.content}`;
          }
          return message.content || message;
        })
        .join('\n\n');
    } else {
      // Fallback: try to stringify
      finalPrompt = JSON.stringify(promptTemplate);
    }

    console.log("Final prompt for Gemini:", finalPrompt);

    // Generate content with specific config for medical reports
    const generatedContent = await generateContent(finalPrompt, {
      temperature: 0.3, // Lower temperature for more consistent medical content
      maxOutputTokens: 4096, // Allow longer reports
    });

    return generatedContent;
  } catch (error) {
    console.error('Error generating report content:', error);
    throw error;
  }
}
