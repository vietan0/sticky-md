import { Link } from 'react-router-dom';
import Logo from './Logo';

interface HomeLinkProps {
  className?: string;
}

export default function HomeLink({ className }: HomeLinkProps) {
  return (
    <Link to="/" className={`flex gap-2 items-center ${className}`}>
      <Logo />
      <span className="font-medium tracking-tight whitespace-nowrap">Sticky MD</span>
    </Link>
  );
}
