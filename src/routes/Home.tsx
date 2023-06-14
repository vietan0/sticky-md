import { useEffect, useContext } from 'react';
import { Outlet , useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
  const currentUser = useContext(UserContext);
  
  const nav = useNavigate();
  useEffect(() => {
    if (!currentUser) nav('/signin');
  }, [currentUser, nav]);

  return (
    <div id="Home" className="min-h-screen">
      <Nav />
      <Outlet />
    </div>
  );
}
