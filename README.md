# PlixBlog ⚡️

A modern, high-performance blog platform with a unique **comic book aesthetic**. Built with Next.js 16, TypeScript, and Tailwind CSS 4, this project combines a bold visual style with a robust technical foundation.

![PlixBlog](public/talk.jpg)

## 🎨 Visual Identity
The platform features a distinct "Comic Strip" design language:
- **Typography:** Uses `Bangers` for bold headlines and `Oswald` for sharp metadata, giving it a classic comic feel.
- **Styling:** 
  - **Comic Border:** Custom borders that mimic thick ink strokes.
  - **Halftone Patterns:** Background elements using dots to create shading, a hallmark of traditional comic printing.
  - **Speech Bubbles:** Content often presented within stylized callouts for an interactive feel.
  - **Color Palette:** High-contrast backgrounds with vibrant primary and accent colors.
- **Interactions:** Smooth animations powered by Framer Motion, featuring hover-tilt effects and staggered entries.

## 🚀 Features
- **Featured "Daily Issue":** A dynamic hero section showcasing the most-liked stories.
- **Origin Stories:** A dedicated section for the latest published blog posts.
- **Interactive Posts:** Users can like, bookmark, and share stories.
- **Rich Text Editor:** Fully integrated Quill editor for creating and editing blog posts.
- **User Profiles:** Personalized user pages showing author stats and published works.
- **Dynamic Routing:** Slug-based post delivery and username-based profile access.
- **Responsive Design:** Optimized for everything from mobile "strips" to desktop "spreads."
- **Feedback & Community:** Integrated reviews, FAQ, and feedback forms.

## 🛠 Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Editor:** [Quill.js](https://quilljs.com/)

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blogs-frontend
   ```

2. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://plix-blog-api.onrender.com/api/v1
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components, organized by feature (home, posts, users, write).
- `hooks/`: Custom React hooks.
- `lib/`: Core logic, including Redux store, slices, and API services.
- `ui/`: Base UI primitives (buttons, inputs, cards) powered by Shadcn/UI patterns.
- `public/`: Static assets (images, icons).

## 📜 Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.

---

Built with ❤️ for tech enthusiasts and comic lovers.
