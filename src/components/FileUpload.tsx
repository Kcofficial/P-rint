'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react'

interface FileUploadProps {
  onFileUploaded: (printJob: any) => void
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (result.success) {
        setUploadedFile(result.printJob)
        onFileUploaded(result.printJob)
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [onFileUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
    disabled: uploading || uploadedFile !== null
  })

  const resetUpload = () => {
    setUploadedFile(null)
    setError(null)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
      case 'docx':
      case 'pptx':
        return <FileText className="w-6 h-6" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  if (uploadedFile) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            File Berhasil Diupload
          </CardTitle>
          <CardDescription>
            File Anda siap untuk dicetak. PIN Anda: <span className="font-mono font-bold">{uploadedFile.pinCode}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="text-blue-600">
                {getFileIcon(uploadedFile.fileName)}
              </div>
              <div>
                <div className="font-medium">{uploadedFile.fileName}</div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(uploadedFile.fileSize)} • {new Date(uploadedFile.uploadedAt).toLocaleString()}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetUpload}>
              <X className="w-4 h-4 mr-1" />
              Ganti File
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">PIN P-rint Anda</span>
            </div>
            <div className="text-2xl font-mono font-bold text-center py-2 bg-white rounded border-2 border-blue-200">
              {uploadedFile.pinCode}
            </div>
            <p className="text-sm text-blue-700 text-center mt-2">
              Simpan PIN ini untuk mengambil hasil cetakan
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Upload File untuk Dicetak</CardTitle>
        <CardDescription>
          Seret dan lepas file atau klik untuk memilih
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
              <div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Mengupload file...
                </p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Lepaskan file di sini' : 'Seret file ke sini'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  atau
                </p>
                <Button variant="outline" disabled={uploading}>
                  Pilih File
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Maksimal 20MB • PDF, DOCX, PPTX, JPG, PNG
              </p>
            </div>
          )}
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

        <div className="grid grid-cols-5 gap-2">
          {[
            { name: 'PDF', icon: <FileText className="w-4 h-4" />, description: 'Document' },
            { name: 'DOCX', icon: <FileText className="w-4 h-4" />, description: 'Word' },
            { name: 'PPTX', icon: <FileText className="w-4 h-4" />, description: 'PowerPoint' },
            { name: 'JPG', icon: <ImageIcon className="w-4 h-4" />, description: 'Image' },
            { name: 'PNG', icon: <ImageIcon className="w-4 h-4" />, description: 'Image' }
          ].map((format) => (
            <div key={format.name} className="text-center p-2 border rounded-lg">
              <div className="flex justify-center mb-1 text-blue-600">
                {format.icon}
              </div>
              <div className="text-xs font-medium">{format.name}</div>
              <div className="text-xs text-gray-500">{format.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}