import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { printJobId, colorMode, paperSize, copies, duplex, orientation, staples } = await request.json()

    if (!printJobId) {
      return NextResponse.json({ error: 'Print job ID is required' }, { status: 400 })
    }

    // Get pricing based on options
    const pricing = await db.pricing.findFirst({
      where: {
        paperSize: paperSize,
        colorMode: colorMode,
        isActive: true
      }
    })

    if (!pricing) {
      return NextResponse.json({ error: 'Pricing not found for selected options' }, { status: 400 })
    }

    // Calculate total price
    let totalPrice = pricing.pricePerPage * copies
    if (duplex) {
      totalPrice *= 1.5 // 50% extra for duplex
    }
    if (staples) {
      totalPrice += 2000 // Rp 2.000 for staples
    }

    // Auto-routing: Find available printer based on paper size
    const availablePrinter = await db.machine.findFirst({
      where: {
        printerType: paperSize as any, // A4 or F4
        status: 'ONLINE',
        isActive: true,
        paperLevel: {
          gte: 10 // At least 10% paper remaining
        },
        inkLevel: {
          gte: 10 // At least 10% ink remaining
        }
      },
      orderBy: [
        { paperLevel: 'desc' }, // Prefer printer with more paper
        { inkLevel: 'desc' }    // Then prefer printer with more ink
      ]
    })

    if (!availablePrinter) {
      return NextResponse.json({ 
        error: `Tidak ada printer ${paperSize} yang tersedia saat ini. Silakan coba lagi nanti atau pilih ukuran kertas lain.` 
      }, { status: 400 })
    }

    // Update print job with options and assigned printer
    const updatedPrintJob = await db.printJob.update({
      where: { id: printJobId },
      data: {
        colorMode: colorMode,
        paperSize: paperSize,
        copies: copies,
        duplex: duplex,
        staples: staples || false,
        orientation: orientation,
        pricePerPage: pricing.pricePerPage,
        totalPrice: totalPrice,
        machineId: availablePrinter.id
      }
    })

    return NextResponse.json({
      success: true,
      printJob: updatedPrintJob,
      assignedPrinter: {
        id: availablePrinter.id,
        name: availablePrinter.name,
        type: availablePrinter.printerType,
        location: availablePrinter.location
      },
      pricing: {
        pricePerPage: pricing.pricePerPage,
        totalPrice: totalPrice
      }
    })

  } catch (error) {
    console.error('Print options error:', error)
    return NextResponse.json({ 
      error: 'Failed to update print options' 
    }, { status: 500 })
  }
}