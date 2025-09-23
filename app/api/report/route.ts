import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { generateReportContentByType } from "./utils";
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
    const { title, reportType, docName, informazioni, note } = await request.json();

    // Validate input
    if (!title || !reportType || informazioni.trim().length === 0) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate AI content based on report type
    let finalContent = "";
    try {
      finalContent = await generateReportContentByType({
      reportType,
      docName,
      informazioni,
      note,
    });
    } catch (error) {
      console.error("AI generation failed, using original content:", error);
      return NextResponse.json(
        { error: "Modello non disponibile, riprovare fra qualche secondo" },
        { status: 500 }
      );
    }

    // Store content in Vercel Blob and wait for it to be fully available
    const blobFileName = `reports/${decoded?.userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    const { url: blobUrl } = await put(blobFileName, finalContent, { 
      access: 'public' 
    });

    // Verify blob is accessible before proceeding with database save
    // This ensures the content is available when React Query refetches
    const verifyBlob = async (url: string, retries = 5, delay = 200): Promise<boolean> => {
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

    console.log("Blob verified successfully");

    console.log("Saving report to database...");
    console.log("Title:", title);
    console.log("Report type:", reportType);
    console.log("Doc name:", docName);
    console.log("Informazioni:", informazioni);
    console.log("Note:", note);
    console.log("User ID:", decoded?.userId);

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
    console.log("Report created:", report);

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
