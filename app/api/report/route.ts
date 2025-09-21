import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { title, content } = await request.json();

    // Validate input
    if (!title || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Store content in Vercel Blob
    const blobFileName = `reports/${decoded?.userId}/${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
    const { url: blobUrl } = await put(blobFileName, content, { 
      access: 'public' 
    });

    // Save report to database
    const report = await prisma.report.create({
      data: {
        title,
        blobUrl,
        userId: decoded?.userId,
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
    } catch (error) {
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
