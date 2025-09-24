import "server-only";

import {
  eq,
  gt,
  lt,
  type SQL,
} from "drizzle-orm";
import { prisma as db } from "../prisma";
import { generateHashedPassword } from "./utils";
import { generateUUID } from "../utils";
import { AppError } from "../errors";
import {
    document,
    type Document,
    user,
    type User,
  } from "./schema";

export async function getUserByName(firstName: string, lastName: string): Promise<User[]> {
    try {
    const user = await db.user.findMany({
      where: {
        firstName,
        lastName,
      },
    });
    
    return user;
    } catch (_error) {
      throw new AppError(
        "bad_request:database",
        "Failed to get user by name"
      );
    }
}

export async function createUser(firstName: string, lastName: string, password: string) {
    const hashedPassword = generateHashedPassword(password);
  
    try {
        const user = await db.user.create({
            data: {
              firstName,
              lastName,
              password: hashedPassword,
            },
        });
          
        return { id: user.id };
    } catch (_error) {
      throw new AppError("bad_request:database", "Failed to create user");
    }
}

export async function createGuestUser() {
    const firstName = `guestname-${Date.now()}`;
    const lastName = `guestlast-${Date.now()}`;

    const password = generateHashedPassword(generateUUID());
  
    try {
        const user = await db.user.create({
            data: {
              firstName,
              lastName,
              password,
            },
        });
      
        return { id: user.id };
    } catch (_error) {
      throw new AppError(
        "bad_request:database",
        "Failed to create guest user"
      );
    }
    
}

export async function getDocumentsByUserId({
    id,
    limit,
    startingAfter,
    endingBefore,
  }: {
    id: string;
    limit: number;
    startingAfter: string | null;
    endingBefore: string | null;
  }) {
    try {
      const extendedLimit = limit + 1;
  
      const query = (whereCondition?: SQL<any>) =>
        db
          .report
          .findMany(
            {
              where: {
                userId: id,
              },
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                reportType: true,
                userId: true,
              },
              take: extendedLimit,
            }
          );

        const documents = await query();
        console.log(documents);
  
      let filteredDocuments: Document[] = [];
  
      if (startingAfter) {
        const selectedDocument = await db
          .report
          .findUnique({
            where: {
              id: startingAfter,
            },
          });
  
        if (!selectedDocument) {
          throw new AppError(
            "not_found:database",
            `Document with id ${startingAfter} not found`
          );
        }
  
        filteredDocuments = await query(gt(document.createdAt, selectedDocument.createdAt)).map((document) => ({
          id: document.id,
          title: document.title,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
          reportType: document.reportType,
          userId: document.userId,
        }));
      } else if (endingBefore) {
        const selectedDocument = await db
          .report
          .findUnique({
            where: {
              id: endingBefore,
            },
          });
  
        if (!selectedDocument) {
          throw new AppError(
            "not_found:database",
            `Document with id ${endingBefore} not found`
          );
        }
  
        filteredDocuments = await query(lt(document.createdAt, selectedDocument.createdAt));
      } else {
        filteredDocuments = await query();
      }
  
      const hasMore = filteredDocuments.length > limit;
  
      return {
        /* documents: hasMore ? filteredDocuments.slice(0, limit) : filteredDocuments, */
        documents: documents,
        hasMore,
      };
    } catch (_error) {
      throw new AppError(
        "bad_request:database",
        "Failed to get documents by user id"
      );
    }
  }