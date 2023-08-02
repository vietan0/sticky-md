import { useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AllLabelsProvider from '../contexts/AllLabelsProvider';
import Nav from '../components/Nav/Nav';
import { UserContext } from '../contexts';
import SearchProvider from '../contexts/SearchProvider';

export default function Home() {
  const currentUser = useContext(UserContext);

  const nav = useNavigate();
  useEffect(() => {
    if (!currentUser) nav('/signin');
  }, [currentUser, nav]);

  return (
    <SearchProvider>
        <AllLabelsProvider>
          <div id="Home" className="min-h-screen">
            <Nav />
            <Outlet />
          </div>
        </AllLabelsProvider>
    </SearchProvider>
  );
}
