import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Calendar,
  Clock,
  Trash2,
  Edit3
} from 'lucide-react'

const ChatHistory = ({ currentChatId, onChatSelect }) => {
  const [chats, setChats] = useState([
    {
      id: 'chat-1',
      title: 'Welcome Chat',
      lastMessage: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 1
    },
    {
      id: 'chat-2',
      title: 'Project Discussion',
      lastMessage: 'Let\'s discuss the project requirements...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 15
    },
    {
      id: 'chat-3',
      title: 'Code Review',
      lastMessage: 'The code looks good, but we need to optimize...',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      messageCount: 8
    },
    {
      id: 'chat-4',
      title: 'Meeting Notes',
      lastMessage: 'Here are the key points from our meeting...',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      messageCount: 12
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingChat, setEditingChat] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - timestamp) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return timestamp.toLocaleDateString()
  }

  const handleEditChat = (chat) => {
    setEditingChat(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      setChats(prev => prev.map(chat =>
        chat.id === editingChat
          ? { ...chat, title: editTitle.trim() }
          : chat
      ))
    }
    setEditingChat(null)
    setEditTitle('')
  }

  const handleDeleteChat = (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      setChats(prev => prev.filter(chat => chat.id !== chatId))
      if (currentChatId === chatId) {
        onChatSelect('chat-1') // Switch to first available chat
      }
    }
  }

  const createNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      lastMessage: 'Start a new conversation...',
      timestamp: new Date(),
      messageCount: 0
    }
    setChats(prev => [newChat, ...prev])
    onChatSelect(newChat.id)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          <Plus size={16} />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No chats found</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentChatId === chat.id
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingChat === chat.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {chat.title}
                      </h3>
                    )}
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {chat.lastMessage}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock size={12} />
                        <span>{formatTimeAgo(chat.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <MessageSquare size={12} />
                        <span>{chat.messageCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditChat(chat)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Rename"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat.id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {chats.length} chat{chats.length !== 1 ? 's' : ''} total
        </div>
      </div>
    </div>
  )
}

export default ChatHistory
