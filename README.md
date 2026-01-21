# create-cronex-app

Create a new Payload CMS + Next.js project with a single command.

## Usage

```bash
npx create-cronex-app my-project
```

## Interactive Mode

Run without flags to get an interactive wizard:

```bash
npx create-cronex-app
```

You'll be prompted to:
- Enter a project name
- Select a database adapter (PostgreSQL, MongoDB, SQLite)
- Choose additional features (better-auth, tRPC)
- Select a package manager
- Initialize git repository

## CLI Flags

```bash
npx create-cronex-app my-project \
  --database postgres \
  --better-auth \
  --trpc \
  --package-manager pnpm \
  --git \
  --yes
```

### Options

| Flag | Description |
|------|-------------|
| `-d, --database <type>` | Database adapter: `postgres`, `mongodb`, `sqlite` |
| `--better-auth` | Include better-auth for authentication |
| `--trpc` | Include tRPC for type-safe API |
| `-p, --package-manager <pm>` | Package manager: `pnpm`, `npm`, `yarn`, `bun` |
| `--git` | Initialize git repository |
| `--no-git` | Skip git initialization |
| `-y, --yes` | Skip prompts and use defaults |

## Defaults

When using `--yes`:
- Database: PostgreSQL
- Features: none
- Package manager: pnpm
- Git: initialized

## What's Included

The template includes:

- **Payload CMS 3.x** - Headless CMS with admin panel
- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - UI components
- **PostgreSQL/MongoDB/SQLite** - Database adapters
- **Live Preview** - Real-time content preview
- **SEO Plugin** - Meta tags and sitemap generation
- **Form Builder** - Dynamic form creation
- **Search Plugin** - Full-text search

### Optional Features

- **better-auth** - Modern authentication with social logins, replacing Payload's native auth
- **tRPC** - End-to-end type-safe APIs

## Project Structure

```
my-project/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (frontend)/      # Public routes
│   │   └── (payload)/       # Admin panel
│   ├── collections/         # Payload collections
│   ├── globals/             # Payload globals
│   ├── blocks/              # Content blocks
│   ├── components/          # React components
│   ├── lib/                 # Utilities (auth, etc.)
│   └── payload.config.ts    # Payload configuration
├── public/                  # Static assets
└── .env                     # Environment variables
```

## Getting Started

### Basic Setup

```bash
cd my-project
docker-compose up -d        # Start database (PostgreSQL/MongoDB)
pnpm dev                    # Start dev server
```

Open http://localhost:3000/admin to create your first admin user.

### With Better-Auth

If you selected better-auth, run the auth migration before starting:

```bash
cd my-project
docker-compose up -d        # Start database
pnpm db:auth:migrate        # Create better-auth tables
pnpm dev                    # Start dev server
```

Then visit http://localhost:3000/admin and:
1. Click "Create Account" tab
2. Enter your email and password
3. The first user automatically becomes admin

## Database Migrations

This template uses `push: true` by default, which means Payload automatically creates and syncs tables on startup. This is ideal for development.

For production, you may want to use migrations instead:

```bash
pnpm payload migrate:create   # Create a new migration
pnpm payload migrate          # Run pending migrations
```

To switch to migration-based workflow, set `push: false` in `src/db/index.ts`.

## Environment Variables

The CLI automatically generates a `.env` file with:

- `DATABASE_URL` - Database connection string
- `PAYLOAD_SECRET` - Secret for Payload JWT
- `NEXT_PUBLIC_SERVER_URL` - Server URL for CORS
- `BETTER_AUTH_SECRET` - Secret for better-auth (if enabled)

## Repository Structure

```
create-cronex-app/
├── src/           # CLI source code
├── template/
│   ├── base/      # Base Payload + Next.js template
│   └── extras/    # Optional feature files (better-auth, tRPC, db adapters)
├── dist/          # Compiled CLI
└── package.json
```

## License

MIT
