import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function POST(request) {
  try {
    // Check authentication using session
    const token = await getSession();
    if (!token) {
      return NextResponse.json({ 
        error: 'Authentication required. Please log in.' 
      }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Please upload files smaller than 10MB.' 
      }, { status: 400 });
    }

    // Create form data for external API
    const externalFormData = new FormData();
    externalFormData.append('file', file);

    // Forward to external API with authorization header
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/cv/upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Use token from session
      },
      body: externalFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('External API error:', errorData);
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json({ 
          error: 'Authentication failed. Please log in again.' 
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to process CV. Please try again.' 
      }, { status: 500 });
    }

    const result = await response.json();
    
    // Return the successful response from external API
    return NextResponse.json(result);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 });
  }
}