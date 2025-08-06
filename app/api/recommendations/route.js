import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function GET(request) {
  try {
    const token = await getSession();
    
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return NextResponse.json(
        { error: 'API_URL environment variable is not configured' },
        { status: 500 }
      );
    }

    
    let apiUrl = process.env.NEXT_PUBLIC_API_URL + '/api/matching/recommendations';
    
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          { error: 'Invalid limit parameter. Must be a positive integer.' },
          { status: 400 }
        );
      }
      apiUrl += `?limit=${parsedLimit}`;
    }


    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }


    const backendResponse = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });


    if (!backendResponse.ok) {
      let errorMessage = 'Failed to fetch recommendations';
      let errorData = null;
      
      try {
        errorData = await backendResponse.json();
        errorMessage = errorData.message || errorMessage;
        console.log('Error data from backend:', errorData);
      } catch (e) {
        errorMessage = backendResponse.statusText || errorMessage;
        console.log('Error parsing backend response:', e.message);
      }
      
      if (backendResponse.status === 404 && errorData && 
          (errorData.message?.toLowerCase().includes('no job recommendations') || 
           errorData.message?.toLowerCase().includes('no recommendations'))) {
        return NextResponse.json(
          { 
            message: errorData.message || 'No job recommendations available',
            data: [],
            success: true
          }, 
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    const transformedData = Array.isArray(backendData) ? backendData.map((item, index) => {
      
      const job = item.job;
      
      const transformed = {
        id: job.job_hash || job.job_id || job.id || `job-${index}`,
        title: job.job_title || 'Untitled Position',
        company: job.company_name || 'Unknown Company',
        location: job.location || 'Location not specified',
        matchPercentage: item.match_score || 0,
        postedDate: job.date_posted || "Recently posted",
        skills: Array.isArray(job.required_skills) ? job.required_skills : 
                typeof job.required_skills === 'string' ? job.required_skills.split(',').map(s => s.trim()) : 
                [],
        description: job.job_description || job.company_desc || "No description available",
        industry: job.company_industry || 'Technology',
        employeeSize: job.company_employee_size || 'Not specified',
        jobHash: job.job_hash,
        logo: job.company_logo,
        url: job.url,
        matchedSkills: Array.isArray(item.matched_skills) ? item.matched_skills : [],
        matchReason: item.reason || ''
      };
      
      return transformed;
    }) : [];


    return NextResponse.json(
      { 
        message: 'Recommendations fetched successfully',
        data: transformedData,
        success: true
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Recommendations API error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}