# AI for Coders - Web Application

A modern web application built with Next.js 14, TypeScript, and Supabase for learning to think like a programmer with AI assistance.

## Tech Stack

- **Frontend**: Next.js 14 (React, TypeScript)
- **Backend**: Next.js API Routes
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Features

### Phase 1 (Current)
- Public landing page with value proposition
- User registration with email/password
- User login with session management
- Onboarding flow for user preferences
- Protected routes for authenticated users
- Responsive design for mobile and desktop

### Phase 2+ (Coming Soon)
- Dashboard with learning challenges
- AI mentor chat interface
- Progress tracking
- Concept explorer

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-for-coders-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (this may take a few minutes)
3. In your Supabase dashboard:
   - Go to Settings → API
   - Copy your Project URL and anon public key

### 4. Create the Database Table

In your Supabase dashboard, go to the **SQL Editor** and run the following query:

```sql
-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT NULL,
  learning_goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 6. Enable Email Confirmations (Optional)

In Supabase, go to:
- Authentication → Settings
- Enable "Confirm email"
- Set up email templates as needed

For development, you can disable email confirmations to make testing easier:
- Go to Authentication → Settings
- Disable "Confirm email"
- This allows users to sign up without email verification

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-for-coders-web/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── auth/                     # Authentication pages
│   │   ├── signup/page.tsx       # Sign up form
│   │   ├── login/page.tsx        # Login form
│   │   └── onboarding/page.tsx   # Onboarding flow
│   ├── dashboard/                # Protected routes
│   │   └── page.tsx              # Dashboard placeholder
│   ├── api/                      # API routes
│   │   └── auth/                 # Auth endpoints
│   │       ├── signup/route.ts   # Signup API
│   │       ├── login/route.ts    # Login API
│   │       ├── logout/route.ts   # Logout API
│   │       └── onboarding/route.ts
├── components/                   # React components
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer
│   └── auth/                     # Auth-specific components
│       └── AuthForm.tsx          # Auth form wrapper
├── lib/                          # Utility libraries
│   ├── supabase.ts               # Supabase client
│   └── types.ts                  # TypeScript types
├── public/                       # Static assets
│   └── assets/                   # Images, icons
├── middleware.ts                 # Route protection middleware
├── .env.local.example            # Environment template
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## Authentication Flow

1. **Sign Up**: User enters email/password → Creates Supabase auth user → Creates user profile → Redirects to onboarding
2. **Login**: User enters credentials → Authenticates with Supabase → Sets session cookies → Redirects to dashboard
3. **Onboarding**: User selects experience level and learning goals → Updates profile → Redirects to dashboard
4. **Protected Routes**: Middleware checks session → Redirects to login if not authenticated

## API Endpoints

### POST `/api/auth/signup`
Creates a new user account

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST `/api/auth/login`
Authenticates an existing user

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST `/api/auth/logout`
Logs out the current user

### POST `/api/auth/onboarding`
Saves user onboarding preferences

**Body:**
```json
{
  "experience_level": "beginner",
  "learning_goals": "Learn Python basics"
}
```

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Digital Ocean App Platform

Remember to set the `NEXT_PUBLIC_APP_URL` environment variable to your production URL.

## Troubleshooting

### "Not authenticated" errors
- Check that cookies are being set in your browser
- Verify `.env.local` has correct Supabase credentials
- Check console for CORS errors

### Database errors
- Ensure you've run the SQL setup queries
- Check that RLS policies are correctly configured
- Verify Supabase project is active

### Build errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors with `npm run type-check`

## Contributing

This is Phase 1 of an 8-week development plan. Future phases will include:
- Dashboard with challenges
- AI mentor chat
- Progress tracking
- OAuth integrations
- Password reset emails

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues or questions:
- Check the Supabase docs: https://supabase.com/docs
- Check the Next.js docs: https://nextjs.org/docs
- Open an issue in the repository
