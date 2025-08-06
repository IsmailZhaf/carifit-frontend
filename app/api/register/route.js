import { NextResponse } from 'next/server';
import { createSessionResponse } from '@/lib/auth/session';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await backendResponse.json();

    // If the backend request failed, return the error
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: backendResponse.status }
      );
    }

    // Create response with secure session cookie
    const response = NextResponse.json(
      { 
        message: data.message,
        user: data.user || { name, email },
        success: true
      }, 
      { status: 201 }
    );

    // Set secure HTTP-only cookie with the token
    return createSessionResponse(response, data.token);

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 