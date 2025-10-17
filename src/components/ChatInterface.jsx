import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Plus, 
  Paperclip, 
  User, 
  Bot, 
  LogOut, 
  Settings,
  MessageSquare,
  FileText,
  Image,
  Download,
  Sparkles,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import FileUpload from './FileUpload'
import ChatHistory from './ChatHistory'

const ChatInterface = ({ user }) => {
  const { logout } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      attachments: []
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(true)
  const [currentChatId, setCurrentChatId] = useState('chat-1')
  const [attachedFiles, setAttachedFiles] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim() && attachedFiles.length === 0) return

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      attachments: attachedFiles
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')
    setAttachedFiles([])
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `I received your message${inputText ? `: "${inputText}"` : ''}${attachedFiles.length > 0 ? ` and ${attachedFiles.length} file(s)` : ''}. This is a simulated response. In a real implementation, this would connect to your LangGraph backend.`,
        sender: 'bot',
        timestamp: new Date(),
        attachments: []
      }
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`
    setCurrentChatId(newChatId)
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        attachments: []
      }
    ])
    setAttachedFiles([])
  }

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }))
    setAttachedFiles(prev => [...prev, ...newFiles])
    setShowFileUpload(false)
  }

  const removeFile = (fileId) => {
    setAttachedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r-2 border-grey flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">AI Chat</h1>
            </div>

          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email || 'User'}
              </p>
              <p className="text-xs text-green-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                Online
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Chat History */}
        {showChatHistory && (
          <div className="flex-1 overflow-y-auto">
            <ChatHistory 
              currentChatId={currentChatId}
              onChatSelect={setCurrentChatId}
            />
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
              <p className="text-sm text-gray-500">Always ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                } ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                  {message.sender === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                </div>
                <div className={`px-5 py-3 rounded-2xl shadow-md ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-blue-200'
                    : 'bg-white/90 backdrop-blur-sm  text-gray-800 shadow-gray-200 border-2 border-grey'
                }`}>
                  <p className="text-[15px] leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-white/60 px-5 py-3 rounded-2xl shadow-md">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Upload Modal */}
        {showFileUpload && (
          <FileUpload 
            onClose={() => setShowFileUpload(false)}
            onFileUpload={handleFileUpload}
          />
        )}

        {/* Input Area */}
        <div className="bg-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {/* Attached Files Display */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Attached Files ({attachedFiles.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-2 bg-white rounded-lg border p-2 shadow-sm"
                    >
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <FileText size={16} className="text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end space-x-3">
              <button
                onClick={() => setShowFileUpload(true)}
                className="p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                title="Upload File"
              >
                <Paperclip size={20} />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() && attachedFiles.length === 0}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-xl"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
