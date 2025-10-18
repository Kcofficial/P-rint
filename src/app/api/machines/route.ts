import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const machines = await db.machine.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      machines: machines
    })

  } catch (error) {
    console.error('Machines error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch machines' 
    }, { status: 500 })
  }
}