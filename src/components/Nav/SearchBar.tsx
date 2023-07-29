import { useContext, useState } from 'react';
import Search from '../icons/Search';
import { SearchContext } from '../../contexts';
import Close from '../icons/Close';

export default function SearchBar() {
  const { setSearchValue } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchValue(inputValue);
  }
  return (
    <form onSubmit={handleSubmit} id="SearchBar" className="max-w-xl flex-grow">
      <label className="relative inline-block w-full">
        <Search className="absolute left-2 xs:left-3 top-[9px] h-5 w-5" />
        <input
          placeholder="Search by words, labels, colors,…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full rounded bg-white/20 px-6 py-2 pl-9 xs:pl-12 text-[15px] outline outline-1 outline-neutral-300 placeholder:text-neutral-500 dark:bg-neutral-900/20 dark:outline-neutral-800"
        />
        {inputValue && (
          <div className="absolute bottom-1 right-1 top-1 my-auto flex items-center">
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setSearchValue('');
              }}
              className="inset-auto bottom-1 top-1 rounded-full p-1 outline-1 outline-neutral-500 hover:bg-black/10 dark:hover:bg-white/20"
            >
              <Close className="h-5 w-5" />
            </button>
            <button
              type="submit"
              className="inset-auto bottom-1 top-1 rounded px-2 py-1 outline-1 outline-neutral-500 hover:bg-blue-100 dark:hover:bg-transparent dark:hover:outline dark:hover:outline-blue-600"
            >
              Search
            </button>
          </div>
        )}
      </label>
    </form>
  );
}
