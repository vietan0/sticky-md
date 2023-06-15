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
    <form id="SearchBar" onSubmit={handleSubmit(onSubmit)} className="max-w-lg flex-grow">
      <label htmlFor="search" className="relative inline-block w-full">
        <Search className="absolute left-3 top-3" />
        <input
          id="search"
          placeholder="Search"
          {...register('search')}
          className="input-global px-6 py-3 pl-12"
        />
      </label>
    </form>
  );
}
