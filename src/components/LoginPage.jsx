import { useState } from 'react'
import { 
  Bot, 
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Brain,
  MessageCircle,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [showSSOVerification, setShowSSOVerification] = useState(false)
  const [showSSOInput, setShowSSOInput] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [ssoCode, setSsoCode] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [pendingUsername, setPendingUsername] = useState('')
  const [ssoEmail, setSsoEmailState] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const { login, signup, confirmSignUpCode, initiateSSOLogin, completeSSOLogin, verifiedDomains } = useAuth()

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login with custom UI
        const result = await login(formData.email, formData.password)
        if (!result.success) {
          setError(result.error)
        }
      } else {
        // Signup with custom UI
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }
        
        const result = await signup(formData.email, formData.password, formData.name)
        
        if (result.success && result.requiresConfirmation) {
          setPendingEmail(result.email)
          setPendingUsername(result.username)  // Store the generated username
          setShowVerification(true)
          setError('')
        } else if (!result.success) {
          setError(result.error)
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Use the username (not email) for confirmation
      const result = await confirmSignUpCode(pendingUsername, verificationCode)
      
      if (result.success) {
        // Auto sign in after confirmation using email
        const loginResult = await login(pendingEmail, formData.password)
        if (!loginResult.success) {
          setError('Account verified! Please sign in.')
          setShowVerification(false)
          setIsLogin(true)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await initiateSSOLogin(ssoEmail)
      
      if (result.success && result.requiresVerification) {
        setShowSSOVerification(true)
        setError('')
      } else if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError('SSO login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOVerification = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await completeSSOLogin(ssoCode)
      
      if (result.success) {
        // Successfully logged in, will redirect automatically
        setShowSSOVerification(false)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Brain, title: 'AI-Powered', desc: 'Advanced AI capabilities' },
    { icon: MessageCircle, title: 'Real-time Chat', desc: 'Instant responses' },
    { icon: FileText, title: 'Document Upload', desc: 'Process any file type' },
    { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mr-4">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">AI Agent</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Your Intelligent
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Assistant</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the future of AI-powered conversations with our advanced agent that understands context, processes documents, and provides intelligent responses.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AI Agent</h1>
            </div>

            {/* Form Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl py-4 px-8 border border-white/20 shadow-2xl">
              {/* SSO Login Section - Show only on Sign In */}
              {isLogin && verifiedDomains.length > 0 && (
                <>
                  <div className="mb-6">
                    {!showSSOInput ? (
                      /* SSO Button - Initial State */
                      <div>
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-300">
                            Company team? Sign in with your work email
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSSOInput(true)}
                          className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Shield size={20} />
                          <span>Sign in with Company SSO</span>
                          <ArrowRight size={18} />
                        </button>
                       
                      </div>
                    ) : (
                      /* SSO Form - Expanded State */
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Company SSO Login</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSSOInput(false)
                              setSsoEmailState('')
                              setError('')
                            }}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Close"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <form onSubmit={handleSSOLogin} className="space-y-4">
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input
                              type="email"
                              value={ssoEmail}
                              onChange={(e) => {
                                setSsoEmailState(e.target.value)
                                setError('')
                              }}
                              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                              placeholder="Enter your company email"
                              required
                              autoFocus
                            />
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                          >
                            {isLoading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending Code...</span>
                              </>
                            ) : (
                              <>
                                <Shield size={18} />
                                <span>Send Verification Code</span>
                                <ArrowRight size={18} />
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/10 text-gray-400">
                        Or use email/password
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Tab Headers */}
              <div className="flex mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Info Message */}
              {/* <div className="mb-6 p-4 bg-purple-500/20 border border-purple-400/30 rounded-xl">
                <div className="flex items-center space-x-2 text-purple-300 text-sm">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Secure Authentication</span>
                </div>
                <p className="text-purple-200 text-sm mt-1">
                  Powered by AWS Cognito for enterprise-grade security
                </p>
              </div> */}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field for signup */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-400 mt-1">
                      Min 8 characters with uppercase, lowercase, and numbers
                    </p>
                  )}
                </div>

                {/* Confirm Password field for signup */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                        placeholder="Confirm your password"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm p-3 bg-red-500/10 border border-red-400/30 rounded-xl">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Features */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                  <Sparkles size={16} />
                  <span>Powered by Advanced AI Technology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal - Regular Signup */}
      {showVerification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-gray-300 text-sm">
                We've sent a verification code to <span className="font-semibold text-purple-300">{pendingEmail}</span>
              </p>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm p-3 bg-red-500/10 border border-red-400/30 rounded-xl">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Verify Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVerification(false)
                    setVerificationCode('')
                    setError('')
                  }}
                  className="w-full py-3 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                Didn't receive the code? Check your spam folder or contact support.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* SSO Verification Modal */}
      {showSSOVerification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Company SSO Verification</h2>
              <p className="text-gray-300 text-sm">
                Verification code sent to <span className="font-semibold text-cyan-300">{ssoEmail}</span>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Check your company email inbox
              </p>
            </div>

            <form onSubmit={handleSSOVerification} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Verification Code</label>
                <input
                  type="text"
                  value={ssoCode}
                  onChange={(e) => setSsoCode(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm p-3 bg-red-500/30 border border-red-400/30 rounded-xl">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>Verify & Sign In</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSSOVerification(false)
                    setSsoCode('')
                    setError('')
                  }}
                  className="w-full py-3 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                Didn't receive the code? Check your spam folder.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
