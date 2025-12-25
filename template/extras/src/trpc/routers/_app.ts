import { router } from '../init'
import { exampleRouter } from './example'

export const appRouter = router({
  example: exampleRouter,
})

export type AppRouter = typeof appRouter
