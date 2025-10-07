import { Link } from 'react-router-dom';

interface HomeLinkProps {
  className?: string;
}

export default function HomeLink({ className }: HomeLinkProps) {
  return (
    <Link
      to="/"
      onClick={() => window.location.reload()}
      className={`flex items-center gap-2 ${className}`}
    >
      <img className='w-5' src="favicon.png" alt="Logo" />
      <span className="whitespace-nowrap hidden leading-tight font-semibold sm:block tracking-[-0.35px] text-neutral-700 dark:text-neutral-200">Sticky MD</span>
    </Link>
  );
}
