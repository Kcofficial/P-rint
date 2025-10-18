'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Printer, 
  Users, 
  FileText, 
  DollarSign,
  TrendingUp,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react'
import MapComponent from '@/components/MapComponent'
import LocationCard from '@/components/LocationCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrintJobs: 0,
    totalRevenue: 0,
    activeMachines: 0
  })
  
  const [recentJobs, setRecentJobs] = useState([])
  const [machines, setMachines] = useState([])

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // In a real app, these would be actual API calls
      // For now, we'll use mock data
      
      setStats({
        totalUsers: 1234,
        totalPrintJobs: 5678,
        totalRevenue: 15000000,
        activeMachines: 3
      })

      setRecentJobs([
        {
          id: '1',
          fileName: 'Laporan_Keuangan.pdf',
          status: 'COMPLETED',
          totalPrice: 5000,
          createdAt: new Date().toISOString(),
          user: { name: 'John Doe' }
        },
        {
          id: '2',
          fileName: 'Presentasi_PPT.pptx',
          status: 'PRINTING',
          totalPrice: 15000,
          createdAt: new Date().toISOString(),
          user: { name: 'Jane Smith' }
        },
        {
          id: '3',
          fileName: 'Document.docx',
          status: 'QUEUED',
          totalPrice: 2500,
          createdAt: new Date().toISOString(),
          user: { name: 'Bob Johnson' }
        }
      ])

      setMachines([
        {
          id: '1',
          name: 'P-rint Kampus A',
          status: 'ONLINE',
          paperLevel: 85,
          inkLevel: 70,
          currentPageCount: 1234,
          totalPageCount: 15678,
          location: 'Jakarta',
          address: 'Jl. Kampus Utama No. 123, Jakarta',
          latitude: -6.2088,
          longitude: 106.8456,
          openTime: '07:00',
          closeTime: '21:00',
          dailyPrintCount: 45,
          lastSeen: new Date().toISOString()
        },
        {
          id: '2',
          name: 'P-rint Co-Work Space',
          status: 'ONLINE',
          paperLevel: 60,
          inkLevel: 45,
          currentPageCount: 987,
          totalPageCount: 12456,
          location: 'Jakarta Selatan',
          address: 'Jl. Sudirman No. 456, Jakarta Selatan',
          latitude: -6.2297,
          longitude: 106.8295,
          openTime: '08:00',
          closeTime: '22:00',
          dailyPrintCount: 32,
          lastSeen: new Date().toISOString()
        },
        {
          id: '3',
          name: 'P-rint Perpustakaan',
          status: 'MAINTENANCE',
          paperLevel: 30,
          inkLevel: 25,
          currentPageCount: 654,
          totalPageCount: 8765,
          location: 'Jakarta Pusat',
          address: 'Jl. Literasi No. 789, Jakarta Pusat',
          latitude: -6.1944,
          longitude: 106.8229,
          openTime: '09:00',
          closeTime: '20:00',
          dailyPrintCount: 28,
          lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          name: 'P-rint Mall Central',
          status: 'ONLINE',
          paperLevel: 95,
          inkLevel: 88,
          currentPageCount: 2156,
          totalPageCount: 23456,
          location: 'Jakarta Barat',
          address: 'Jl. Mall Central No. 100, Jakarta Barat',
          latitude: -6.1751,
          longitude: 106.8650,
          openTime: '10:00',
          closeTime: '23:00',
          dailyPrintCount: 67,
          lastSeen: new Date().toISOString()
        },
        {
          id: '5',
          name: 'P-rint Station Bandara',
          status: 'ONLINE',
          paperLevel: 78,
          inkLevel: 62,
          currentPageCount: 3456,
          totalPageCount: 45678,
          location: 'Tangerang',
          address: 'Terminal 2D, Bandara Soekarno-Hatta',
          latitude: -6.1256,
          longitude: 106.6558,
          openTime: '24 Jam',
          closeTime: '24 Jam',
          dailyPrintCount: 89,
          lastSeen: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PRINTING':
        return <Printer className="w-4 h-4 text-blue-500" />
      case 'QUEUED':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PRINTING':
        return 'bg-blue-100 text-blue-800'
      case 'QUEUED':
        return 'bg-orange-100 text-orange-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMachineStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800'
      case 'OFFLINE':
        return 'bg-gray-100 text-gray-800'
      case 'BUSY':
        return 'bg-blue-100 text-blue-800'
      case 'ERROR':
        return 'bg-red-100 text-red-800'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">P-rint Admin Dashboard</h1>
          <p className="text-gray-600">Kelola dan monitor sistem P-rint Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cetak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPrintJobs.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mesin Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMachines}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Printer className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="printjobs">Print Jobs</TabsTrigger>
            <TabsTrigger value="machines">Mesin</TabsTrigger>
            <TabsTrigger value="maps">Maps</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Print Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Print Jobs Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.map((job: any) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(job.status)}
                          <div>
                            <div className="font-medium">{job.fileName}</div>
                            <div className="text-sm text-gray-500">{job.user?.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <div className="text-sm font-medium mt-1">
                            {formatCurrency(job.totalPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Machine Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="w-5 h-5" />
                    Status Mesin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {machines.map((machine: any) => (
                      <div key={machine.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium">{machine.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {machine.location}
                            </div>
                          </div>
                          <Badge className={getMachineStatusColor(machine.status)}>
                            {machine.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Kertas:</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${machine.paperLevel}%` }}
                                ></div>
                              </div>
                              <span>{machine.paperLevel}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Tinta:</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${machine.inkLevel}%` }}
                                ></div>
                              </div>
                              <span>{machine.inkLevel}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="printjobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Semua Print Jobs</CardTitle>
                <CardDescription>Daftar semua permintaan cetakan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Fitur manajemen print jobs akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Peta Lokasi Mesin
                    </CardTitle>
                    <CardDescription>
                      Monitor semua lokasi mesin P-rint secara real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MapComponent
                      machines={machines}
                      height="500px"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Lokasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Lokasi</span>
                      <span className="font-bold">{machines.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Online</span>
                      <span className="font-bold text-green-600">
                        {machines.filter((m: any) => m.status === 'ONLINE').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Maintenance</span>
                      <span className="font-bold text-yellow-600">
                        {machines.filter((m: any) => m.status === 'MAINTENANCE').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rata-rata Kertas</span>
                      <span className="font-bold">
                        {Math.round(machines.reduce((acc: number, m: any) => acc + m.paperLevel, 0) / machines.length)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rata-rata Tinta</span>
                      <span className="font-bold">
                        {Math.round(machines.reduce((acc: number, m: any) => acc + m.inkLevel, 0) / machines.length)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {machines.filter((m: any) => m.paperLevel < 30 || m.inkLevel < 30).map((machine: any) => (
                      <div key={machine.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium text-sm">{machine.name}</span>
                        </div>
                        <div className="text-xs text-red-700 mt-1">
                          {machine.paperLevel < 30 && `Kertas: ${machine.paperLevel}%`}
                          {machine.paperLevel < 30 && machine.inkLevel < 30 && ' • '}
                          {machine.inkLevel < 30 && `Tinta: ${machine.inkLevel}%`}
                        </div>
                      </div>
                    ))}
                    {machines.filter((m: any) => m.paperLevel < 30 || m.inkLevel < 30).length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-4">
                        ✅ Semua mesin dalam kondisi baik
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="machines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Mesin</CardTitle>
                <CardDescription>Monitor dan kontrol semua mesin P-rint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Fitur manajemen mesin akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics & Laporan
                </CardTitle>
                <CardDescription>Statistik penggunaan dan laporan keuangan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Fitur analytics akan segera hadir</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}