import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../contexts';
import AllLabelsProvider from '../contexts/AllLabelsProvider';
import SearchProvider from '../contexts/SearchProvider';

export default function Home() {
  const currentUser = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!currentUser)
      nav('/signin');
  }, [currentUser, nav]);

  return (
    <SearchProvider>
      <AllLabelsProvider>
        <div className="min-h-screen" id="Home">
          <Nav />
          <Outlet />
        </div>
      </AllLabelsProvider>
    </SearchProvider>
  );
}
