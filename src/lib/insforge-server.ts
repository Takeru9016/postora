/**
 * insforge-server.ts
 *
 * Server-only InsForge client factory for Next.js App Router.
 *
 * Usage (Server Component, Route Handler, Server Action):
 *
 *   import { createInsforgeServerClient } from '@/lib/insforge-server';
 *
 *   const insforge = await createInsforgeServerClient();
 *   const { data } = await insforge.database.from('table').select();
 *
 * The client is scoped to the current Clerk session — every call is
 * automatically signed with the user's Clerk JWT so InsForge RLS
 * policies see the correct `sub` claim.
 */

import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { createClient, createAdminClient } from '@insforge/sdk';

const INSFORGE_BASE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL!;
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

/**
 * Optional: name of a Clerk JWT template configured in the Clerk dashboard
 * that adds InsForge-specific claims. Falls back to the raw Clerk session
 * token when not set.
 * Set CLERK_INSFORGE_TEMPLATE=insforge in your .env to enable.
 */
const CLERK_JWT_TEMPLATE = process.env.CLERK_INSFORGE_TEMPLATE;

/**
 * Returns an InsForge client authenticated with the current Clerk session
 * JWT. Call this at the top of every Server Component / Route Handler /
 * Server Action that needs to talk to InsForge on behalf of the signed-in
 * user.
 *
 * If no Clerk session is active the client falls back to the anon key, so
 * only publicly-readable data will be accessible (subject to your RLS rules).
 */
export async function createInsforgeServerClient() {
  const client = createClient({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_ANON_KEY,
    isServerMode: true,
  });

  // Grab the Clerk session token — optionally scoped to a named JWT template.
  // getToken() returns null when the user is not signed in.
  const { getToken, userId } = await auth();
  const token = await getToken(
    CLERK_JWT_TEMPLATE ? { template: CLERK_JWT_TEMPLATE } : undefined
  );

  if (token) {
    // setAccessToken syncs both the HTTP layer AND the realtime websocket
    // token manager — prefer this over getHttpClient().setAuthToken().
    client.setAccessToken(token);
  }

  return { insforge: client, userId };
}

/**
 * Returns an InsForge admin client authenticated with the project API key.
 * Use this for privileged server-side operations that bypass RLS — never
 * expose this client to the browser.
 *
 * Requires INSFORGE_API_KEY in your server environment (not NEXT_PUBLIC_).
 */
export function createInsforgeAdminClient() {
  return createAdminClient({
    baseUrl: INSFORGE_BASE_URL,
    apiKey: process.env.INSFORGE_API_KEY!,
  });
}

/** Convenience alias — use for storage uploads that need to bypass RLS. */
export const createInsforgeUploadClient = createInsforgeAdminClient;
