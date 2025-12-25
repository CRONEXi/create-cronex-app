# cronex-payload-template

A customized Payload CMS website template with opinionated defaults and modern tooling.

## What's Different

This template extends the official Payload Website Template with the following customizations:

### Naming Conventions

- **kebab-case everywhere** - All files, folders, and components use kebab-case for consistency
  - `components/call-to-action/` instead of `components/CallToAction/`
  - `render-blocks.tsx` instead of `RenderBlocks.tsx`

### Tailwind v4

- Upgraded to **Tailwind CSS v4** with the new configuration format
- Uses CSS-based configuration instead of `tailwind.config.js`

### Theming with next-themes

- **next-themes** package for theme management
- Built-in dark/light mode support with system preference detection
- Easy theme switching with `useTheme()` hook

### Authentication Options

- **better-auth** as an alternative auth provider for complex authentication needs
- Supports social logins, multi-factor auth, and more
- Can be used alongside or instead of Payload's built-in auth

### tRPC Integration

- **tRPC** setup for complex applications requiring type-safe APIs
- End-to-end type safety between client and server
- Ideal for apps that need more than just Payload's REST/GraphQL APIs

## Quick Start

1. Clone the template
2. `cp .env.example .env` and configure environment variables
3. `pnpm install && pnpm dev`
4. Open `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Frontend routes
│   └── (payload)/           # Payload admin routes
├── blocks/                  # Layout builder blocks
├── collections/             # Payload collection configs
├── components/              # React components (kebab-case)
├── globals/                 # Payload global configs
├── heros/                   # Hero components
└── payload.config.ts        # Payload configuration
```

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Generate Payload types
pnpm generate:types

# Generate import map
pnpm generate:importmap
```

## Deployment

Deploy as any Next.js application. Supports:

- Vercel (with `@payloadcms/db-vercel-postgres`)
- Docker
- Self-hosted VPS
- Any Node.js hosting platform
