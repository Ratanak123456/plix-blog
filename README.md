# PlixBlog Frontend ⚡️

A modern blog platform with a unique comic book aesthetic.

## 🔗 Live Deployment

**Website:** https://plix-blog.vercel.app

## 🔗 Related

- **Backend API:** https://plix-blog-api.onrender.com/api/v1

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **State Management:** Redux Toolkit & RTK Query
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, Lucide Icons, Shadcn UI
- **Forms:** React Hook Form with Zod
- **Animation:** Framer Motion

## 🏗 Features

- Comic book visual design
- User Authentication (Login/Register)
- Profile Management
- Create/Edit/Delete Posts
- Rich Text Editor (Quill.js)
- Like, Bookmark, Comment System
- Search & Filter Posts
- Fully Responsive

## 📦 Getting Started

### Prerequisites

- Node.js 20+

### Installation

```bash
cd blogs-frontend
npm install
```

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://plix-blog-api.onrender.com/api/v1
```

### Run Development

```bash
npm run dev
```

Open http://localhost:3000

### Build Production

```bash
npm run build
npm run start
```

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

Built with ❤️ for PlixBlog
