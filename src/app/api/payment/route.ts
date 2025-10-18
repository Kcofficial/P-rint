import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { printJobId, paymentMethod, amount } = await request.json()

    if (!printJobId || !paymentMethod || !amount) {
      return NextResponse.json({ 
        error: 'Print job ID, payment method, and amount are required' 
      }, { status: 400 })
    }

    // Get print job
    const printJob = await db.printJob.findUnique({
      where: { id: printJobId }
    })

    if (!printJob) {
      return NextResponse.json({ error: 'Print job not found' }, { status: 404 })
    }

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        printJobId: printJobId,
        amount: amount,
        paymentMethod: paymentMethod,
        paymentStatus: 'PENDING'
      }
    })

    // Update print job with transaction ID
    await db.printJob.update({
      where: { id: printJobId },
      data: { 
        transactionId: transaction.id,
        status: 'PAID'
      }
    })

    // Simulate payment processing (in real app, integrate with payment gateway)
    let paymentStatus = 'SUCCESS'
    let paymentId = `PAY-${Date.now()}`

    // Update transaction status
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentStatus: paymentStatus,
        paymentId: paymentId
      }
    })

    // Update print job status to queued
    await db.printJob.update({
      where: { id: printJobId },
      data: { status: 'QUEUED' }
    })

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: amount,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        paymentId: paymentId
      },
      printJob: {
        id: printJob.id,
        pinCode: printJob.pinCode,
        status: 'QUEUED'
      }
    })

  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ 
      error: 'Failed to process payment' 
    }, { status: 500 })
  }
}