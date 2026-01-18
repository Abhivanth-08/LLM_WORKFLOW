# LLM Engineer Pro

A professional LLM engineering platform for analyzing, optimizing, and understanding large language models.

## Features

- **Dashboard**: Real-time metrics and activity monitoring
- **Tokenizer Lab**: Visualize text tokenization
- **Embeddings**: Vector space analysis
- **Attention Mechanism**: Attention pattern visualization
- **Context Window**: Recall performance analysis
- **Red Teaming**: Security risk assessment
- **Cost Router**: Smart model recommendation
- **Analytics**: Historical reports and trends

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # Layout components (Sidebar, MainLayout)
│   ├── modules/       # Feature modules (Dashboard, Tokenizer, etc.)
│   └── ui/            # Reusable UI components
├── lib/               # Utilities and helpers
├── pages/             # Page components
├── store/             # State management (Zustand)
└── App.tsx            # Main app component
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization

## License

MIT
