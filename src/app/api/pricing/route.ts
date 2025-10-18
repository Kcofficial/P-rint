import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const pricingList = await db.pricing.findMany({
      where: { isActive: true },
      orderBy: [
        { paperSize: 'asc' },
        { colorMode: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      pricing: pricingList
    })

  } catch (error) {
    console.error('Pricing error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch pricing' 
    }, { status: 500 })
  }
}