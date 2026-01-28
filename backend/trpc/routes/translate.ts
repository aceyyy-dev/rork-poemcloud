import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const MYMEMORY_API = "https://api.mymemory.translated.net/get";

export const translateRouter = createTRPCRouter({
  translatePoem: publicProcedure
    .input(
      z.object({
        text: z.string(),
        target: z.string(),
        source: z.string().default("en"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('[Translate] Calling MyMemory API:', {
          source: input.source,
          target: input.target,
          textLength: input.text.length,
        });

        const url = `${MYMEMORY_API}?q=${encodeURIComponent(input.text)}&langpair=${input.source}|${input.target}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        if (!response.ok) {
          console.error('[Translate] API error:', response.status);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Translation unavailable right now. Try again.',
          });
        }

        const data = await response.json();
        console.log('[Translate] Response status:', data.responseStatus);

        if (data.responseStatus !== 200) {
          console.error('[Translate] API returned error:', data.responseDetails);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Translation unavailable right now. Try again.',
          });
        }

        if (!data.responseData?.translatedText) {
          console.error('[Translate] No translatedText in response:', data);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Translation unavailable right now. Try again.',
          });
        }

        console.log('[Translate] Translation successful');

        return {
          translatedText: data.responseData.translatedText,
        };
      } catch (error) {
        console.error('[Translate] Error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Translation unavailable right now. Try again.',
        });
      }
    }),
});
