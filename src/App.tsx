import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Main from './routes/Main';
import Profile from './routes/Profile';
import NotFound from './routes/NotFound';

export default function App() {
  return (
    <div id="App" className="flex flex-col xs:justify-center min-h-screen bg-white dark:bg-slate-950">
      <h1 className="sr-only">Sticky MD</h1>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Main />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
