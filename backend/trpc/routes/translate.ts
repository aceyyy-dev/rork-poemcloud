import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const MYMEMORY_API = "https://api.mymemory.translated.net/get";
// MyMemory API free tier has a limit of ~500 characters per request
// Longer texts may result in truncated or malformed responses
const MAX_TEXT_LENGTH = 500;

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
        // Validate text length to prevent API issues
        if (input.text.length > MAX_TEXT_LENGTH) {
          console.warn('[Translate] Text too long:', input.text.length);
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Text is too long for translation. Please try a shorter poem.',
          });
        }

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

        // Parse JSON with proper error handling for malformed responses
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('[Translate] JSON parse error:', jsonError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse translation response. Please try again.',
          });
        }

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
