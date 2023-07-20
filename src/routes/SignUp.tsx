import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { emailSignUp, githubProvider, googleProvider, oAuthSignIn } from '../firebase/auth';
import { UserContext } from '../contexts';
import Lock from '../components/icons/Lock';
import Mail from '../components/icons/Mail';
import Google from '../components/icons/Google';
import Github from '../components/icons/Github';
import HomeLink from '../components/HomeLink';

type Inputs = {
  email: string;
  password: string;
};
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
    if (currentUser !== null && currentUser !== 'loading') nav('/');
  }, [currentUser, nav]);

  return (
    <div
      id="SignUp"
      className="flex flex-col gap-4 rounded-lg p-4 pb-12 shadow-2xl xs:m-auto xs:p-8 xs:outline xs:outline-slate-300 xs:dark:outline-slate-800"
    >
      <HomeLink className="mb-2" />
      <p className="mb-6 text-xl font-bold">Sign Up</p>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
        <label htmlFor="email" className="relative">
          <Mail className="absolute left-2 top-2 h-6 w-6" />
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
            className="input-global rounded px-4 py-2 pl-12"
          />
        </label>
        <label htmlFor="password" className="relative">
          <Lock className="absolute left-2 top-2 h-6 w-6" />
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="input-global rounded px-4 py-2 pl-12"
          />
        </label>
        {errors.email && <span>Email is required</span>}
        {errors.password && <span>Password is required</span>}
        <button
          type="submit"
          onClick={handleSubmit(onSubmit, onError)}
          className="rounded bg-blue-800 px-4 py-2 text-white hover:bg-blue-900"
        >
          Sign Up
        </button>
      </form>
      <span className="text-center text-sm">or</span>
      <div className="flex flex-col justify-center gap-3">
        <button
          onClick={async () => await oAuthSignIn(googleProvider)}
          className="flex gap-4 rounded p-2 outline outline-1 outline-blue-800 hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Google className="w-5" />
          <span>Sign in with Google</span>
        </button>
        <button
          onClick={async () => await oAuthSignIn(githubProvider)}
          className="flex gap-4 rounded p-2 outline outline-1 outline-blue-800 hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <Github className="w-5" />
          <span>Sign in with Github</span>
        </button>
      </div>
      <span className="text-center">
        Already have an account?{' '}
        <Link to="/signin" className="text-blue-500">
          Sign In
        </Link>
      </span>
    </div>
  );
}
