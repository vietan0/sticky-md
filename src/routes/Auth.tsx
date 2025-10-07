import { useContext, useEffect } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { emailSignIn, emailSignUp, githubProvider, googleProvider, oAuthSignIn } from '../firebase/auth';
import { UserContext } from '../contexts';
import Github from '../components/icons/Github';
import Google from '../components/icons/Google';
import Mail from '../components/icons/Mail';
import HomeLink from '../components/HomeLink';
import Lock from '../components/icons/Lock';

type Inputs = {
  email: string;
  password: string;
};
export default function Auth({ mode }: { mode: 'signin' | 'signup' }) {
  const currentUser = useContext(UserContext);
  const title = mode === 'signin' ? 'Sign In' : 'Sign Up'

  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mode === 'signin' 
      ? emailSignIn(data.email, data.password) 
      : emailSignUp(data.email, data.password);
  };
  const onError: SubmitErrorHandler<Inputs> = (errors, e) => {
    console.error('Submit error!');
    console.log(errors, e);
  };

  useEffect(() => {
    if (currentUser !== null) nav('/');
  }, [currentUser, nav]);

  return (
    <div
      id={title}
      className="flex flex-col gap-4 rounded-lg p-4 pb-12 shadow-lg xs:m-auto xs:w-[400px] xs:p-8 xs:outline xs:outline-blue-100 xs:dark:outline-neutral-800"
    >
      <HomeLink />
      <p className="mb-6 text-2xl font-bold">{title}</p>
      <div className='group relative overflow-hidden rounded-md flex justify-center items-center h-[50px]'>
        <div id="gradient" />
        <button
          onClick={() => {
            emailSignIn(import.meta.env.VITE_DEMO_EMAIL, import.meta.env.VITE_DEMO_PASSWORD);
          }}
          className='relative w-[calc(100%_-_5px)] h-[45px] group-hover:w-[calc(100%_-_10px)] hover:h-10 px-4 py-2 font-semibold rounded bg-white dark:bg-neutral-950 transition-all'
        >
          Use Demo Account
        </button>
      </div>
      <span className="text-center text-sm">or</span>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-2">
        <label htmlFor="email" className="relative">
          <Mail className="stroke-neutral-400 absolute left-2 top-2 h-5 w-5" />
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
            className="w-full rounded text-sm bg-neutral-200/65 px-4 py-2 pl-10 placeholder:text-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-500"
          />
          {errors.email && (
            <span className="mt-1 inline-block text-sm text-red-500">Email is required</span>
          )}
        </label>
        <label htmlFor="password" className="relative">
          <Lock className="stroke-neutral-400 absolute left-2 top-2 h-5 w-5" />
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="w-full rounded text-sm bg-neutral-200/65 px-4 py-2 pl-10 placeholder:text-neutral-700 dark:bg-neutral-900 dark:placeholder:text-neutral-500"
          />
          {errors.password && (
            <span className="mt-1 inline-block text-sm text-red-500">Password is required</span>
          )}
        </label>
        <button
          type="submit"
          onClick={handleSubmit(onSubmit, onError)}
          className="rounded px-4 py-2 font-semibold outline outline-1 outline-blue-400 hover:bg-blue-100 focus-visible:outline-white dark:text-white dark:outline-blue-900 dark:hover:bg-blue-900/20"
        >
          {title}
        </button>
      </form>
      <span className="text-center text-sm">or</span>
      <div className="flex gap-3 [&>*]:grow">
        <button
          onClick={async () => await oAuthSignIn(googleProvider)}
          title={`${title} with Google`}
          className="flex justify-center rounded px-4 py-2 outline outline-1 outline-blue-400 hover:bg-blue-100 focus-visible:outline-white dark:text-white dark:outline-blue-900 dark:hover:bg-blue-900/20"
        >
          <Google className="w-5" />
        </button>
        <button
          onClick={async () => await oAuthSignIn(githubProvider)}
          title={`${title} with Github`}
          className="flex justify-center rounded px-4 py-2 outline outline-1 outline-blue-400 hover:bg-blue-100 focus-visible:outline-white dark:text-white dark:outline-blue-900 dark:hover:bg-blue-900/20"
        >
          <Github className="w-5" />
        </button>
      </div>
      <span className="text-center">
        {mode === 'signin' ? "Don't have an account yet?" : 'Already have an account?'}
        {' '}
        <Link to={mode === 'signin' ? '/signup' : '/signin'} className="text-blue-600">
          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
        </Link>
      </span>
    </div>
  );

}