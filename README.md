# Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful UI with shadcn/ui components
- 🌐 Multi-language support (English & French)
- 📱 Fully responsive design
- ✉️ Contact form integration with Supabase
- 🔐 Authentication system
- 📝 Dashboard for managing content
- 📄 Resume section with download option

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
bun install
# or npm install
```

### Development

```bash
bun run dev
# or npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
bun run build
# or npm run build
```

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/sections/` - Section components for portfolio
- `src/contexts/` - Global state management
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `supabase/` - Database migrations and functions

## Environment Variables

Create a `.env.local` file with your Supabase credentials and other configuration.

## License

All rights reserved.

