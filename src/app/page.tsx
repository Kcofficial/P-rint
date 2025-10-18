'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FileUpload from '@/components/FileUpload'
import PrintOptions from '@/components/PrintOptions'
import Payment from '@/components/Payment'
import StatusTracking from '@/components/StatusTracking'
import { 
  Upload, 
  Printer, 
  CreditCard, 
  MapPin, 
  Clock, 
  CheckCircle, 
  FileText,
  Image,
  DollarSign,
  Users,
  Zap,
  Shield,
  Smartphone,
  Monitor,
  QrCode,
  Wallet,
  Settings,
  Headphones,
  MessageCircle,
  Phone
} from 'lucide-react'

type Step = 'upload' | 'options' | 'payment' | 'tracking'

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload')
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [printJob, setPrintJob] = useState<any>(null)
  const [updatedPrintJob, setUpdatedPrintJob] = useState<any>(null)
  const [transaction, setTransaction] = useState<any>(null)

  const pricing = [
    { size: 'A4', bw: 500, color: 1000 },
    { size: 'F4', bw: 750, color: 1500 }
  ]

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload Mudah',
      description: 'Drag & drop file dari perangkat apapun'
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: 'Pembayaran Digital',
      description: 'QRIS, E-Wallet, dan transfer bank'
    },
    {
      icon: <Printer className="w-6 h-6" />,
      title: 'Cetak Otomatis',
      description: 'Tanpa antri, tanpa operator'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Available',
      description: 'Layanan non-stop setiap saat'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Aman & Privasi',
      description: 'File otomatis terhapus setelah 15 menit'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobile Friendly',
      description: 'Cetak dari ponsel atau laptop'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Upload File',
      description: 'Pilih file PDF, DOCX, PPTX, JPG, atau PNG',
      icon: <Upload className="w-8 h-8" />
    },
    {
      number: '2',
      title: 'Atur & Bayar',
      description: 'Pilih jenis cetakan dan lakukan pembayaran',
      icon: <CreditCard className="w-8 h-8" />
    },
    {
      number: '3',
      title: 'Cetak Langsung',
      description: 'Masukkan PIN dan file akan tercetak otomatis',
      icon: <Printer className="w-8 h-8" />
    }
  ]

  const supportedFormats = [
    { name: 'PDF', icon: <FileText className="w-4 h-4" />, description: 'Document' },
    { name: 'DOCX', icon: <FileText className="w-4 h-4" />, description: 'Word Document' },
    { name: 'PPTX', icon: <FileText className="w-4 h-4" />, description: 'PowerPoint' },
    { name: 'JPG', icon: <Image className="w-4 h-4" />, description: 'Image' },
    { name: 'PNG', icon: <Image className="w-4 h-4" />, description: 'Image' }
  ]

  const locations = [
    {
      name: 'P-rint Kampus A',
      address: 'Jl. Kampus Utama No. 123, Jakarta',
      status: 'online',
      distance: '0.5 km',
      printers: [
        {
          type: 'A4',
          paperLevel: 85,
          inkLevel: 72,
          status: 'online'
        },
        {
          type: 'F4',
          paperLevel: 60,
          inkLevel: 55,
          status: 'online'
        }
      ],
      operatingHours: '07:00 - 21:00'
    },
    {
      name: 'P-rint Co-Work Space',
      address: 'Jl. Sudirman No. 456, Jakarta Selatan',
      status: 'online',
      distance: '2.1 km',
      printers: [
        {
          type: 'A4',
          paperLevel: 45,
          inkLevel: 38,
          status: 'online'
        },
        {
          type: 'F4',
          paperLevel: 25,
          inkLevel: 30,
          status: 'online'
        }
      ],
      operatingHours: '08:00 - 22:00'
    },
    {
      name: 'P-rint Perpustakaan',
      address: 'Jl. Literasi No. 789, Jakarta Pusat',
      status: 'maintenance',
      distance: '3.5 km',
      printers: [
        {
          type: 'A4',
          paperLevel: 15,
          inkLevel: 22,
          status: 'maintenance'
        },
        {
          type: 'F4',
          paperLevel: 5,
          inkLevel: 10,
          status: 'offline'
        }
      ],
      operatingHours: '09:00 - 20:00'
    }
  ]

  const handleFileUploaded = (job: any) => {
    setPrintJob(job)
    setCurrentStep('options')
  }

  const handleOptionsUpdated = (job: any) => {
    setUpdatedPrintJob(job)
  }

  const handlePaymentComplete = (trans: any) => {
    setTransaction(trans)
    setCurrentStep('tracking')
    setActiveTab('tracking')
  }

  const resetProcess = () => {
    setCurrentStep('upload')
    setPrintJob(null)
    setUpdatedPrintJob(null)
    setTransaction(null)
    setActiveTab('upload')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return <FileUpload onFileUploaded={handleFileUploaded} />
      case 'options':
        return printJob ? (
          <PrintOptions
            printJob={printJob}
            onOptionsUpdated={handleOptionsUpdated}
            onProceed={() => setCurrentStep('payment')}
          />
        ) : null
      case 'payment':
        return updatedPrintJob ? (
          <Payment
            printJob={updatedPrintJob}
            onPaymentComplete={handlePaymentComplete}
          />
        ) : null
      case 'tracking':
        return (
          <StatusTracking
            initialPin={printJob?.pinCode}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="w-fit bg-green-100 text-green-800 hover:bg-green-100">
                  <Zap className="w-3 h-3 mr-1" />
                  Cetak 24 Jam Non-Stop
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  P-rint
                  <span className="text-blue-600 block">Cetak Mandiri Digital</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Layanan cetak mandiri seperti ATM printer. Upload file dari ponsel atau laptop, 
                  bayar digital, dan cetak langsung tanpa operator.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  onClick={() => {
                    resetProcess()
                    setActiveTab('upload')
                  }}
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Mulai Cetak Sekarang
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
                  onClick={() => window.open('/locations', '_blank')}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Lihat Lokasi
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 px-8 py-3 text-lg"
                  onClick={() => window.open('/admin', '_blank')}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Admin
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-2"
                  onClick={() => window.open('tel:1500123', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Customer Service: 1500-123
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-2"
                  onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Tanpa Antri</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant Print</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>100% Digital</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center">
                    <Printer className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Cek Status Mesin</h3>
                    <p className="text-blue-100">3 mesin P-rint aktif saat ini</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                      <Users className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-bold">1,234</div>
                      <div className="text-sm text-blue-100">Pengguna Aktif</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
                      <FileText className="w-8 h-8 mb-2" />
                      <div className="text-2xl font-bold">5,678</div>
                      <div className="text-sm text-blue-100">Dokumen Ter cetak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      {currentStep !== 'upload' && (
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-4 md:space-x-8">
              {[
                { step: 'upload' as Step, label: 'Upload File', icon: <Upload className="w-4 h-4" /> },
                { step: 'options' as Step, label: 'Pilihan Cetak', icon: <Printer className="w-4 h-4" /> },
                { step: 'payment' as Step, label: 'Pembayaran', icon: <CreditCard className="w-4 h-4" /> },
                { step: 'tracking' as Step, label: 'Tracking', icon: <Clock className="w-4 h-4" /> }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep === item.step 
                        ? 'bg-blue-600 text-white' 
                        : ['upload', 'options', 'payment', 'tracking'].indexOf(currentStep) > index
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {['upload', 'options', 'payment', 'tracking'].indexOf(currentStep) > index ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep === item.step ? 'text-blue-600' : 
                      ['upload', 'options', 'payment', 'tracking'].indexOf(currentStep) > index ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      ['upload', 'options', 'payment', 'tracking'].indexOf(currentStep) > index ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        {currentStep === 'upload' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-1/2 mx-auto mb-8">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="pricing">Harga</TabsTrigger>
              <TabsTrigger value="locations">Lokasi</TabsTrigger>
              <TabsTrigger value="guide">Panduan</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-8">
              <FileUpload onFileUploaded={handleFileUploaded} />
            </TabsContent>

            <TabsContent value="pricing" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Harga Cetak</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {pricing.map((item) => (
                    <Card key={item.size} className="text-center">
                      <CardHeader>
                        <CardTitle className="text-xl">{item.size}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-black rounded"></div>
                              Hitam-Putih
                            </span>
                            <span className="font-bold">Rp {item.bw}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded"></div>
                              Berwarna
                            </span>
                            <span className="font-bold">Rp {item.color}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Harga per halaman
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Fitur Tambahan</CardTitle>
                    <CardDescription>
                      Karena ini adalah layanan self-printing, hanya staples yang tersedia di mesin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-3 border rounded">
                        <span>Cetak 2 Sisi (Duplex)</span>
                        <Badge variant="secondary">+50%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded bg-green-50 border-green-200">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Staples (Tersedia)
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Rp 2.000</Badge>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Catatan:</strong> Layanan jilid spiral, laminating, dan finishing lainnya tidak tersedia 
                        karena ini adalah sistem self-printing otomatis. Staples tersedia di setiap mesin untuk 
                        penyederhanaan dokumen.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Lokasi P-rint</h2>
                <div className="space-y-4">
                  {locations.map((location, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              location.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <div>
                              <h3 className="font-semibold text-lg">{location.name}</h3>
                              <p className="text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {location.address}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={location.status === 'online' ? 'default' : 'secondary'}>
                              {location.status === 'online' ? 'Online' : 'Maintenance'}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">{location.distance}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {location.printers.map((printer, printerIndex) => (
                              <div key={printerIndex} className="space-y-2 p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium flex items-center gap-2">
                                    <Printer className="w-4 h-4" />
                                    Printer {printer.type}
                                  </span>
                                  <div className={`w-2 h-2 rounded-full ${
                                    printer.status === 'online' ? 'bg-green-500' : 
                                    printer.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                      <FileText className="w-3 h-3" />
                                      Kertas
                                    </span>
                                    <span className={`font-medium text-xs ${
                                      printer.paperLevel > 50 ? 'text-green-600' : 
                                      printer.paperLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {printer.paperLevel}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        printer.paperLevel > 50 ? 'bg-green-500' : 
                                        printer.paperLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${printer.paperLevel}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                      Tinta
                                    </span>
                                    <span className={`font-medium text-xs ${
                                      printer.inkLevel > 50 ? 'text-green-600' : 
                                      printer.inkLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {printer.inkLevel}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        printer.inkLevel > 50 ? 'bg-green-500' : 
                                        printer.inkLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${printer.inkLevel}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Jam Operasional
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                                {location.operatingHours}
                              </p>
                            </div>
                          </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guide" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Cara Menggunakan P-rint</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {steps.map((step) => (
                    <Card key={step.number} className="text-center">
                      <CardContent className="p-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          {step.icon}
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {step.number}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Metode Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <QrCode className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-medium">QRIS</div>
                        <div className="text-xs text-gray-500">Scan & Bayar</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-medium">E-Wallet</div>
                        <div className="text-xs text-gray-500">GoPay, OVO, Dana</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-medium">Transfer Bank</div>
                        <div className="text-xs text-gray-500">Virtual Account</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="font-medium">Saldo Member</div>
                        <div className="text-xs text-gray-500">Top-up & Cetak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-8">
            {renderStepContent()}
          </div>
        )}
      </section>

      {/* Features Section */}
      {currentStep === 'upload' && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Mengapa Memilih P-rint?</h2>
              <p className="text-xl text-gray-600">
                Solusi cetak modern untuk kebutuhan digital Anda
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {currentStep === 'upload' && (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Siap Mencetak Tanpa Antri?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Bergabung dengan ribuan pengguna yang sudah menikmati kemudahan P-rint
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => {
                resetProcess()
                setActiveTab('upload')
              }}
            >
              <Printer className="w-5 h-5 mr-2" />
              Coba Sekarang Gratis
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}