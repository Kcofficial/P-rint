import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pinCode = searchParams.get('pin')
    const printJobId = searchParams.get('id')

    if (!pinCode && !printJobId) {
      return NextResponse.json({ 
        error: 'PIN code or print job ID is required' 
      }, { status: 400 })
    }

    let printJob

    if (pinCode) {
      printJob = await db.printJob.findUnique({
        where: { pinCode: pinCode },
        include: {
          transactions: true,
          machine: true
        }
      })
    } else if (printJobId) {
      printJob = await db.printJob.findUnique({
        where: { id: printJobId },
        include: {
          transactions: true,
          machine: true
        }
      })
    }

    if (!printJob) {
      return NextResponse.json({ error: 'Print job not found' }, { status: 404 })
    }

    // Check if print job is expired
    if (new Date() > printJob.expiresAt && printJob.status === 'PENDING') {
      await db.printJob.update({
        where: { id: printJob.id },
        data: { status: 'EXPIRED' }
      })
      printJob.status = 'EXPIRED'
    }

    return NextResponse.json({
      success: true,
      printJob: {
        id: printJob.id,
        fileName: printJob.originalName,
        status: printJob.status,
        pinCode: printJob.pinCode,
        createdAt: printJob.createdAt,
        expiresAt: printJob.expiresAt,
        totalPrice: printJob.totalPrice,
        transaction: printJob.transactions,
        machine: printJob.machine
      }
    })

  } catch (error) {
    console.error('Status error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch print job status' 
    }, { status: 500 })
  }
}