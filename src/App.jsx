import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ChatInterface from './components/ChatInterface'
import LoginPage from './components/LoginPage'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Main App Content
const AppContent = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ChatInterface user={user} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
