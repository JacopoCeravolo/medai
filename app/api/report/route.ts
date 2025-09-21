import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPromptTemplate } from "@/lib/services/langfuseService";
import { generateReportContent } from "@/lib/services/geminiService";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = verifyToken(token);
    } catch (_error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { title, content, reportType, docName, informazioni, note } = await request.json();

    // Validate input
    if (!title || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    if (!reportType || !docName || !informazioni || !note) {
      return NextResponse.json(
        { error: "All report fields are required" },
        { status: 400 }
      );
    }

    // Generate AI content if reportType is REFERTO
    let finalContent = content;
    if (reportType === "REFERTO") {
      try {
        // Get prompt template from Langfuse
        const promptTemplate = await getPromptTemplate("generazione-referto", {
          patient_name: docName,
          patient_info: informazioni,
          notes: note,
          date: new Date().toISOString(),
        });

        // Generate content using Gemini
        const generatedContent = await generateReportContent(
          promptTemplate.messages.length > 0 
            ? promptTemplate.messages 
            : JSON.stringify(promptTemplate)
        );

        // TODO: Add logging back when logGeneration is implemented

        finalContent = generatedContent;
      } catch (aiError) {
        console.error("AI generation failed, using original content:", aiError);
        // Continue with original content if AI generation fails
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
        });

        // Generate content using Gemini
        const generatedContent = await generateReportContent(
          promptTemplate.messages.length > 0 
            ? promptTemplate.messages 
            : JSON.stringify(promptTemplate)
        );

        // TODO: Add logging back when logGeneration is implemented

        finalContent = generatedContent;
      } catch (aiError) {
        console.error("AI generation failed, using original content:", aiError);
        // Continue with original content if AI generation fails
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
        });

        // Generate content using Gemini
        const generatedContent = await generateReportContent(
          promptTemplate.messages.length > 0 
            ? promptTemplate.messages 
            : JSON.stringify(promptTemplate)
        );

        // TODO: Add logging back when logGeneration is implemented

        finalContent = generatedContent;
      } catch (aiError) {
        console.error("AI generation failed, using original content:", aiError);
        // Continue with original content if AI generation fails
      }
    }

    // TODO: fail if no report matches

    // Store content in Vercel Blob and wait for it to be fully available
    const blobFileName = `reports/${decoded?.userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    const { url: blobUrl } = await put(blobFileName, finalContent, { 
      access: 'public' 
    });

    // Verify blob is accessible before proceeding with database save
    // This ensures the content is available when React Query refetches
    const verifyBlob = async (url: string, retries = 3, delay = 100): Promise<boolean> => {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if we got a valid response
        const content = await response.text();
        if (content.length > 0) {
          return true;
        }
        
        throw new Error('Empty blob content');
      } catch (error) {
        if (retries === 0) {
          console.error('Failed to verify blob after retries:', error);
          return false;
        }
        
        console.log(`Retrying blob verification (${retries} attempts left)...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return verifyBlob(url, retries - 1, delay * 2);
      }
    };
    
    const isBlobAccessible = await verifyBlob(blobUrl);
    if (!isBlobAccessible) {
      throw new Error('Failed to verify blob accessibility after retries');
    }

    // Now save report to database - blob content is guaranteed to be available
    const report = await prisma.report.create({
      data: {
        title,
        blobUrl,
        reportType,
        docName,
        informazioni,
        note,
        userId: decoded!.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        title: report.title,
        blobUrl: report.blobUrl,
        reportType: report.reportType,
        docName: report.docName,
        informazioni: report.informazioni,
        note: report.note,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        user: report.user,
      },
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = verifyToken(token);
    } catch (_error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user's reports
    const reports = await prisma.report.findMany({
      where: {
        userId: decoded?.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
