import { createContext, useContext, useEffect, useState } from 'react'
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes, confirmSignUp } from 'aws-amplify/auth'

// Create Auth Context
const AuthContext = createContext()

// Get verified company domains from environment
const VERIFIED_DOMAINS = import.meta.env.VITE_VERIFIED_DOMAINS?.split(',').map(d => d.trim().toLowerCase()) || []

// Auth Provider Component using AWS Amplify Auth
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ssoEmail, setSsoEmail] = useState(null) // Store email for SSO verification

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
      setSsoEmail(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Check if email domain is verified for SSO
  const isVerifiedDomain = (email) => {
    if (!email || VERIFIED_DOMAINS.length === 0) return false
    const domain = email.split('@')[1]?.toLowerCase()
    return VERIFIED_DOMAINS.includes(domain)
  }

  // SSO Login - Step 1: Send verification code to email
  const initiateSSOLogin = async (email) => {
    try {
      setError(null)
      
      // Check if domain is verified
      if (!isVerifiedDomain(email)) {
        const errorMessage = `Access denied. The domain "${email.split('@')[1]}" is not a verified company domain.`
        setError(errorMessage)
        return { success: false, error: errorMessage }
      }

      // Generate a secure random password for SSO users (they won't need to remember it)
      const randomPassword = `SSO${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}!Aa1#`
      const username = `sso_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      
      try {
        // Try to create a new SSO user
        const result = await signUp({
          username: username,
          password: randomPassword,
          options: {
            userAttributes: {
              email: email,
              name: email.split('@')[0],
            },
            autoSignIn: false
          }
        })
        
        // Store SSO credentials temporarily for auto-login after verification
        sessionStorage.setItem('ssoEmail', email)
        sessionStorage.setItem('ssoUsername', username)
        sessionStorage.setItem('ssoPassword', randomPassword)
        
        setSsoEmail(email)
        return { 
          success: true, 
          requiresVerification: true,
          email: email,
          username: username,
          message: 'Verification code sent to your company email'
        }
      } catch (err) {
        // If user already exists with this email, they should use regular login
        if (err.name === 'UsernameExistsException' || err.message?.includes('already exists') || err.message?.includes('email')) {
          const errorMessage = 'An account with this email already exists. Please use the regular sign-in option with your password.'
          setError(errorMessage)
          return { success: false, error: errorMessage }
        }
        
        console.error('SSO initiation error:', err)
        return { success: false, error: err.message || 'Failed to initiate SSO login' }
      }
    } catch (err) {
      console.error('SSO error:', err)
      return { success: false, error: 'Failed to initiate SSO login' }
    }
  }

  // SSO Login - Step 2: Verify code and complete login
  const completeSSOLogin = async (verificationCode) => {
    try {
      setError(null)
      
      // Retrieve stored SSO credentials
      const email = sessionStorage.getItem('ssoEmail')
      const username = sessionStorage.getItem('ssoUsername')
      const password = sessionStorage.getItem('ssoPassword')
      
      if (!email || !username || !password) {
        return { success: false, error: 'Session expired. Please start SSO login again.' }
      }
      
      // Confirm the sign up with the code
      await confirmSignUp({
        username: username,
        confirmationCode: verificationCode
      })
      
      // Auto-login after successful verification
      const { isSignedIn } = await signIn({
        username: email, // Use email since it's set as alias
        password: password,
      })

      if (isSignedIn) {
        // Clear SSO credentials from session storage
        sessionStorage.removeItem('ssoEmail')
        sessionStorage.removeItem('ssoUsername')
        sessionStorage.removeItem('ssoPassword')
        
        await checkAuthStatus()
        return { success: true }
      }
      
      return { success: false, error: 'Failed to complete sign in' }
    } catch (err) {
      console.error('SSO completion error:', err)
      let errorMessage = 'Invalid verification code'
      
      if (err.name === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code. Please try again.'
      } else if (err.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please start SSO login again.'
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Authentication failed. Please try again.'
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      ssoEmail,
      verifiedDomains: VERIFIED_DOMAINS,
      login,
      signup,
      confirmSignUpCode,
      initiateSSOLogin,
      completeSSOLogin,
      isVerifiedDomain,
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
