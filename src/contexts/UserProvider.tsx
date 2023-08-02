import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/auth';
import { UserContext } from '.';

export default function UserProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(false);
      setCurrentUser(user);
      // available properties: https://firebase.google.com/docs/reference/js/auth.user
    });
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      {/* important: only start rendering children when user is done initializing (loading is false) */}
      {loading || children}
    </UserContext.Provider>
  );
}
