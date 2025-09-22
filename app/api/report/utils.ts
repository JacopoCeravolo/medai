import { getPromptTemplate } from "@/lib/services/langfuseService";
import { generateReportContent } from "@/lib/services/geminiService";

type GenerateReportContentParams = {
  reportType: string;
  docName: string;
  informazioni: string;
  note: string;
  content: string;
  previousContent?: string;
};

export async function generateReportContentByType({
  reportType,
  docName,
  informazioni,
  note,
  content,
  previousContent = "",
}: GenerateReportContentParams): Promise<string> {
  if (reportType === "REFERTO") {
    try {
      // Get prompt template from Langfuse
      const promptTemplate = await getPromptTemplate("generazione-referto", {
        patient_name: docName,
        patient_info: informazioni,
        notes: note,
        date: new Date().toISOString(),
        previous: previousContent,
      });

      // Generate content using Gemini
      const generatedContent = await generateReportContent(
        promptTemplate.messages.length > 0 
          ? promptTemplate.messages 
          : JSON.stringify(promptTemplate)
      );

      // TODO: Add logging back when logGeneration is implemented
      return generatedContent;
    } catch (aiError) {
      console.error("AI generation failed, using original content:", aiError);
      return content;
    }
  }
  
  if (reportType === "NOTA") {
    try {
      // Get prompt template from Langfuse
      const promptTemplate = await getPromptTemplate("generazione-nota", {
        patient_name: docName,
        patient_info: informazioni,
        notes: note,
        date: new Date().toISOString(),
        previous: previousContent,
      });

      // Generate content using Gemini
      const generatedContent = await generateReportContent(
        promptTemplate.messages.length > 0 
          ? promptTemplate.messages 
          : JSON.stringify(promptTemplate)
      );

      // TODO: Add logging back when logGeneration is implemented
      return generatedContent;
    } catch (aiError) {
      console.error("AI generation failed, using original content:", aiError);
      return content;
    }
  }
  
  if (reportType === "ESAME") {
    try {
      // Get prompt template from Langfuse
      const promptTemplate = await getPromptTemplate("generazione-esame", {
        patient_name: docName,
        patient_info: informazioni,
        notes: note,
        date: new Date().toISOString(),
        previous: previousContent,
      });

      // Generate content using Gemini
      const generatedContent = await generateReportContent(
        promptTemplate.messages.length > 0 
          ? promptTemplate.messages 
          : JSON.stringify(promptTemplate)
      );

      // TODO: Add logging back when logGeneration is implemented
      return generatedContent;
    } catch (aiError) {
      console.error("AI generation failed, using original content:", aiError);
      return content;
    }
  }
  
  // If no matching report type, return the original content
  return content;
}