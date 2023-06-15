import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase/auth';

export const UserContext = createContext<User | 'loading' | null>(null);

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
