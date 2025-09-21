import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, password } = await request.json();

    // Validate input
    if (!firstName || !lastName || !password) {
      return NextResponse.json(
        { error: 'First name, last name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.getUserByName(firstName, lastName);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this name already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await db.createUser(firstName, lastName, hashedPassword);

    // Generate JWT token
    const token = generateToken({
      userId: (result as any).lastID as number,
      firstName,
      lastName,
    });

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: (result as any).lastID,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
