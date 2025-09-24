import { Link } from 'react-router';
import cn from '../utils/cn';
import Logo from './icons/Logo';

interface HomeLinkProps {
  className?: string;
}

export default function HomeLink({ className }: HomeLinkProps) {
  return (
    <Link
      className={cn(className, 'flex items-center gap-2')}
      onClick={() => window.location.reload()}
      to="/"
    >
      <Logo />
      <span className={`
        hidden font-medium tracking-tight whitespace-nowrap
        sm:block
      `}
      >
        Sticky MD
      </span>
    </Link>
  );
}
