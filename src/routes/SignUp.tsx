import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import HomeLink from '../components/HomeLink';
import Github from '../components/icons/Github';
import Google from '../components/icons/Google';
import Lock from '../components/icons/Lock';
import Mail from '../components/icons/Mail';
import { UserContext } from '../contexts';
import {
  emailSignIn,
  emailSignUp,
  githubProvider,
  googleProvider,
  oAuthSignIn,
} from '../firebase/auth';

interface Inputs {
  email: string;
  password: string;
}

export default function SignUp() {
  const currentUser = useContext(UserContext);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    emailSignUp(data.email, data.password);
  };

  const onError: SubmitErrorHandler<Inputs> = (errors, e) => {
    console.error('submit error!');
    console.log(errors, e);
  };

  useEffect(() => {
    if (currentUser !== null)
      nav('/');
  }, [currentUser, nav]);

  return (
    <div
      className="flex flex-col gap-4 rounded-lg p-4 pb-12 shadow-lg xs:m-auto xs:w-[400px] xs:p-8 xs:outline xs:outline-blue-100 xs:dark:outline-neutral-800"
      id="SignUp"
    >
      <HomeLink className="mb-2" />
      <p className="mb-6 text-xl font-bold">Sign Up</p>
      <button
        className="rounded p-2 px-4 py-2"
        id="demo-sign-in"
        onClick={async () => {
          emailSignIn(import.meta.env.VITE_DEMO_EMAIL, import.meta.env.VITE_DEMO_PASSWORD);
        }}
      >
        Use Demo Account
      </button>
      <span className="text-center text-sm">or</span>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit, onError)}>
        <label className="relative" htmlFor="email">
          <Mail className="absolute left-2 top-2 h-6 w-6" />
          <input
            id="email"
            placeholder="Email"
            type="email"
            {...register('email', { required: true })}
            className="w-full rounded bg-neutral-200 px-4 py-2 pl-12 placeholder:text-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-500"
          />
          {errors.email && (
            <span className="mt-1 inline-block text-sm text-red-500">Email is required</span>
          )}
        </label>
        <label className="relative" htmlFor="password">
          <Lock className="absolute left-2 top-2 h-6 w-6" />
          <input
            placeholder="Password"
            type="password"
            {...register('password', { required: true })}
            className="w-full rounded bg-neutral-200 px-4 py-2 pl-12 placeholder:text-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-500"
          />
          {errors.password && (
            <span className="mt-1 inline-block text-sm text-red-500">Password is required</span>
          )}
        </label>
        <button
          className="rounded px-4 py-2 outline outline-1 outline-blue-300 hover:bg-blue-100 focus-visible:outline-white dark:text-white dark:outline-blue-900 dark:hover:bg-blue-900/50"
          onClick={handleSubmit(onSubmit, onError)}
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <span className="text-center text-sm">or</span>
      <div className="flex flex-col justify-center gap-3">
        <button
          className="flex gap-4 rounded px-4 py-2 outline outline-1 outline-blue-300 hover:bg-blue-100 focus-visible:outline-white dark:text-white dark:outline-blue-900 dark:hover:bg-blue-900/30"
          onClick={async () => await oAuthSignIn(googleProvider)}
        >
          <Google className="w-5" />
          <span>Sign in with Google</span>
        </button>
        <button
          className="flex gap-4 rounded px-4 py-2 outline outline-1 outline-blue-300 hover:bg-blue-100 focus-visible:outline-white dark:text-white dark:outline-blue-900 dark:hover:bg-blue-900/30"
          onClick={async () => await oAuthSignIn(githubProvider)}
        >
          <Github className="w-5" />
          <span>Sign in with Github</span>
        </button>
      </div>
      <span className="text-center">
        Already have an account?
        {' '}
        <Link className="text-blue-500" to="/signin">
          Sign In
        </Link>
      </span>
    </div>
  );
}
