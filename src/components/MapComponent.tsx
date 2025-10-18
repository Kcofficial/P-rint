'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  machines: any[]
  selectedMachine?: any
  onMachineSelect?: (machine: any) => void
  height?: string
}

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function MapComponent({ 
  machines, 
  selectedMachine, 
  onMachineSelect, 
  height = '400px' 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || !machines.length) return

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-6.2088, 106.8456], 11)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Add markers for each machine
    machines.forEach(machine => {
      if (machine.latitude && machine.longitude) {
        const isOnline = machine.status === 'ONLINE'
        const isMaintenance = machine.status === 'MAINTENANCE'
        
        // Create custom icon based on status
        const iconHtml = `
          <div style="
            background-color: ${isOnline ? '#10b981' : isMaintenance ? '#f59e0b' : '#6b7280'}; 
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">
            🖨️
          </div>
        `
        
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })

        const marker = L.marker([machine.latitude, machine.longitude], { icon: customIcon })
          .addTo(mapInstanceRef.current!)
        
        // Create popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${machine.name}</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📍 ${machine.address}</p>
            <div style="margin: 8px 0;">
              <span style="
                background-color: ${isOnline ? '#10b981' : isMaintenance ? '#f59e0b' : '#6b7280'}; 
                color: white; 
                padding: 2px 8px; 
                border-radius: 12px; 
                font-size: 12px;
              ">
                ${machine.status}
              </span>
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              <div>📄 Kertas: ${machine.paperLevel}%</div>
              <div>🖋️ Tinta: ${machine.inkLevel}%</div>
              <div>⏰ ${machine.openTime} - ${machine.closeTime}</div>
              <div>📊 Hari ini: ${machine.dailyPrintCount} cetakan</div>
            </div>
            <button 
              onclick="window.selectMachine('${machine.id}')"
              style="
                background-color: #3b82f6; 
                color: white; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                cursor: pointer;
                margin-top: 8px;
                width: 100%;
              "
            >
              Pilih Lokasi
            </button>
          </div>
        `
        
        marker.bindPopup(popupContent)
        
        // Add click handler
        marker.on('click', () => {
          if (onMachineSelect) {
            onMachineSelect(machine)
          }
        })
        
        markersRef.current.push(marker)
      }
    })

    // Fit map to show all markers
    if (markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }

    // Global function for button clicks in popups
    (window as any).selectMachine = (machineId: string) => {
      const machine = machines.find(m => m.id === machineId)
      if (machine && onMachineSelect) {
        onMachineSelect(machine)
      }
    }

    return () => {
      // Cleanup global function
      delete (window as any).selectMachine
    }
  }, [machines, onMachineSelect])

  // Update selected machine
  useEffect(() => {
    if (selectedMachine && selectedMachine.latitude && selectedMachine.longitude && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedMachine.latitude, selectedMachine.longitude], 15)
      
      // Open popup for selected machine
      const selectedMarker = markersRef.current.find(marker => {
        const position = marker.getLatLng()
        return Math.abs(position.lat - selectedMachine.latitude) < 0.0001 && 
               Math.abs(position.lng - selectedMachine.longitude) < 0.0001
      })
      
      if (selectedMarker) {
        selectedMarker.openPopup()
      }
    }
  }, [selectedMachine])

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%', borderRadius: '8px', zIndex: 1 }}
    />
  )
}