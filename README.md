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

- **better-auth** - Modern authentication with social logins
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
│   └── payload.config.ts    # Payload configuration
├── public/                  # Static assets
└── .env                     # Environment variables
```

## After Creation

```bash
cd my-project
# Update .env with your database credentials
pnpm dev
```

Open http://localhost:3000

## Repository Structure

```
create-cronex-app/
├── src/           # CLI source code
├── template/      # Payload + Next.js template
├── dist/          # Compiled CLI
└── package.json
```

## License

MIT
