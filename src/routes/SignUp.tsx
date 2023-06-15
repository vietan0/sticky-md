import { useEffect, useContext } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { emailSignUp, githubProvider, googleProvider, oAuthSignIn } from '../firebase/auth';
import { UserContext } from '../contexts/UserContext';
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
    if (currentUser) nav('/');
  }, [currentUser, nav]);

  return (
    <div
      id="SignUp"
      className="shadow-2xl flex flex-col gap-4 xs:m-auto rounded-lg p-4 xs:p-8 pb-12 xs:outline xs:outline-slate-300 xs:dark:outline-slate-800"
    >
      <HomeLink className="mb-2" />
      <p className="text-xl font-bold mb-6">Sign Up</p>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4">
        <label htmlFor="email" className="relative">
          <Mail className="absolute top-2 left-2" />
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
            className="input-global px-4 py-2 pl-12"
          />
        </label>
        <label htmlFor="password" className="relative">
          <Lock className="absolute top-2 left-2" />
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="input-global px-4 py-2 pl-12"
          />
        </label>
        {errors.email && <span>Email is required</span>}
        {errors.password && <span>Password is required</span>}
        <button
          type="submit"
          onClick={handleSubmit(onSubmit, onError)}
          className="text-white bg-blue-800 hover:bg-blue-900 rounded px-4 py-2"
        >
          Sign Up
        </button>
      </form>
      <span className="text-sm text-center">or</span>
      <div className="flex flex-col gap-3 justify-center">
        <button
          onClick={async () => await oAuthSignIn(googleProvider)}
          className="hover:bg-slate-200 dark:hover:bg-slate-800 p-2 flex gap-4 rounded outline outline-1 outline-blue-800"
        >
          <Google className="w-5" />
          <span>Sign in with Google</span>
        </button>
        <button
          onClick={async () => await oAuthSignIn(githubProvider)}
          className="hover:bg-slate-200 dark:hover:bg-slate-800 p-2 flex gap-4 rounded outline outline-1 outline-blue-800"
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
