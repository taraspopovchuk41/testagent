import { useState, createContext, useContext } from 'react'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (email, password) => {
    // Test credentials
    if (email === 'test@mail.com' && password === 'test123') {
      const userData = {
        id: '1',
        email: email,
        name: 'Test User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, user: userData }
    } else {
      return { success: false, error: 'Invalid credentials' }
    }
  }

  const signup = async (email, password, name) => {
    // Simple signup for testing
    const userData = {
      id: Date.now().toString(),
      email: email,
      name: name || 'New User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
    setUser(userData)
    setIsAuthenticated(true)
    return { success: true, user: userData }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
