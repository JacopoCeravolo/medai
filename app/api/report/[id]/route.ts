import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    } catch (error) {
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
