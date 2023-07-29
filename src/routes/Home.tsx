import { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AllNotesContextProvider from '../contexts/AllNotesContext';
import AllLabelsContextProvider from '../contexts/AllLabelsContext';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../contexts';
import SearchContextProvider from '../contexts/SearchContextProvider';

export default function Home() {
  const currentUser = useContext(UserContext);

  const nav = useNavigate();
  useEffect(() => {
    if (!currentUser) nav('/signin');
  }, [currentUser, nav]);

  return (
    <SearchContextProvider>
      <AllNotesContextProvider>
        <AllLabelsContextProvider>
          <div id="Home" className="min-h-screen">
            <Nav />
            <Outlet />
          </div>
        </AllLabelsContextProvider>
      </AllNotesContextProvider>
    </SearchContextProvider>
  );
}
