import HomeLink from '../HomeLink';
import SearchBar from './SearchBar';
import SettingCorner from './SettingCorner';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  return (
    <header
      id="Nav"
      className="backdrop-blur-xl fixed border-b-2 dark:border-neutral-800 flex w-full items-center justify-between gap-4 bg-white/80 px-8 py-2 dark:bg-neutral-950/80"
    >
      <HomeLink />
      <SearchBar />
      <div className="nav-right flex items-center gap-1">
        <ThemeToggle />
        <SettingCorner />
      </div>
    </header>
  );
}
