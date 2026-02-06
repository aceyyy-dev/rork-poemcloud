import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const users: Map<string, { id: string; email: string; name: string; passwordHash: string; isPremium: boolean; createdAt: string }> = new Map();

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16) + str.length.toString(16);
}

function generateToken(userId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${userId}_${timestamp}_${random}`;
}

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      console.log('[Auth] Signup attempt for:', input.email);
      
      const normalizedEmail = input.email.toLowerCase().trim();
      
      if (users.has(normalizedEmail)) {
        console.log('[Auth] User already exists:', normalizedEmail);
        throw new Error('An account with this email already exists');
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const passwordHash = simpleHash(input.password);
      
      const newUser = {
        id: userId,
        email: normalizedEmail,
        name: input.name || normalizedEmail.split('@')[0],
        passwordHash,
        isPremium: false,
        createdAt: new Date().toISOString(),
      };

      users.set(normalizedEmail, newUser);
      console.log('[Auth] User created successfully:', userId);

      const token = generateToken(userId);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isPremium: newUser.isPremium,
          createdAt: newUser.createdAt,
        },
        token,
      };
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      console.log('[Auth] Login attempt for:', input.email);
      
      const normalizedEmail = input.email.toLowerCase().trim();
      const user = users.get(normalizedEmail);

      if (!user) {
        console.log('[Auth] User not found:', normalizedEmail);
        throw new Error('Invalid email or password');
      }

      const passwordHash = simpleHash(input.password);
      if (passwordHash !== user.passwordHash) {
        console.log('[Auth] Invalid password for:', normalizedEmail);
        throw new Error('Invalid email or password');
      }

      console.log('[Auth] Login successful:', user.id);
      const token = generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isPremium: user.isPremium,
          createdAt: user.createdAt,
        },
        token,
      };
    }),

  validateToken: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      const parts = input.token.split('_');
      if (parts.length < 3) {
        return { valid: false, user: null };
      }

      const userId = `${parts[0]}_${parts[1]}_${parts[2]}`;
      
      for (const user of users.values()) {
        if (user.id === userId) {
          return {
            valid: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              isPremium: user.isPremium,
              createdAt: user.createdAt,
            },
          };
        }
      }

      return { valid: false, user: null };
    }),

  updatePremiumStatus: publicProcedure
    .input(z.object({
      userId: z.string(),
      isPremium: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      console.log('[Auth] Updating premium status for:', input.userId, 'to:', input.isPremium);
      
      for (const [email, user] of users.entries()) {
        if (user.id === input.userId) {
          user.isPremium = input.isPremium;
          users.set(email, user);
          console.log('[Auth] Premium status updated');
          return { success: true };
        }
      }

      return { success: false };
    }),
});
