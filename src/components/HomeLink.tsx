import { Link } from 'react-router-dom';
import Logo from './Logo';

interface HomeLinkProps {
  className?: string;
}

export default function HomeLink({ className }: HomeLinkProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="whitespace-nowrap font-medium tracking-tight">Sticky MD</span>
    </Link>
  );
}
