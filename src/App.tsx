import { Outlet } from 'react-router';

export default function App({ error }: { error?: React.ReactNode }) {
  return (
    <div
      className={`
        flex min-h-screen flex-col
        xs:justify-center
      `}
      id="App"
    >
      <h1 className="sr-only">Sticky MD</h1>
      {error ?? <Outlet />}
    </div>
  );
}
