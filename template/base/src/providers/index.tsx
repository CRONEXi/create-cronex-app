import { ThemeProvider } from './theme/theme-provider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>
}
