# 🚀 Personal Hub & Digital Garden

**Personal Hub** is a centralized ecosystem designed for developers who want to manage their professional identity (Portfolio), organize their continuous learning (Knowledge Base), and plan their productivity (Kanban), all within a modern and ultra-fast interface.

## ✨ Key Features

-   **💼 Dynamic Portfolio:** Project listing with technology tags and links.
-   **🌿 Digital Garden (Knowledge Base):** Organize links, notes, and studies with category filters.
-   **📋 Kanban Planner:** Manage your tasks with a persistent Drag-and-Drop interface.
-   **⌨️ Command Center (CMD+K):** Instant global search for quick navigation between projects and notes.
-   **🎨 Global Theme System:** 13 color palettes (including Brazil and Québec themes) synchronized via Supabase.
-   **🔐 Administrative Panel:** Full CRUD for all content, including image uploads to Supabase Storage.
-   **📈 Live Status:** Dynamic section showing what you are currently working on and learning.

## 🛠️ Tech Stack

-   **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** Vanilla CSS (Modern CSS Variables & Keyframes)
-   **Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, RLS)
-   **Testing:** [Vitest](https://vitest.dev/) & React Testing Library
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Local Installation and Configuration

### 1. Clone the repository
```bash
git clone <your-repository>
cd landing-pages
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Prepare the Database
Run the SQL scripts found in the `migrations/` folder and the `setup_supabase.sql` file in the SQL editor of your Supabase project to create the tables and row-level security (RLS) policies.

### 5. Run the development server
```bash
npm run dev
```
Access [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

To ensure everything is working correctly, run the automated test suite:
```bash
npm test
```

## 📦 Build and Deploy

### Packaging
To generate the optimized production version:
```bash
npm run build
```

### Deploy on Vercel
The project is ready to be hosted on [Vercel](https://vercel.com/):

1. Connect your GitHub repository to Vercel.
2. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the project settings on Vercel.
3. Vercel will automatically detect Next.js and deploy on every `git push`.

## 📖 How to Use

### Admin Access
To manage your projects and notes:
1. Go to `/login`.
2. Use your email and password registered in Supabase Auth.
3. Access `/admin` to use the dashboard.

### Keyboard Shortcuts
-   **CMD + K (or CTRL + K):** Opens the global search bar on any page.
-   **ESC:** Closes modals or the Command Center.

## 📁 Project Structure
- `src/app`: Routes and pages (App Router).
- `src/components`: Modular React components.
- `src/lib`: External library configurations (Supabase).
- `src/styles`: Global styles and theme variables.
- `src/test`: Automated test suite.
- `migrations/`: SQL scripts for the database.

---
© 2026 Developed with a focus on performance and technical elegance.
