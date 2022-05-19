import type { LoaderFunction } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition
} from '@remix-run/react';
import LoginForm from '~/components/LoginForm';
import Skin from '~/components/Skin';
import type { Skin as ISkin } from '~/models/valorant.server';
import { getSkins, login } from '~/models/valorant.server';
import { commitSession, destroySession, getSession } from '~/session.server';

type LoaderData = {
  skins: ISkin[];
  isAuth: boolean;
  username?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const accessToken = session.get('accessToken');

  if (!accessToken) {
    return json({
      isAuth: false,
      skins: []
    });
  }

  const skins = await getSkins(
    session.get('subject'),
    accessToken,
    session.get('rsoToken'),
    session.get('region')
  );

  return json(
    {
      isAuth: true,
      skins,
      username: session.get('username')
    },
    {
      headers: {
        'Cache-Control': 'max-age=120 s-maxage=120'
      }
    }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const formData = await request.formData();

  const { username, password, action, region } = Object.fromEntries(
    formData.entries()
  );

  if (action === 'login') {
    try {
      const { auth, user } = await login(
        username.toString(),
        password.toString()
      );

      session.set('accessToken', auth.accessToken);
      session.set('rsoToken', auth.rsoToken);
      session.set('subject', user.Subject);
      session.set('username', `${user.GameName}#${user.TagLine}`);
      session.set('region', region);

      return json(
        {
          ok: true
        },
        {
          headers: {
            'Set-Cookie': await commitSession(session)
          }
        }
      );
    } catch (err) {
      return json({
        ok: false,
        message: (err as Error).message
      });
    }
  }

  if (action === 'logout') {
    return json(
      {
        ok: true
      },
      {
        headers: {
          'Set-Cookie': await destroySession(session)
        }
      }
    );
  }
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="min-h-screen overflow-hidden bg-[#101822] text-white">
      {!data.isAuth && <LoginForm />}

      {data.isAuth && (
        <div className="min-h-screen p-8 w-screen flex flex-col space-y-8 items-center relative justify-center">
          <div className="static flex space-x-4 items-center md:absolute right-4 top-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.skins.map(skin => (
              <Skin skin={skin} key={skin.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
