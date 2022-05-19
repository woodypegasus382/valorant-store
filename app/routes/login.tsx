import { redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import LoginForm from '~/components/LoginForm';
import { login } from '~/models/valorant.server';
import { commitSession, getSession } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const accessToken = session.get('accessToken');

  if (accessToken) {
    return redirect('/');
  }

  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const formData = await request.formData();

  const { username, password, region } = Object.fromEntries(formData.entries());

  try {
    const { auth, user } = await login({
      username: username.toString(),
      password: password.toString(),
      region: region.toString()
    });

    session.set('accessToken', auth.accessToken);
    session.set('rsoToken', auth.rsoToken);
    session.set('subject', user.Subject);
    session.set('username', `${user.GameName}#${user.TagLine}`);
    session.set('region', region);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    });
  } catch (err) {
    return json({
      ok: false,
      message: (err as Error).message
    });
  }
};

export default function Index() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#101822] text-white">
      <LoginForm />
    </div>
  );
}
