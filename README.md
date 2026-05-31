# Notes-Flow 🚀

A futuristic, premium SaaS note-taking and workspace management application built with Next.js 16, React Three Fiber, Framer Motion, and Zustand on the frontend, and Express.js with MongoDB on the backend. Experience the future of note-taking with stunning 3D visualizations, glassmorphism design, and smooth animations.

## 🏗️ Full-Stack Architecture

Notes-Flow implements a modern full-stack architecture with a clear separation of concerns:

### Frontend (React/Next.js)
- Built with Next.js 16 (App Router), React 19, TypeScript
- State management with Zustand
- Styling with Tailwind CSS v4 and glassmorphism effects
- Animations powered by Framer Motion and GSAP
- 3D visualizations using React Three Fiber and Drei

### Backend (Node.js/Express)
- RESTful API built with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication (access/refresh tokens)
- Google OAuth 2.0 integration
- Modular structure with controllers, models, routes, and middleware
- Input validation using express-validator
- Secure cookie handling with HttpOnly flags

This documentation covers both the frontend implementation details and the backend API workflows that power the application.

## ✨ Features

### 🎨 Design & UX
- **Glassmorphism UI**: Beautiful frosted glass effect with neon blue accents
- **Dark Futuristic Theme**: Pure black (#050505) with neon blue (#0084FF) highlights
- **Smooth Animations**: Framer Motion & GSAP animations throughout the app
- **Responsive Design**: Fully responsive from mobile to desktop
- **Premium Aesthetic**: Apple/Linear/Vercel inspired design system

### 🔐 Authentication
- **User Registration**: Sign up with email and password
- **Secure Login**: Email-based authentication with form validation
- **Protected Routes**: Dashboard and workspace pages require authentication
- **User Profiles**: Personalized user information and settings

### 📝 Note Management
- **Create Notes**: Create notes within workspaces
- **Edit Notes**: Full-featured note editor with live updates
- **Delete Notes**: Remove notes with confirmation
- **Note Preview**: See note titles and content snippets in lists
- **Tag System**: Organize notes with tags

### 📂 Workspaces
- **Multiple Workspaces**: Create multiple workspaces for different purposes
- **Workspace Management**: Create, view, and delete workspaces
- **Workspace Navigation**: Quick access to workspaces from sidebar
- **Note Organization**: All notes organized by workspace

### 🎯 Dashboard
- **Dashboard Home**: View all workspaces at a glance
- **Workspace View**: Browse all notes in a workspace
- **Quick Stats**: See note counts and creation dates
- **Sidebar Navigation**: Easy navigation between workspaces

### ⚙️ User Settings
- **Profile Page**: View and manage user profile information
- **Account Settings**: Access to password management and 2FA
- **Preferences**: Theme and notification controls
- **Logout**: Secure logout functionality

### 3️⃣ 3D Components (Ready for Integration)
- **Particle Field**: Animated particle background
- **Rotating Cube**: 3D rotating cube visualization
- **Framework**: React Three Fiber + Drei for 3D graphics

## 🛠 Tech Stack

### Frontend
- **Next.js 16**: Latest React framework with app router
- **React 19**: Latest React with Compiler support
- **TypeScript**: Full type safety
- **Tailwind CSS v4**: Utility-first styling
- **Framer Motion**: Advanced animations
- **GSAP**: Timeline animations
- **Lucide Icons**: Beautiful icon library

### 3D & Graphics
- **Three.js**: 3D library
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Useful utilities for React Three Fiber

### State Management
- **Zustand**: Lightweight state management
- **Mock Data**: Pre-configured stores with sample data

### Styling
- **Glassmorphism**: Custom CSS glass effects
- **Dark Theme**: Pure black background with neon blue accents
- **Animations**: Blob animations and scroll reveals

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- pnpm, npm, or yarn

### Installation

```bash
# Clone or download the project
cd notes-flow

# Install dependencies
pnpm install
# or
npm install

# Run the development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 📋 Project Structure

```
notes-flow/
├── app/
│   ├── layout.tsx                 # Root layout with dark theme
│   ├── globals.css                # Global styles with animations
│   ├── page.tsx                   # Landing page with hero
│   ├── auth/
│   │   ├── login/page.tsx        # Login page
│   │   └── signup/page.tsx       # Sign up page
│   └── dashboard/
│       ├── page.tsx              # Dashboard home
│       ├── workspace/[id]/page.tsx # Workspace notes list
│       ├── note/[id]/page.tsx     # Note editor
│       └── profile/page.tsx       # User profile page
├── components/
│   ├── hero-section.tsx           # Landing page hero
│   ├── navbar.tsx                 # Dashboard navbar
│   ├── sidebar.tsx                # Workspace sidebar
│   ├── 3d/
│   │   ├── particle-field.tsx     # Particle animation
│   │   └── rotating-cube.tsx      # 3D cube
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── store.ts                   # Zustand stores (auth, workspaces, notes)
│   └── utils.ts                   # Utility functions
├── public/                        # Static assets
├── tailwind.config.ts             # Tailwind configuration
└── package.json

```

## 🎨 Color System

- **Background**: #050505 (Pure black)
- **Foreground**: #FFFFFF (White)
- **Primary**: #0084FF (Neon Blue)
- **Secondary**: #1a1a1a (Dark gray)
- **Accent**: #0084FF (Neon Blue)
- **Muted**: #333333 (Medium gray)
- **Border**: #1a1a1a (Subtle borders)

## 🔄 User Flows

### Registration & Login
1. User visits landing page
2. Clicks "Get Started" → Sign up page
3. Fills form with name, email, password
4. Gets redirected to dashboard
5. Can also login with existing account

### Creating & Managing Notes
1. User enters dashboard
2. Selects workspace from grid or sidebar
3. Views all notes in workspace
4. Creates new note with "+ New Note" button
5. Edits note in full-screen editor
6. Can save or delete the note

### Workspace Management
1. User can create multiple workspaces
2. Each workspace contains multiple notes
3. Workspaces accessible from sidebar
4. Quick view from dashboard home

## 🌟 Key Features Implemented

✅ Landing page with hero section  
✅ Authentication (signup/login)  
✅ Dashboard with workspace grid  
✅ Workspace notes list with cards  
✅ Full note editor  
✅ User profile page  
✅ Responsive design  
✅ Glassmorphism UI  
✅ Smooth animations (Framer Motion)  
✅ State management (Zustand)  
✅ Protected routes  
✅ Mock data system  

## 📈 Future Enhancements

- Integrate 3D scenes into dashboard
- Real database integration (Supabase/Neon)
- Real-time collaboration
- AI-powered note suggestions
- Export notes to PDF/Markdown
- Search functionality
- Note sharing
- Folders within workspaces
- Rich text editor
- Note history & versioning
- Dark/Light theme toggle
- Multi-language support

## 🎯 Next Steps

1. **Backend Integration**: Connect to Supabase or Neon for persistent data
2. **3D Visualizations**: Integrate 3D scenes into dashboard
3. **Real-time Features**: Add WebSocket support for collaboration
4. **AI Features**: Integrate AI API for smart features
5. **Mobile App**: React Native version
6. **Deployment**: Deploy to Vercel

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^12.40.0",
    "zustand": "^5.0.14",
    "three": "^0.184.0",
    "@react-three/fiber": "^9.6.1",
    "@react-three/drei": "^10.7.7",
    "gsap": "^3.15.0",
    "axios": "^1.16.1",
    "lucide-react": "latest",
    "tailwindcss": "^4.0.0"
  }
}
```

## 🚀 Deployment

### Deploy to Vercel

```bash
vercel deploy
```

The app is optimized for Vercel and uses Next.js 16 best practices.

## 📝 Notes

- All data is currently mock/local (in Zustand stores)
- Authentication redirects work properly
- Protected routes prevent unauthorized access
- The app uses localStorage implicitly through Zustand
- For production, integrate with a real backend

## 🎓 Learning Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand.surge.sh/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)
- [MongoDB & Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 🔧 Backend Architecture & API Workflows

### 📂 Backend Structure

The backend follows a modular MVC-like structure:

```
BACKEND/
├── src/
│   ├── controllers/   # Request handlers (auth, notes, workspace, task)
│   ├── models/        # Mongoose schemas (User, Note, Workspace, Task)
│   ├── routes/        # API route definitions
│   ├── middleware/    # Custom middleware (auth, validation)
│   ├── utils/         # Utility functions (async handler, API response/error)
│   ├── validators/    # Input validation schemas
│   └── db/            # Database connection configuration
├── app.js             # Express app configuration
├── index.js           # Server entry point
├── package.json       # Backend dependencies
└── .env               # Environment variables
```

### 🔐 Authentication System

The backend implements a robust JWT-based authentication system with:

1. **Local Authentication** (email/password):
   - Secure password hashing using bcrypt
   - Access tokens (short-lived) and refresh tokens (long-lived)
   - HTTP-only cookies for secure token storage
   - Token refresh mechanism to maintain sessions

2. **Google OAuth 2.0 Integration**:
   - Initiates OAuth flow via `/api/v1/auth/google`
   - Handles callback with split logic for existing vs. new users
   - For new users: redirects to complete signup with temporary JWT
   - Username validation and account creation
   - Automatic login after successful OAuth completion

3. **Security Features**:
   - HttpOnly, Secure, SameSite cookie flags
   - Token expiration and refresh mechanisms
   - Protection against common vulnerabilities (XSS, CSRF via cookies)
   - Input validation and sanitization

### 📝 Core API Workflows

Based on the PRD documentation, here are the key backend workflows:

#### 1. User Authentication Flow
- **POST `/api/v1/auth/register`**: Local user registration with email/password
- **POST `/api/v1/auth/login`**: Local user login
- **GET `/api/v1/auth/google`**: Initiate Google OAuth flow
- **GET `/api/v1/auth/google/callback`**: Handle Google OAuth callback
- **POST `/api/v1/auth/google/complete-signup`**: Complete OAuth signup with username
- **POST `/api/v1/auth/refresh-token`**: Refresh access token using refresh token
- **POST `/api/v1/auth/logout`**: Clear authentication cookies
- **GET `/api/v1/auth/me`**: Get current authenticated user

#### 2. Workspace Management
- **GET `/api/v1/workspaces/`**: Get all workspaces for user
- **POST `/api/v1/workspaces/`**: Create new workspace (sets user as owner)
- **GET `/api/v1/workspaces/search?query=...`**: Search workspaces by name
- **PATCH `/api/v1/workspaces/:id/add`**: Add member to workspace (owner only)
- **PATCH `/api/v1/workspaces/:id/leave`**: Leave workspace (member)
- **DELETE `/api/v1/workspaces/:id`**: Delete workspace (owner only)

#### 3. Notes Management
- **GET `/api/v1/notes/:workspaceId`**: Get paginated notes for workspace
- **POST `/api/v1/notes/:workspaceId`**: Create new note in workspace
- **PATCH `/api/v1/notes/:noteId`**: Update note content/title
- **DELETE `/api/v1/notes/:noteId`**: Delete note
- **GET `/api/v1/notes/:workspaceId/search?query=...`**: Search notes in workspace

#### 4. Task Management (Kanban)
- **GET `/api/v1/tasks/:workspaceId`**: Get tasks assigned to current user in workspace
- **POST `/api/v1/tasks/:workspaceId`**: Create new task (workspace owner only)
- **PATCH `/api/v1/tasks/:taskId`**: Update task details
- **PATCH `/api/v1/tasks/:taskId/status`**: Update task status (pending/in-progress/completed)
- **PATCH `/api/v1/tasks/:taskId/assign`**: Reassign task to different user
- **DELETE `/api/v1/tasks/:taskId`**: Delete task

### 🗄️ Data Models

#### User Model
- `username`: Unique, lowercase username
- `email`: Unique email address
- `password`: Hashed password (for local auth)
- `googleId`: Google OAuth ID (for OAuth users)
- `refreshToken`: Hashed refresh token for token rotation
- `createdAt/updatedAt`: Timestamps

#### Workspace Model
- `name`: Workspace name
- `owner`: Reference to User (workspace creator)
- `members`: Array of User references with access
- `createdAt/updatedAt`: Timestamps

#### Note Model
- `title`: Note title
- `content`: Note content (markdown supported)
- `workspace`: Reference to Workspace
- `createdBy`: Reference to User (creator)
- `createdAt/updatedAt`: Timestamps

#### Task Model
- `title`: Task title
- `description`: Task description
- `workspace`: Reference to Workspace
- `assignedTo`: Reference to User (assignee)
- `status`: Enum ['pending', 'in-progress', 'completed']
- `createdBy`: Reference to User (creator)
- `createdAt/updatedAt`: Timestamps

### 🔄 Development Workflow

1. **Backend Setup**:
   ```bash
   cd BACKEND
   npm install
   # Configure .env file with required variables
   npm run dev  # Start development server with nodemon
   ```

2. **Environment Variables** (`.env`):
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/auth/google/callback
   
   FRONTEND_URL=http://localhost:3000
   
   MONGODB_URI=mongodb://localhost:27017/notesflow
   ```

3. **API Testing**:
   - The backend provides RESTful JSON APIs
   - All authenticated routes require valid access token in cookies
   - Error responses follow consistent format with status codes and messages
   - Successful responses include data payloads and status information

### ⚡ Key Features Implemented

✅ **Complete Authentication System** (local + Google OAuth)  
✅ **Workspace CRUD Operations** with member management  
✅ **Full Notes Management** (create, read, update, delete)  
✅ **Kanban-style Task Board** with status transitions  
✅ **Input Validation & Sanitization**  
✅ **Secure Token Management** (access/refresh tokens)  
✅ **Error Handling & Consistent API Responses**  
✅ **CORS Configuration** for frontend integration  
✅ **Modular, Maintainable Code Structure**  

### 🚀 Next Steps for Backend

- [ ] Add pagination to workspace and task endpoints
- [ ] Implement real-time updates with WebSockets
- [ ] Add file upload capabilities for notes
- [ ] Implement advanced search and filtering
- [ ] Add API rate limiting and enhanced security headers
- [ ] Create comprehensive API documentation (Swagger/OpenAPI)
- [ ] Add automated testing suite (unit and integration tests)
- [ ] Implement caching layer for improved performance
- [ ] Add audit logging for administrative actions

## 📄 License

MIT - Feel free to use this project as a template or learning resource.

## 💬 Support

For questions or issues, check the documentation or create an issue in your repository.

---

**Built with ❤️ using Node.js and Next.js 16**
