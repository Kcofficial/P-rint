import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create pricing data
  const pricingData = [
    { paperSize: 'A4', colorMode: 'BW', pricePerPage: 500 },
    { paperSize: 'A4', colorMode: 'COLOR', pricePerPage: 2000 },
    { paperSize: 'F4', colorMode: 'BW', pricePerPage: 750 },
    { paperSize: 'F4', colorMode: 'COLOR', pricePerPage: 3000 },
    { paperSize: 'A3', colorMode: 'BW', pricePerPage: 1000 },
    { paperSize: 'A3', colorMode: 'COLOR', pricePerPage: 4000 }
  ]

  for (const pricing of pricingData) {
    await prisma.pricing.create({
      data: pricing
    })
  }

  // Create machine data
  const machinesData = [
    {
      name: 'P-rint Kampus A',
      location: 'Jakarta',
      address: 'Jl. Kampus Utama No. 123, Jakarta',
      latitude: -6.2088,
      longitude: 106.8456,
      status: 'ONLINE',
      paperLevel: 85,
      inkLevel: 70,
      openTime: '07:00',
      closeTime: '21:00',
      dailyPrintCount: 45
    },
    {
      name: 'P-rint Co-Work Space',
      location: 'Jakarta Selatan',
      address: 'Jl. Sudirman No. 456, Jakarta Selatan',
      latitude: -6.2297,
      longitude: 106.8295,
      status: 'ONLINE',
      paperLevel: 60,
      inkLevel: 45,
      openTime: '08:00',
      closeTime: '22:00',
      dailyPrintCount: 32
    },
    {
      name: 'P-rint Perpustakaan',
      location: 'Jakarta Pusat',
      address: 'Jl. Literasi No. 789, Jakarta Pusat',
      latitude: -6.1944,
      longitude: 106.8229,
      status: 'MAINTENANCE',
      paperLevel: 30,
      inkLevel: 25,
      openTime: '09:00',
      closeTime: '20:00',
      dailyPrintCount: 28
    },
    {
      name: 'P-rint Mall Central',
      location: 'Jakarta Barat',
      address: 'Jl. Mall Central No. 100, Jakarta Barat',
      latitude: -6.1751,
      longitude: 106.8650,
      status: 'ONLINE',
      paperLevel: 95,
      inkLevel: 88,
      openTime: '10:00',
      closeTime: '23:00',
      dailyPrintCount: 67
    },
    {
      name: 'P-rint Station Bandara',
      location: 'Tangerang',
      address: 'Terminal 2D, Bandara Soekarno-Hatta',
      latitude: -6.1256,
      longitude: 106.6558,
      status: 'ONLINE',
      paperLevel: 78,
      inkLevel: 62,
      openTime: '24 Jam',
      closeTime: '24 Jam',
      dailyPrintCount: 89
    }
  ]

  for (const machine of machinesData) {
    await prisma.machine.create({
      data: machine
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })