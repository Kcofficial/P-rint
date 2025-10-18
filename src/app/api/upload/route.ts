import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 })
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not supported. Please upload PDF, DOCX, PPTX, JPG, or PNG' 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFileName)

    // Convert file to bytes and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate PIN code
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Save to database
    const printJob = await db.printJob.create({
      data: {
        fileName: uniqueFileName,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        filePath: `/uploads/${uniqueFileName}`,
        pinCode: pinCode,
        totalPages: 1, // Will be calculated later
        pricePerPage: 500, // Default price
        totalPrice: 500, // Will be calculated based on options
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      }
    })

    return NextResponse.json({
      success: true,
      printJob: {
        id: printJob.id,
        fileName: printJob.originalName,
        fileSize: printJob.fileSize,
        pinCode: printJob.pinCode,
        uploadedAt: printJob.createdAt
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file' 
    }, { status: 500 })
  }
}