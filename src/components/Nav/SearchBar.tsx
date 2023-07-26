import Search from '../icons/Search';

export default function SearchBar() {
  return (
    <form id="SearchBar" className="max-w-xl flex-grow">
      <label htmlFor="search" className="relative inline-block w-full">
        <Search className="absolute left-3 top-[10px] h-5 w-5" />
        <input
          id="search"
          placeholder="Search"
          className="w-full rounded text-[15px] bg-white/20 px-6 py-2 pl-12 outline outline-1 outline-neutral-300 placeholder:text-neutral-500 dark:bg-neutral-900/20 dark:outline-neutral-800"
        />
      </label>
    </form>
  );
}
