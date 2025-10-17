# AI Agent Frontend

A modern, responsive React frontend for an AI agent with AWS Cognito authentication, chat interface, and file upload capabilities.

## Features

- 🔐 **AWS Cognito Authentication** - Secure login/signup with SSO
- 💬 **Real-time Chat Interface** - Modern chat UI with message bubbles
- 📁 **File Upload** - Drag & drop file upload with progress tracking
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI/UX** - Beautiful gradients and animations
- 📊 **Chat History** - Manage multiple chat sessions
- 🚀 **AWS Amplify Ready** - Configured for easy deployment

## Tech Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **AWS Amplify** - Authentication and deployment
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Headless UI** - Accessible UI components

## Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account (for Cognito setup)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Cognito

1. Go to AWS Console → Cognito → User Pools
2. Create a new User Pool or use existing one
3. Update `src/amplifyconfiguration.js` with your credentials:

```javascript
const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_XXXXXXXXX', // Your User Pool ID
      userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Your App Client ID
      loginWith: {
        email: true,
        username: true,
        phone: false,
      },
      signUpVerificationMethod: 'code',
    },
  },
};
```

### 3. Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### 4. Build for Production

```bash
npm run build
```

## AWS Amplify Deployment

### Option 1: Amplify Console (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to AWS Amplify Console
3. Click "New app" → "Host web app"
4. Connect your repository
5. Amplify will automatically detect the build settings from `amplify.yml`

### Option 2: Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

## Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx    # Main chat interface
│   ├── FileUpload.jsx       # File upload modal
│   ├── ChatHistory.jsx     # Chat history sidebar
│   └── LoginPage.jsx       # Authentication page
├── amplifyconfiguration.js  # AWS Amplify config
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## Features Overview

### Authentication
- Email/password login and signup
- AWS Cognito integration
- Secure session management
- User profile display

### Chat Interface
- Real-time message display
- Typing indicators
- Message timestamps
- Responsive design
- Auto-scroll to latest messages

### File Upload
- Drag & drop interface
- Multiple file selection
- Upload progress tracking
- File type validation
- Preview capabilities

### Chat Management
- Create new chats
- Chat history
- Search functionality
- Rename/delete chats
- Message count tracking

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles in individual files

### Authentication
- Update `amplifyconfiguration.js` for different Cognito settings
- Modify `LoginPage.jsx` for custom auth UI
- Add additional auth providers in Amplify config

### Chat Features
- Extend `ChatInterface.jsx` for additional features
- Add real-time messaging with WebSocket
- Integrate with your LangGraph backend

## Environment Variables

Create a `.env` file for local development:

```env
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details