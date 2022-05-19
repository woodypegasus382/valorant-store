import { createCookieSessionStorage } from '@remix-run/node'; // or "@remix-run/cloudflare"

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: '__session',

      // all of these are optional
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SECRET || 's3cr3t'],
      secure: process.env.NODE_ENV === 'production'
    }
  });

export { getSession, commitSession, destroySession };
