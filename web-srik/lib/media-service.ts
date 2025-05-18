const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000';

export interface UploadResponse {
  success: boolean;
  urls?: {
    original: string;
    thumbnail?: string;
  };
  filename?: string;
  type?: 'image' | 'video';
  error?: string;
}

export async function uploadFiles(files: File[]): Promise<UploadResponse[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files[]', file);
  });

  try {
    const response = await fetch(`${FLASK_API_URL}/upload_file`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from Flask:', data);
    return data;
  } catch (error) {
    console.error('Error uploading files:', error);
    return [{
      success: false,
      error: error instanceof Error ? error.message : 'Error uploading files'
    }];
  }
}

export async function deleteFile(filename: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${FLASK_API_URL}/delete/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error deleting file'
    };
  }
}
