import HomeLink from '../HomeLink';
import SearchBar from './SearchBar';
import SettingCorner from './SettingCorner';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  return (
    <header id="Nav" className="sticky flex items-center justify-between gap-4 px-8 py-4">
      <HomeLink />
      <SearchBar />
      <div className="nav-right flex items-center gap-1">
        <ThemeToggle />
        <SettingCorner />
      </div>
    </header>
  );
}
