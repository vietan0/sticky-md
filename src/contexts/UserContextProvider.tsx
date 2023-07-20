import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/auth';
import { UserContext } from '.';

export default function UserContextProvider({ children }: { children: JSX.Element }) {
  const [currentUser, setCurrentUser] = useState<User | 'loading' | null>('loading');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setCurrentUser(user);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });
  }, []);

  return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>;
}
