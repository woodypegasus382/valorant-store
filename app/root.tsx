import type { MetaFunction } from '@remix-run/node';
import type { LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';
import tailwind from '~/styles/tailwind.css';

import globals from '~/styles/globals.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Valorant Store',
  viewport: 'width=device-width,initial-scale=1'
});

export const links: LinksFunction = () => [
  {
    href: tailwind,
    rel: 'stylesheet'
  },
  {
    href: globals,
    rel: 'stylesheet'
  }
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
