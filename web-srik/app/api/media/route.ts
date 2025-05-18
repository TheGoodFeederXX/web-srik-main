import { NextRequest } from 'next/server';

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`${FLASK_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Error in upload route:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return Response.json(
        { success: false, error: 'No filename provided' },
        { status: 400 }
      );
    }

    const response = await fetch(`${FLASK_API_URL}/delete/${filename}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return Response.json(data);
    
  } catch (error) {
    console.error('Error in delete route:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
