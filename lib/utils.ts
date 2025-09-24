import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AppError, ErrorCode } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new AppError(code as ErrorCode, cause);
  }

  return response.json();
};


export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

export function convertToUIMessages(messages: any[]): UIMessage[] {
  if (!messages || !Array.isArray(messages)) return [];
  
  return messages.map(message => ({
    id: message.id || generateUUID(),
    role: message.role || 'user',
    content: message.content || '',
    createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
  }));
}