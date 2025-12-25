import PageTemplate, { generateMetadata } from './[slug]/page'

export default PageTemplate

export { generateMetadata }

export function Welcome() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-10">
      <div className="max-w-2xl text-center">
        <h1 className="text-primary mb-4 text-5xl font-bold tracking-tight">
          CRONEX-PAYLOAD-TEMPLATE
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Your Payload CMS project is ready. Follow the steps below to get started.
        </p>

        <div className="space-y-6 text-left">
          <div>
            <h2 className="mb-2 text-xl font-semibold">1. Access the Admin Panel</h2>
            <p className="text-muted-foreground">
              Visit{' '}
              <a href="/admin" className="text-primary underline hover:no-underline">
                /admin
              </a>{' '}
              to create your first admin user and access the dashboard.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">2. Create a Home Page</h2>
            <p className="text-muted-foreground">
              In the admin panel, go to <strong>Pages</strong> and create a new page with the slug{' '}
              <code className="bg-muted rounded px-1.5 py-0.5 text-sm">home</code> to replace this
              welcome screen.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">3. Build Your Site</h2>
            <p className="text-muted-foreground">
              Use the layout builder to add hero sections, content blocks, and more. Customize
              collections and components to fit your needs.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">4. Clean Up</h2>
            <p className="text-muted-foreground">
              Once your home page is created, remove this welcome screen by:
            </p>
            <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1">
              <li>
                Delete the <code className="bg-muted rounded px-1.5 py-0.5 text-sm">Welcome</code>{' '}
                component from{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                  src/app/(frontend)/page.tsx
                </code>
              </li>
              <li>
                Remove the{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                  if (!page && slug === &apos;home&apos;)
                </code>{' '}
                check from{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                  src/app/(frontend)/[slug]/page.tsx
                </code>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6">
          <p className="text-muted-foreground text-sm">
            Check out the{' '}
            <a
              href="https://payloadcms.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              Payload documentation
            </a>{' '}
            for more information.
          </p>
        </div>
      </div>
    </div>
  )
}
