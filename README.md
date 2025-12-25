# create-cronex-app

Create a new Payload CMS + Next.js project with the Cronex template.

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

## After Creation

```bash
cd my-project
# Update .env with your database credentials
pnpm dev
```

Open http://localhost:3000

## License

MIT
