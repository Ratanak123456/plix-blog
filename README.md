# PlixBlog Frontend ⚡️

A modern, high-performance blog platform featuring a unique **comic book aesthetic**. Built with Next.js 16, TypeScript, and Tailwind CSS 4, this project combines a bold visual style with a robust technical foundation for a unique reading and writing experience.

![PlixBlog Banner](public/talk.jpg)

## 🎨 Visual Identity

The platform features a distinct "Comic Strip" design language:
- **Bold Typography:** Headlines powered by `Bangers` and metadata with `Oswald` for a classic comic feel.
- **Styling Details:** 
  - **Comic Border:** Thick ink-stroke custom borders.
  - **Halftone Patterns:** Background dots for vintage shading.
  - **Speech Bubbles:** Stylized callouts for content.
  - **Color Palette:** High-contrast vibrant backgrounds with accent colors.
- **Animations:** Powered by [Framer Motion](https://www.framer.com/motion/) for smooth, staggered entries and interactive effects.

## 🚀 Key Features

- **Daily Issue (Featured):** A dynamic hero section showcasing trending stories.
- **Origin Stories:** A dedicated feed for the latest published blog posts.
- **Rich Text Editor:** Fully integrated [Quill.js](https://quilljs.com/) for a seamless writing experience.
- **User Profiles:** Personalized dashboards with author stats and content.
- **Interactive Engagement:** Like, bookmark, and share functionalities.
- **Dynamic Routing:** Slug-based SEO-friendly post delivery and username-based profiles.
- **Fully Responsive:** Optimized layouts from mobile "strips" to desktop "spreads."

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Base UI](https://base-ui.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Animation:** [Framer Motion](https://www.framer.com/motion/)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd blogs-frontend
   ```

2. **Configure Environment:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://plix-blog-api.onrender.com/api/v1
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

- `app/`: Next.js App Router (pages, layouts, and route handlers).
- `components/`: Feature-organized UI components (home, posts, users, write).
- `hooks/`: Reusable custom React hooks.
- `lib/`: Core logic, Redux store, slices, and API services.
- `ui/`: Design system primitives (buttons, inputs, cards) powered by Shadcn/UI patterns.
- `public/`: Static assets like images and SVG icons.

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with hot-reloading. |
| `npm run build` | Compiles the application for production deployment. |
| `npm run start` | Starts the production server after a build. |
| `npm run lint` | Runs ESLint to identify and report on patterns found in ECMAScript/JavaScript code. |

---

Built with ❤️ for tech enthusiasts and comic lovers.
