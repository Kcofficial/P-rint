'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Printer, 
  DollarSign, 
  FileText,
  RotateCw,
  CreditCard
} from 'lucide-react'

interface PrintOptionsProps {
  printJob: any
  onOptionsUpdated: (options: any) => void
  onProceed: () => void
}

export default function PrintOptions({ printJob, onOptionsUpdated, onProceed }: PrintOptionsProps) {
  const [options, setOptions] = useState({
    colorMode: 'BW',
    paperSize: 'A4',
    copies: 1,
    duplex: false,
    orientation: 'PORTRAIT',
    staples: false
  })
  
  const [pricing, setPricing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetchPricing()
  }, [])

  useEffect(() => {
    calculatePrice()
  }, [options, pricing])

  const fetchPricing = async () => {
    try {
      const response = await fetch('/api/pricing')
      const result = await response.json()
      if (result.success) {
        setPricing(result.pricing)
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
    }
  }

  const calculatePrice = () => {
    if (!pricing) return

    const priceItem = pricing.find(
      (p: any) => p.paperSize === options.paperSize && p.colorMode === options.colorMode
    )

    if (priceItem) {
      let price = priceItem.pricePerPage * options.copies
      if (options.duplex) {
        price *= 1.5 // 50% extra for duplex
      }
      if (options.staples) {
        price += 2000 // Rp 2.000 for staples
      }
      setTotalPrice(price)
    }
  }

  const updateOptions = (key: string, value: any) => {
    const newOptions = { ...options, [key]: value }
    setOptions(newOptions)
  }

  const handleProceed = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/print/options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          printJobId: printJob.id,
          ...options
        })
      })

      const result = await response.json()
      if (result.success) {
        onOptionsUpdated(result.printJob)
        onProceed()
      }
    } catch (error) {
      console.error('Failed to update print options:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Pilihan Cetak
          </CardTitle>
          <CardDescription>
            Atur preferensi cetakan untuk file: {printJob.fileName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Mode */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Mode Warna</Label>
            <RadioGroup
              value={options.colorMode}
              onValueChange={(value) => updateOptions('colorMode', value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="BW" id="bw" />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-black rounded"></div>
                  <Label htmlFor="bw">Hitam-Putih</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="COLOR" id="color" />
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded"></div>
                  <Label htmlFor="color">Berwarna</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Paper Size */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Ukuran Kertas</Label>
            <RadioGroup
              value={options.paperSize}
              onValueChange={(value) => updateOptions('paperSize', value)}
              className="grid grid-cols-2 gap-4"
            >
              {['A4', 'F4'].map((size) => (
                <div key={size} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value={size} id={size} />
                  <Label htmlFor={size}>{size}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Copies */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Jumlah Salinan: <span className="text-blue-600 font-bold">{options.copies}</span>
            </Label>
            <Slider
              value={[options.copies]}
              onValueChange={(value) => updateOptions('copies', value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Duplex */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <Checkbox
              id="duplex"
              checked={options.duplex}
              onCheckedChange={(checked) => updateOptions('duplex', checked)}
            />
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              <Label htmlFor="duplex" className="cursor-pointer">
                Cetak 2 Sisi (Duplex)
              </Label>
            </div>
            {options.duplex && (
              <Badge variant="secondary">+50%</Badge>
            )}
          </div>

          {/* Staples */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg bg-green-50 border-green-200">
            <Checkbox
              id="staples"
              checked={options.staples}
              onCheckedChange={(checked) => updateOptions('staples', checked)}
            />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              <Label htmlFor="staples" className="cursor-pointer">
                Staples (Tersedia di mesin)
              </Label>
            </div>
            {options.staples && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">+Rp 2.000</Badge>
            )}
          </div>

          {/* Orientation */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Orientasi</Label>
            <RadioGroup
              value={options.orientation}
              onValueChange={(value) => updateOptions('orientation', value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="PORTRAIT" id="portrait" />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="LANDSCAPE" id="landscape" />
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 rotate-90" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Rincian Harga
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Ukuran Kertas:</span>
              <span className="ml-2 font-medium">{options.paperSize}</span>
            </div>
            <div>
              <span className="text-gray-600">Mode Warna:</span>
              <span className="ml-2 font-medium">
                {options.colorMode === 'BW' ? 'Hitam-Putih' : 'Berwarna'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Jumlah Salinan:</span>
              <span className="ml-2 font-medium">{options.copies}x</span>
            </div>
            <div>
              <span className="text-gray-600">Mode Cetak:</span>
              <span className="ml-2 font-medium">
                {options.duplex ? '2 Sisi' : '1 Sisi'}
              </span>
            </div>
            {options.staples && (
              <div className="col-span-2">
                <span className="text-gray-600">Fitur Tambahan:</span>
                <span className="ml-2 font-medium text-green-600">Staples (+Rp 2.000)</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Harga:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          <Button 
            onClick={handleProceed}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Lanjut ke Pembayaran
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}