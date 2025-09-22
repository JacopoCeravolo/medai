import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { generateReportContentByType } from "../utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params;
    
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

    // Get the specific report
    const report = await prisma.report.findFirst({
      where: {
        id,
        userId: decoded?.userId, // Ensure user can only access their own reports
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

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Fetch content from blob
    let content = "";
    try {
      const response = await fetch(report.blobUrl);
      if (response.ok) {
        content = await response.text();
      }
    } catch (error) {
      console.error("Error fetching blob content:", error);
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        title: report.title,
        content,
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
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params;

    // Get the authorization header and verify token
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

    // Parse request body for new content
    const { body } = await request.json();

    if (!body) {
      return NextResponse.json({ error: "Content must be provided" }, { status: 400 });
    }

    // Find the original report to get the blob URL
    const originalReport = await prisma.report.findFirst({
      where: {
        id,
        userId: decoded?.userId,
      },
    });

    if (!originalReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Extract the blob filename from the URL
    const blobFileName = originalReport.blobUrl.split('/').slice(3).join('/');
    if (!blobFileName) {
        return NextResponse.json({ error: "Invalid blob URL" }, { status: 500 });
    }

    const previousContent = await fetch(originalReport.blobUrl).then((res) => res.text());

    let newContent = previousContent;

    if (body.regenerate) {

      newContent = await generateReportContentByType({
        reportType: body.reportType,
        docName: body.docName,
        informazioni: body.informazioni,
        note: body.note,
        content: previousContent,
        previousContent: body.previousContent,
      });
      
    } else {
      if (typeof body.content !== 'string') {
        return NextResponse.json({ error: "Content must be a string" }, { status: 400 });
      }
      newContent = body.content;
    }


    // Overwrite the blob with the new content
    const { url: newBlobUrl } = await put(blobFileName, newContent, { 
      access: 'public',
      addRandomSuffix: false, // Important to overwrite the same file
      allowOverwrite: true,
    });

    // Update the report's updatedAt timestamp and blob URL in the database
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        blobUrl: newBlobUrl, // The URL might change slightly, so update it
        updatedAt: new Date(),
        reportType: body.regenerate ? body.reportType : originalReport.reportType,
        docName: body.regenerate ? body.docName : originalReport.docName,
        informazioni: body.regenerate ? body.informazioni : originalReport.informazioni,
        note: body.regenerate ? body.note : originalReport.note,
      },
    });

    return NextResponse.json({
      success: true,
      report: {
        id: updatedReport.id,
        blobUrl: updatedReport.blobUrl,
        updatedAt: updatedReport.updatedAt,
      },
    });
    
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
