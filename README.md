# Notes-Flow 🚀

A futuristic, premium SaaS note-taking application built with Next.js 16, React Three Fiber, Framer Motion, and Zustand. Experience the future of note-taking with stunning 3D visualizations, glassmorphism design, and smooth animations.

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

## 📄 License

MIT - Feel free to use this project as a template or learning resource.

## 💬 Support

For questions or issues, check the documentation or create an issue in your repository.

---

**Built with ❤️ using Node.js and Next.js 16**
