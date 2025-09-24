import { useNavigate } from 'react-router';

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div id="NotFound bg-white dark:bg-neutral-900">
      <div className="container mx-auto flex min-h-screen items-center px-6 py-12">
        <div>
          <p className={`
            text-sm font-medium text-blue-500
            dark:text-blue-400
          `}
          >
            404 error
          </p>
          <h1 className={`
            mt-3 text-2xl font-semibold text-neutral-800
            md:text-3xl
            dark:text-white
          `}
          >
            We can&apos;t find that page
          </h1>
          <p className={`
            mt-4 text-neutral-500
            dark:text-neutral-400
          `}
          >
            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="mt-6 flex items-center gap-x-3">
            <button
              className={`
                flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2
                text-sm text-neutral-700 transition-colors duration-200
                hover:bg-neutral-100
                sm:w-auto
                dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200
                dark:hover:bg-neutral-800
              `}
              onClick={() => nav(-1)}
            >
              <svg
                className={`
                  size-5
                  rtl:rotate-180
                `}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Go back</span>
            </button>

            <button
              className={`
                w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white
                transition-colors duration-200
                hover:bg-blue-600
                sm:w-auto
                dark:bg-blue-600 dark:hover:bg-blue-500
              `}
              onClick={() => nav('/')}
            >
              Take me home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
