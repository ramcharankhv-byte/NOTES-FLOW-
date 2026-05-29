# Notes-Flow Development Guide

## Project Overview

Notes-Flow is a futuristic SaaS note-taking application showcasing modern web development practices with Next.js 16, TypeScript, Framer Motion, and 3D graphics capabilities.

## Architecture

### 1. **Pages & Routing** (Next.js App Router)

```
/ → Landing Page
/auth/login → Login Page
/auth/signup → Sign Up Page
/dashboard → Dashboard Home (Workspace Grid)
/dashboard/workspace/[id] → Workspace Notes List
/dashboard/note/[id] → Note Editor
/dashboard/profile → User Profile Page
```

### 2. **State Management** (Zustand Stores)

**Auth Store** (`useAuthStore`)
- Manages user authentication state
- Methods: `login()`, `signup()`, `logout()`, `setUser()`
- Stores: `user`, `isAuthenticated`, `isLoading`

**Workspace Store** (`useWorkspaceStore`)
- Manages workspace data and selection
- Methods: `fetchWorkspaces()`, `createWorkspace()`, `selectWorkspace()`, `updateWorkspace()`, `deleteWorkspace()`
- Stores: `workspaces`, `currentWorkspace`, `isLoading`

**Note Store** (`useNoteStore`)
- Manages note operations
- Methods: `fetchNotes()`, `createNote()`, `selectNote()`, `updateNote()`, `deleteNote()`
- Stores: `notes`, `currentNote`, `isLoading`

### 3. **Component Structure**

**Layout Components**
- `Navbar` - Top navigation with user menu
- `Sidebar` - Workspace navigation

**Page Components**
- `HeroSection` - Landing page hero with CTAs
- `DashboardPage` - Workspace grid view
- `WorkspaceNotesPage` - Notes list in workspace
- `NoteEditorPage` - Full note editor
- `ProfilePage` - User profile settings

**3D Components**
- `ParticleField` - Animated particles with Three.js
- `RotatingCube` - 3D rotating cube

## Development Workflow

### Adding a New Feature

1. **Create the Page Component**
   ```tsx
   // app/dashboard/new-feature/page.tsx
   'use client'
   import { useAuthStore } from '@/lib/store'
   import { useRouter } from 'next/navigation'
   
   export default function NewFeaturePage() {
     const { user, isAuthenticated } = useAuthStore()
     const router = useRouter()
     
     // Feature logic here
   }
   ```

2. **Update State if Needed**
   ```ts
   // lib/store.ts - Add to relevant store
   newMethod: async () => {
     // Your logic
   }
   ```

3. **Update Navigation**
   - Add link in navbar or sidebar
   - Update routing structure if needed

4. **Style with Tailwind**
   - Use existing design tokens
   - Follow glassmorphism pattern
   - Add animations with Framer Motion

### Styling Guidelines

**Colors**
- Use CSS custom properties defined in `globals.css`
- Primary blue: `#0084FF`
- Background: `#050505` (pure black)
- Glass effect: `bg-black/50` with `backdrop-blur`

**Animations**
- Use Framer Motion for React components
- Use `motion.div` for animated containers
- Use `variants` for animation groups

```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div
  initial="hidden"
  animate="visible"
  variants={variants}
>
  Content
</motion.div>
```

**Glassmorphism**
```tsx
<div className="glass rounded-lg p-6">
  {/* Content with glass effect */}
</div>
```

## Common Tasks

### 1. Add a New Store to Zustand

```ts
// lib/store.ts
interface NewStore {
  data: any[]
  isLoading: boolean
  fetchData: () => Promise<void>
  addData: (item: any) => Promise<void>
}

export const useNewStore = create<NewStore>((set) => ({
  data: [],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true })
    // Fetch logic
    set({ data: newData, isLoading: false })
  },
  addData: async (item) => {
    // Add logic
  },
}))
```

### 2. Add Authentication Protection

```tsx
'use client'

import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return <div>Protected Content</div>
}
```

### 3. Create an Animated Card

```tsx
<motion.div
  whileHover={{ y: -4 }}
  className="glass rounded-lg p-6 cursor-pointer group"
>
  <div className="group-hover:opacity-100 opacity-0 transition-opacity">
    {/* Hidden on hover content */}
  </div>
</motion.div>
```

### 4. Add a Form with Validation

```tsx
const [email, setEmail] = useState('')
const [error, setError] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  
  if (!email.includes('@')) {
    setError('Invalid email')
    return
  }
  
  // Submit logic
}

return (
  <form onSubmit={handleSubmit}>
    {error && <div className="text-red-400">{error}</div>}
    <input value={email} onChange={(e) => setEmail(e.target.value)} />
  </form>
)
```

## Performance Optimization

1. **Code Splitting**: Pages are automatically code-split by Next.js
2. **Image Optimization**: Use next/image for images
3. **Animation Performance**: Use GPU-accelerated transforms
   - Use `transform` instead of `width/height`
   - Use `opacity` instead of `display: none/block`
4. **Component Memoization**: Memoize expensive components if needed

## Testing

### Manual Testing Checklist

- [ ] Signup flow works end-to-end
- [ ] Login authenticates user
- [ ] Workspace creation works
- [ ] Notes can be created/edited/deleted
- [ ] Navigation between pages works
- [ ] Protected routes redirect if not authenticated
- [ ] Responsive design works on mobile
- [ ] Animations perform smoothly

### Testing Commands

```bash
# Build check
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Debugging

### Debug Logs

Use `console.log("[v0] ...")` for debugging:

```tsx
console.log("[v0] User data received:", userData)
console.log("[v0] Store state:", useAuthStore.getState())
```

### Browser DevTools

- React DevTools: Inspect component tree
- Framer Motion DevTools: Debug animations
- Network Tab: Monitor API calls
- Console: Check for errors/warnings

### Common Issues

**Issue**: Routes not found
- Solution: Check that page.tsx files are in correct directories

**Issue**: Animations not smooth
- Solution: Check GPU acceleration, use `transform` not `width`

**Issue**: State not updating
- Solution: Check Zustand store, ensure set() is called

## File Naming Conventions

- **Components**: `PascalCase` (e.g., `HeroSection.tsx`)
- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **Hooks**: `use` prefix in lowercase (e.g., `useAuth.ts`)
- **Types**: `PascalCase` with `.ts` extension
- **Utilities**: `lowercase` with `.ts` extension

## Commit Message Convention

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Restructure component
perf: Improve performance
test: Add tests
```

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Zustand Store](https://zustand.surge.sh/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Tips & Best Practices

1. **Keep Components Small**: Break down large components
2. **Use TypeScript**: Full type safety for reliability
3. **Animate Thoughtfully**: Animations should enhance UX, not distract
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Performance First**: Monitor Core Web Vitals
6. **Accessible**: Use semantic HTML, proper ARIA labels
7. **Test Regularly**: Manual testing during development

## Future Improvements

- Add unit and integration tests
- Setup CI/CD pipeline
- Add error logging/monitoring
- Implement real API integration
- Add database migrations
- Setup environment configurations
- Add analytics
