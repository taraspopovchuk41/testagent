# AI Agent Frontend

A modern, responsive React frontend for an AI agent with AWS Cognito authentication, chat interface, and file upload capabilities.

## Features

- 🔐 **AWS Cognito Authentication** - Secure login/signup with OIDC
- 💬 **Real-time Chat Interface** - Modern chat UI with message bubbles
- 📁 **File Upload** - Drag & drop file upload with progress tracking
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI/UX** - Beautiful gradients and animations
- 📊 **Chat History** - Manage multiple chat sessions
- 🚀 **AWS Ready** - Configured for easy deployment to CloudFront

## Tech Stack

- **React 19** - Latest React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **AWS Cognito** - Authentication with OIDC
- **react-oidc-context** - OIDC authentication library
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

📖 **See [COGNITO_SETUP.md](./COGNITO_SETUP.md) for detailed AWS Cognito configuration instructions.**

Quick setup:
1. Copy `.env.example` to `.env` (already done)
2. Update `.env` with your AWS Cognito credentials
3. Configure callback URLs in AWS Cognito Console (see COGNITO_SETUP.md)


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
├── contexts/
│   └── AuthContext.jsx     # Authentication context with Cognito
├── App.jsx                 # Main app component
├── main.jsx               # App entry point with OIDC setup
└── index.css              # Global styles
```

## Features Overview

### Authentication
- Email/password login and signup via AWS Cognito Hosted UI
- OIDC-based authentication with react-oidc-context
- Secure token management
- Automatic token refresh
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
- Update `.env` for different Cognito settings
- Modify `LoginPage.jsx` for custom auth UI
- Update `src/contexts/AuthContext.jsx` for additional auth logic
- Configure Cognito Hosted UI in AWS Console for branding

### Chat Features
- Extend `ChatInterface.jsx` for additional features
- Add real-time messaging with WebSocket
- Integrate with your LangGraph backend

## Environment Variables

A `.env` file has been created for local development. See `.env.example` for all available options:

```env

```

⚠️ **Important:** Never commit `.env` file to version control. It's already in `.gitignore`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details