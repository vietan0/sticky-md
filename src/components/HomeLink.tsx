import { Link } from 'react-router-dom';
import Logo from './icons/Logo';

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
      <Logo />
      <span className="whitespace-nowrap hidden sm:block font-medium tracking-tight">Sticky MD</span>
    </Link>
  );
}
