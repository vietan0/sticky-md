import { useState } from 'react';
import { SearchContext } from '.';

export default function SearchContextProvider({ children }: { children: JSX.Element }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchContext.Provider>
  );
}
