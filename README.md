# AI for Coders - CodeGym-Style Educational Platform

A comprehensive programming education platform built with Next.js, Supabase, and TypeScript. Learn Python, Java, and C with structured courses, practice tasks, and progress tracking.

## Features

### Authentication System
- **Email + Password** - Traditional signup with email verification
- **OTP (One-Time Password)** - Passwordless login via email OTP
- Auto profile creation on signup
- Session persistence with secure cookies

### Learning Platform
- **3 Programming Languages**: Python, Java, and C
- **Structured Courses**: Multiple courses per language with progressive difficulty
- **Interactive Lessons**: Rich content with code examples
- **Practice Tasks**: Hands-on coding exercises with immediate feedback
- **Progress Tracking**: Track completed lessons and solved tasks

### Dashboard & Profile
- Personal dashboard with learning stats
- Progress analytics
- Profile customization
- Learning preferences

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-for-coders-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Go to your Supabase project's SQL Editor
2. Run the contents of `supabase-setup.sql` to create all tables, policies, and seed data

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-for-coders-web/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── explore/                 # Course exploration
│   │   ├── page.tsx             # Language selection
│   │   └── [language]/          # Language-specific routes
│   │       ├── [course]/        # Course-specific routes
│   │       │   └── [lesson]/    # Lesson + tasks
│   ├── auth/                    # Authentication pages
│   │   ├── email-password/      # Email + password signup
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page (redirects to email-password)
│   │   ├── otp/                 # OTP request page
│   │   ├── otp-verify/          # OTP verification page
│   │   └── onboarding/          # Onboarding flow
│   ├── dashboard/               # Protected routes
│   │   ├── page.tsx             # Dashboard home
│   │   ├── progress/            # Progress tracking
│   │   └── profile/             # Profile settings
│   └── api/                     # API routes
│       ├── auth/                # Auth endpoints
│       ├── content/             # Content endpoints
│       └── progress/            # Progress endpoints
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── LanguageCard.tsx         # Language selection card
│   ├── CourseCard.tsx           # Course card with progress
│   ├── CodeEditor.tsx           # Code input component
│   ├── ProgressTracker.tsx      # Lesson progress sidebar
│   └── auth/                    # Auth components
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── types.ts                 # TypeScript types
└── supabase-setup.sql           # Database schema
```

## Authentication Flow

### Email + Password
1. User visits `/auth/signup` or `/auth/email-password`
2. Enters email and password
3. Creates account and receives confirmation email
4. Confirms email
5. Redirected to onboarding
6. Profile created via database trigger
7. Redirected to dashboard

### OTP (Passwordless)
1. User visits `/auth/otp`
2. Enters email address
3. Receives 6-digit OTP via email
4. Enters OTP at `/auth/otp-verify`
5. Account created/verified automatically
6. Redirected to onboarding
7. Profile created via database trigger
8. Redirected to dashboard

## Database Schema

### Tables
- `user_profiles` - User data and preferences
- `languages` - Programming languages
- `courses` - Courses per language
- `lessons` - Lessons within courses
- `tasks` - Practice tasks per lesson
- `user_progress` - User progress tracking

### Row Level Security (RLS)
- Public read access for all content tables
- User-specific access for progress and profiles

## API Routes

### Auth
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/signup` - Email/password signup
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/user` - Get current user
- `PUT /api/auth/profile` - Update profile

### Content
- `GET /api/content/languages` - Get all languages
- `GET /api/content/courses` - Get courses by language
- `GET /api/content/lessons` - Get lessons by course

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Save task progress

## Available Courses

### Python
1. Python Basics - Variables, data types, operations
2. Data Structures - Lists, dictionaries, sets, tuples
3. Functions & Modules - Reusable code patterns
4. File Handling - Reading and writing files

### Java
1. Java Syntax - Variables, data types, operators
2. OOP Concepts - Classes, inheritance, polymorphism
3. Collections Framework - Lists, Sets, Maps
4. Exception Handling - Error management

### C
1. C Basics - Variables, types, control structures
2. Pointers & Arrays - Memory and addresses
3. Functions - Function definition and usage
4. File I/O - File operations

## Development

### Commands
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run type-check # Run TypeScript checks
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_APP_URL` | Application URL (for redirects) |

## License

MIT
