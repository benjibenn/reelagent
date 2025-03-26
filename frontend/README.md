# ReelAgent Frontend

A modern web application for generating and managing UGC (User Generated Content) using AI. Built with React, TypeScript, and Vite.

## Features

- 🚀 Modern React with TypeScript
- ⚡️ Lightning-fast builds with Vite
- 🎨 Beautiful UI components with shadcn/ui
- 🎯 State management with React Query
- 🔐 Authentication with Supabase
- 📱 Responsive design with Tailwind CSS
- 🌙 Dark mode support
- 📊 Data visualization with Recharts
- 🔄 Form handling with React Hook Form
- ✨ Modern animations and transitions

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Application configuration
├── contexts/      # React context providers
├── hooks/         # Custom React hooks
├── integrations/  # Third-party integrations (Supabase)
├── lib/           # Utility functions and helpers
├── pages/         # Page components
├── services/      # API and service layer
└── App.tsx        # Root application component
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the frontend directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BASE_URL=your_base_url
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Dependencies

### Production Dependencies
- React 18.3
- React Router DOM 6.26
- Supabase JS Client
- TanStack Query (React Query)
- shadcn/ui components (Radix UI)
- Tailwind CSS
- React Hook Form
- Zod for validation
- Recharts for data visualization

### Development Dependencies
- TypeScript 5.5
- Vite 5.4
- ESLint
- PostCSS
- Tailwind CSS plugins

## Deployment

### Production Build

To create a production build:

```sh
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

1. **Vercel (Recommended)**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

2. **Manual Deployment**
   - Build the project
   - Deploy the `dist` directory to your hosting provider

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_BASE_URL` | Application base URL | Yes |

## Browser Support

The application supports all modern browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.