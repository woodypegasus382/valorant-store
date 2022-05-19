import { Form, useActionData, useTransition } from '@remix-run/react';

export default function LoginForm() {
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <div className="pt-20">
      <h1 className="text-5xl text-center font-['Valorant'] text-slate-200">
        Log In
      </h1>

      {actionData?.ok === false && (
        <p className="text-center mt-8 text-lg text-[#ff4654]">
          {actionData.message}
        </p>
      )}

      <Form
        method="post"
        action="/login"
        className="flex flex-col w-full max-w-3xl p-8 mx-auto space-y-4"
      >
        <input
          type="text"
          name="username"
          className="w-full p-3 placeholder-gray-400 bg-gray-800 rounded-md focus:bg-gray-800"
          placeholder="Username"
        />
        <input
          name="password"
          type="password"
          className="w-full p-3 bg-gray-800 rounded-md"
          placeholder="Password"
        />

        <select className="p-3 bg-gray-800 rounded-md" name="region">
          <option value="na">North America</option>
          <option value="latam">Latam</option>
          <option value="br">Brazil</option>
          <option value="ap">Asia Pacific</option>
          <option value="kr">Korea</option>
          <option value="eu">Europe</option>
        </select>

        <button
          name="action"
          value="login"
          className="py-3 bg-[#ff4654] font-['Valorant'] rounded-md text-[#101822]"
        >
          {transition.state === 'submitting' || transition.state === 'loading'
            ? 'Processing...'
            : 'Log In'}
        </button>
      </Form>
    </div>
  );
}
