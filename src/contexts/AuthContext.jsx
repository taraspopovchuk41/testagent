import { createContext, useContext, useEffect, useState } from 'react'
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes, confirmSignUp } from 'aws-amplify/auth'

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component using AWS Amplify Auth
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()
      
      const userData = {
        id: currentUser.userId,
        email: attributes.email,
        name: attributes.name || attributes.email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
      
      setUser(userData)
      setIsAuthenticated(true)
    } catch (err) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const { isSignedIn } = await signIn({
        username: email,
        password: password,
      })

      if (isSignedIn) {
        await checkAuthStatus()
        return { success: true }
      }
    } catch (err) {
      console.error('Login error:', err)
      let errorMessage = 'Invalid email or password'
      
      if (err.name === 'UserNotFoundException') {
        errorMessage = 'User not found. Please sign up first.'
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password'
      } else if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Please verify your email first'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const signup = async (email, password, name) => {
    try {
      setError(null)
      
      // Generate a unique username (UUID-like) since Cognito is configured for email alias
      // This allows users to sign up with email while Cognito requires a non-email username
      const username = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: username,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: name,
          },
          autoSignIn: true
        }
      })

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        return { 
          success: true, 
          requiresConfirmation: true,
          message: 'Please check your email for verification code',
          email: email,
          username: username  // Store for later use
        }
      }

      if (isSignUpComplete) {
        return { success: true, requiresConfirmation: false }
      }
    } catch (err) {
      console.error('Signup error:', err)
      let errorMessage = 'Failed to create account'
      
      if (err.name === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists'
      } else if (err.name === 'InvalidPasswordException') {
        errorMessage = 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
      } else if (err.name === 'InvalidParameterException') {
        errorMessage = err.message || 'Invalid email or password format'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const confirmSignUpCode = async (username, code) => {
    try {
      setError(null)
      await confirmSignUp({
        username: username,
        confirmationCode: code
      })
      return { success: true }
    } catch (err) {
      console.error('Confirmation error:', err)
      let errorMessage = 'Invalid verification code'
      
      if (err.name === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please try again.'
      } else if (err.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please request a new one.'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      signup,
      confirmSignUpCode,
      logout,
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
