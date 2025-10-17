import { useState, useRef } from 'react'
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  File, 
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react'

const FileUpload = ({ onClose, onFileUpload }) => {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready', // ready, uploading, success, error
      progress: 0
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />
    } else if (fileType.includes('text') || fileType.includes('document')) {
      return <FileText className="w-6 h-6 text-green-500" />
    } else {
      return <File className="w-6 h-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadFiles = async () => {
    setUploading(true)
    
    // Simulate file upload progress
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ))

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, progress }
            : f
        ))
      }

      // Mark as completed
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ))
    }

    setUploading(false)
    
    // Call the callback with uploaded files immediately
    onFileUpload(files.map(f => f.file))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Upload Files</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-500 mb-4">
              Support for images, documents, and other file types
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Selected Files ({files.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === 'uploading' && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {file.progress}% uploaded
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {file.status === 'ready' && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
