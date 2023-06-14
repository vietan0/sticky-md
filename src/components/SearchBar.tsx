import { useForm, SubmitHandler } from 'react-hook-form';
import Search from './icons/Search';

type Inputs = {
  search: string;
};
export default function SearchBar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form id="SearchBar" onSubmit={handleSubmit(onSubmit)} className="flex-grow max-w-lg">
      <label htmlFor="search" className="relative w-full inline-block">
        <Search className="absolute top-3 left-3" />
        <input
          id="search"
          placeholder="Search"
          {...register('search')}
          className="w-full inline-block px-6 py-3 pl-12 rounded bg-slate-200 dark:bg-slate-900 placeholder:text-slate-500"
        />
      </label>
    </form>
  );
}
