import { NextResponse } from 'next/server';
import { uploadFiles } from '@/lib/media-service';

export async function GET() {
  // Return instructions for testing
  return NextResponse.json({
    message: "To test uploads, send a POST request with a FormData containing 'files[]'",
    example: "curl -X POST -F 'files[]=@test.jpg' http://localhost:3000/api/upload-test"
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files[]') as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const results = await uploadFiles(files);
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Error in test upload:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
