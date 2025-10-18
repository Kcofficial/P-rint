'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  Clock, 
  Printer, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Navigation,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react'

interface LocationCardProps {
  machine: any
  isSelected?: boolean
  onSelect?: (machine: any) => void
  onViewDetails?: (machine: any) => void
  compact?: boolean
}

export default function LocationCard({ 
  machine, 
  isSelected, 
  onSelect, 
  onViewDetails,
  compact = false 
}: LocationCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Check if location is currently open
    if (machine.openTime && machine.closeTime) {
      if (machine.openTime === '24 Jam' && machine.closeTime === '24 Jam') {
        setIsOpen(true)
      } else {
        const now = currentTime
        const currentMinutes = now.getHours() * 60 + now.getMinutes()
        
        const [openHour, openMinute] = machine.openTime.split(':').map(Number)
        const [closeHour, closeMinute] = machine.closeTime.split(':').map(Number)
        
        const openMinutes = openHour * 60 + openMinute
        const closeMinutes = closeHour * 60 + closeMinute
        
        setIsOpen(currentMinutes >= openMinutes && currentMinutes <= closeMinutes)
      }
    }
  }, [currentTime, machine.openTime, machine.closeTime])

  const getStatusIcon = () => {
    switch (machine.status) {
      case 'ONLINE':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'OFFLINE':
        return <XCircle className="w-4 h-4 text-gray-500" />
      case 'MAINTENANCE':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'BUSY':
        return <Printer className="w-4 h-4 text-blue-500" />
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (machine.status) {
      case 'ONLINE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'OFFLINE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BUSY':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaperLevelColor = (level: number) => {
    if (level > 50) return 'bg-green-500'
    if (level > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getInkLevelColor = (level: number) => {
    if (level > 50) return 'bg-green-500'
    if (level > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getDistanceColor = (distance: string) => {
    const dist = parseFloat(distance)
    if (dist < 1) return 'text-green-600'
    if (dist < 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatTime = (time: string) => {
    if (time === '24 Jam') return '24 Jam'
    const [hour, minute] = time.split(':')
    return `${hour}:${minute}`
  }

  if (compact) {
    return (
      <Card className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-200' : ''
      }`} onClick={() => onSelect?.(machine)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold text-sm">{machine.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {machine.location}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor()} variant="outline">
                {machine.status}
              </Badge>
              <p className={`text-xs font-medium mt-1 ${getDistanceColor(machine.distance || '0')}`}>
                {machine.distance}
              </p>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-gray-400" />
              <span>Kertas: {machine.paperLevel}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Printer className="w-3 h-3 text-gray-400" />
              <span>Tinta: {machine.inkLevel}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 border-blue-200' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getStatusIcon()}
              {machine.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {machine.address}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor()} variant="outline">
              {machine.status}
            </Badge>
            <div className={`text-sm font-medium ${getDistanceColor(machine.distance || '0')}`}>
              {machine.distance}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Operating Hours */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Jam Operasional</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {formatTime(machine.openTime)} - {formatTime(machine.closeTime)}
            </div>
            <div className={`text-xs ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
              {isOpen ? '🟢 Buka' : '🔴 Tutup'}
            </div>
          </div>
        </div>

        {/* Resource Levels */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Kertas
              </span>
              <span className="text-sm font-bold">{machine.paperLevel}%</span>
            </div>
            <Progress 
              value={machine.paperLevel} 
              className="h-2"
              // @ts-ignore
              style={{
                '--progress-background': getPaperLevelColor(machine.paperLevel)
              }}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium flex items-center gap-1">
                <Printer className="w-4 h-4" />
                Tinta
              </span>
              <span className="text-sm font-bold">{machine.inkLevel}%</span>
            </div>
            <Progress 
              value={machine.inkLevel} 
              className="h-2"
              // @ts-ignore
              style={{
                '--progress-background': getInkLevelColor(machine.inkLevel)
              }}
            />
          </div>
        </div>

        {/* Daily Statistics */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-2xl font-bold">{machine.dailyPrintCount}</span>
            </div>
            <div className="text-xs text-blue-700">Cetakan Hari Ini</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="text-2xl font-bold">{machine.totalPageCount}</span>
            </div>
            <div className="text-xs text-gray-700">Total Halaman</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onSelect?.(machine)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Pilih Lokasi
          </Button>
          <Button 
            onClick={() => onViewDetails?.(machine)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}