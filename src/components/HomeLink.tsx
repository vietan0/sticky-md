import { Link } from 'react-router-dom';
import Logo from './icons/Logo';

interface HomeLinkProps {
  className?: string;
}

export default function HomeLink({ className }: HomeLinkProps) {
  return (
    <Link
      className={`flex items-center gap-2 ${className}`}
      onClick={() => window.location.reload()}
      to="/"
    >
      <Logo />
      <span className="whitespace-nowrap hidden sm:block font-medium tracking-tight">Sticky MD</span>
    </Link>
  );
}
