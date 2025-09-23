import { useContext, useState } from 'react';
import { SearchContext } from '../../contexts';
import Close from '../icons/Close';
import Search from '../icons/Search';

export default function SearchBar() {
  const { setSearchValue } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchValue(inputValue);
  }

  return (
    <form className="max-w-xl grow" id="SearchBar" onSubmit={handleSubmit}>
      <label className="relative inline-block w-full">
        <Search className={`
          absolute top-[9px] left-2 size-5
          xs:left-3
        `}
        />
        <input
          className={`
            w-full rounded-sm bg-white/20 px-6 py-2 pl-9 text-[15px] outline-1 outline-neutral-300
            outline-solid
            placeholder:text-neutral-500
            xs:pl-12
            dark:bg-neutral-900/20 dark:outline-neutral-800
          `}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Search by words, labels, colors,…"
          value={inputValue}
        />
        {inputValue && (
          <div className="absolute top-1 right-1 bottom-1 my-auto flex items-center">
            <button
              className={`
                inset-auto top-1 bottom-1 rounded-full p-1 outline-1 outline-neutral-500
                hover:bg-black/10
                dark:hover:bg-white/20
              `}
              onClick={() => {
                setInputValue('');
                setSearchValue('');
              }}
              type="button"
            >
              <Close className="size-5" />
            </button>
            <button
              className={`
                inset-auto top-1 bottom-1 rounded-sm px-2 py-1 outline-1 outline-neutral-500
                hover:bg-blue-100
                dark:hover:bg-transparent dark:hover:outline-blue-600 dark:hover:outline-solid
              `}
              type="submit"
            >
              Search
            </button>
          </div>
        )}
      </label>
    </form>
  );
}
