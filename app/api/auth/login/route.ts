import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/database';
import { verifyPassword, generateToken } from '@/lib/auth';

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

    // Find user
    const user = await db.getUserByName(firstName, lastName);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, (user as any).password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: (user as any).id,
      firstName: (user as any).first_name,
      lastName: (user as any).last_name,
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: (user as any).id,
        firstName: (user as any).first_name,
        lastName: (user as any).last_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
