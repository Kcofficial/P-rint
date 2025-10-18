'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  QrCode, 
  Wallet, 
  DollarSign,
  CheckCircle,
  Loader2,
  Smartphone
} from 'lucide-react'

interface PaymentProps {
  printJob: any
  onPaymentComplete: (transaction: any) => void
}

export default function Payment({ printJob, onPaymentComplete }: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState('QRIS')
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [transaction, setTransaction] = useState<any>(null)

  const paymentMethods = [
    {
      id: 'QRIS',
      name: 'QRIS',
      description: 'Scan QR untuk bayar',
      icon: <QrCode className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'WALLET',
      name: 'E-Wallet',
      description: 'GoPay, OVO, Dana',
      icon: <Wallet className="w-6 h-6" />
    },
    {
      id: 'TRANSFER',
      name: 'Transfer Bank',
      description: 'Virtual Account',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'WALLET_BALANCE',
      name: 'Saldo Member',
      description: 'Top-up & Cetak',
      icon: <DollarSign className="w-6 h-6" />
    }
  ]

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          printJobId: printJob.id,
          paymentMethod: selectedMethod,
          amount: printJob.totalPrice
        })
      })

      const result = await response.json()
      if (result.success) {
        setTransaction(result.transaction)
        setPaymentComplete(true)
        setTimeout(() => {
          onPaymentComplete(result.transaction)
        }, 2000)
      }
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  if (paymentComplete && transaction) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Pembayaran Berhasil!</CardTitle>
          <CardDescription>
            Transaksi Anda telah diproses. File siap dicetak.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="text-center space-y-2">
              <div className="text-sm text-green-800 font-medium">PIN P-rint Anda</div>
              <div className="text-3xl font-mono font-bold text-green-900">
                {printJob.pinCode}
              </div>
              <div className="text-sm text-green-700">
                Gunakan PIN ini di mesin P-rint
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">ID Transaksi:</span>
              <div className="font-medium">{transaction.paymentId}</div>
            </div>
            <div>
              <span className="text-gray-600">Total Pembayaran:</span>
              <div className="font-medium">{formatCurrency(transaction.amount)}</div>
            </div>
            <div>
              <span className="text-gray-600">Metode:</span>
              <div className="font-medium">{transaction.paymentMethod}</div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {transaction.paymentStatus}
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">Langkah Selanjutnya</span>
            </div>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Pergi ke mesin P-rint terdekat</li>
              <li>2. Masukkan PIN {printJob.pinCode} pada layar</li>
              <li>3. File akan tercetak secara otomatis</li>
              <li>4. Ambil hasil cetakan Anda</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium">{printJob.fileName}</div>
              <div className="text-sm text-gray-500">
                {printJob.paperSize} • {printJob.colorMode === 'BW' ? 'Hitam-Putih' : 'Berwarna'} • {printJob.copies}x
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(printJob.totalPrice)}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Pembayaran:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(printJob.totalPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Metode Pembayaran</CardTitle>
          <CardDescription>
            Pilih metode pembayaran yang Anda inginkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={setSelectedMethod}
            className="space-y-3"
          >
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-blue-600">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">Populer</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <Button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Memproses Pembayaran...
              </div>
            ) : (
              `Bayar ${formatCurrency(printJob.totalPrice)}`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <CreditCard className="w-4 h-4" />
            <span className="font-medium">Pembayaran Aman</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Transaksi Anda dilindungi dengan enkripsi SSL dan keamanan berlapis.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}