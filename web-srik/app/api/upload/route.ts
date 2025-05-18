import { NextRequest, NextResponse } from 'next/server'
import { uploadFiles } from '@/lib/media-service'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('file') as File[]
    
    const results = await uploadFiles(files)

    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
}
