import type { LoaderFunction } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import Skin from '~/components/Skin';
import type { Skin as ISkin } from '~/models/valorant.server';
import { getSkins } from '~/models/valorant.server';
import { destroySession, getSession } from '~/session.server';

type LoaderData = {
  skins: ISkin[];
  username?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const accessToken = session.get('accessToken');
  const rsoToken = session.get('rsoToken');
  const username = session.get('username');
  const subject = session.get('subject');
  const region = session.get('region');

  if (!accessToken || !rsoToken || !username || !subject || !region)
    return redirect('/login');

  try {
    const skins = await getSkins({
      accessToken,
      rsoToken,
      subject,
      region
    });

    return json({
      skins,
      username
    });
  } catch (err) {
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session)
      }
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session)
    }
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="min-h-screen overflow-hidden bg-[#101822] text-white">
      <div className="relative flex flex-col items-center justify-center w-screen min-h-screen p-8 space-y-8">
        <div className="static flex items-center space-x-4 md:absolute right-4 top-4">
          <p className="text-lg text-right font-['Valorant']">
            {data.username}
          </p>

          <Form method="post">
            <button
              name="action"
              value="logout"
              className="p-2 bg-[#ff4654] font-['Valorant'] rounded-md text-[#101822]"
            >
              Logout
            </button>
          </Form>
        </div>

        <h1 className="text-[#ff4654] font-['Valorant'] text-center text-5xl font-bold">
          Your Store
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.skins.map(skin => (
            <Skin skin={skin} key={skin.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
