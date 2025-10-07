import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Main from './components/Main/Main';
import NotFound from './routes/NotFound';
import Auth from './routes/Auth';

export default function App() {
  return (
    <div
      id="App"
      className="flex min-h-screen flex-col xs:justify-center"
    >
      <h1 className="sr-only">Sticky MD</h1>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Main />} />
        </Route>
        <Route path="/signin" element={<Auth mode="signin" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
