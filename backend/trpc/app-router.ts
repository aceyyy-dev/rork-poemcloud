import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { translateRouter } from "./routes/translate";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  translate: translateRouter,
});

export type AppRouter = typeof appRouter;
