'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Clock, 
  CheckCircle, 
  Printer, 
  AlertCircle,
  FileText,
  MapPin,
  RefreshCw,
  DollarSign
} from 'lucide-react'

interface StatusTrackingProps {
  initialPin?: string
}

export default function StatusTracking({ initialPin }: StatusTrackingProps) {
  const [pinCode, setPinCode] = useState(initialPin || '')
  const [printJob, setPrintJob] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialPin) {
      checkStatus(initialPin)
    }
  }, [initialPin])

  const checkStatus = async (pin?: string) => {
    const searchPin = pin || pinCode
    if (!searchPin) {
      setError('Masukkan PIN untuk melacak status')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/status?pin=${searchPin}`)
      const result = await response.json()
      
      if (result.success) {
        setPrintJob(result.printJob)
      } else {
        setError(result.error || 'Status tidak ditemukan')
      }
    } catch (error) {
      setError('Gagal memeriksa status. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'QUEUED':
        return <Clock className="w-5 h-5 text-orange-500" />
      case 'PRINTING':
        return <Printer className="w-5 h-5 text-blue-600" />
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'FAILED':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'EXPIRED':
        return <AlertCircle className="w-5 h-5 text-gray-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      case 'QUEUED':
        return 'bg-orange-100 text-orange-800'
      case 'PRINTING':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Menunggu Pembayaran'
      case 'PAID':
        return 'Pembayaran Berhasil'
      case 'QUEUED':
        return 'Dalam Antrean'
      case 'PRINTING':
        return 'Sedang Mencetak'
      case 'COMPLETED':
        return 'Selesai'
      case 'FAILED':
        return 'Gagal'
      case 'EXPIRED':
        return 'Kadaluarsa'
      default:
        return 'Unknown'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  const isExpired = () => {
    return printJob && new Date() > new Date(printJob.expiresAt) && printJob.status === 'PENDING'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Lacak Status Cetak
          </CardTitle>
          <CardDescription>
            Masukkan PIN P-rint untuk melacak status pesanan Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="pin">PIN P-rint</Label>
              <Input
                id="pin"
                type="text"
                placeholder="Masukkan 6 digit PIN"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => checkStatus()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Lacak
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Display */}
      {printJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {getStatusIcon(printJob.status)}
                Status Pesanan
              </span>
              <Badge className={getStatusColor(printJob.status)}>
                {getStatusText(printJob.status)}
              </Badge>
            </CardTitle>
            <CardDescription>
              PIN: <span className="font-mono font-bold">{printJob.pinCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">File:</span>
                  <span className="font-medium">{printJob.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Spesifikasi:</span>
                  <span className="font-medium">
                    {printJob.paperSize} • {printJob.colorMode === 'BW' ? 'Hitam-Putih' : 'Berwarna'} • {printJob.copies}x
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Waktu Upload:</span>
                  <span className="font-medium">
                    {new Date(printJob.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Total Harga:</span>
                  <span className="font-medium">{formatCurrency(printJob.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              <h3 className="font-medium">Timeline Status</h3>
              <div className="space-y-3">
                {[
                  { status: 'PENDING', label: 'File Diupload', completed: true },
                  { status: 'PAID', label: 'Pembayaran Berhasil', completed: ['PAID', 'QUEUED', 'PRINTING', 'COMPLETED'].includes(printJob.status) },
                  { status: 'QUEUED', label: 'Dalam Antrean', completed: ['QUEUED', 'PRINTING', 'COMPLETED'].includes(printJob.status) },
                  { status: 'PRINTING', label: 'Sedang Mencetak', completed: ['PRINTING', 'COMPLETED'].includes(printJob.status) },
                  { status: 'COMPLETED', label: 'Selesai', completed: printJob.status === 'COMPLETED' }
                ].map((step, index) => (
                  <div key={step.status} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${step.completed ? 'text-green-700' : 'text-gray-500'}`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Machine Info */}
            {printJob.machine && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Lokasi Mesin</span>
                </div>
                <div className="text-sm text-blue-700">
                  <div className="font-medium">{printJob.machine.name}</div>
                  <div>{printJob.machine.address}</div>
                </div>
              </div>
            )}

            {/* Expiration Warning */}
            {isExpired() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Pesanan Kadaluarsa</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Pesanan Anda telah kadaluarsa. Silakan upload ulang file Anda.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                onClick={() => checkStatus()}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              
              {printJob.status === 'COMPLETED' && (
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Cetak Lagi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}