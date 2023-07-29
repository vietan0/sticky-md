import HomeLink from '../HomeLink';
import SearchBar from './SearchBar';
import SettingCorner from './SettingCorner';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  return (
    <header
      id="Nav"
      className="fixed z-10 flex w-full items-center justify-between gap-1 border-b-2 bg-white/80 px-4 py-2 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80 sm:gap-4 sm:px-8"
    >
      <HomeLink />
      <SearchBar />
      <div className="nav-right flex items-center gap-0 xs:gap-1">
        <ThemeToggle />
        <SettingCorner />
      </div>
    </header>
  );
}
