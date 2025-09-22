import { Route, Routes } from 'react-router-dom';
import Main from './components/Main/Main';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import Profile from './routes/Profile';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';

export default function App() {
  return (
    <div
      className="flex min-h-screen flex-col xs:justify-center"
      id="App"
    >
      <h1 className="sr-only">Sticky MD</h1>
      <Routes>
        <Route element={<Home />} path="/">
          <Route element={<Main />} index />
          <Route element={<Profile />} path="profile" />
        </Route>
        <Route element={<SignIn />} path="/signin" />
        <Route element={<SignUp />} path="/signup" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </div>
  );
}
