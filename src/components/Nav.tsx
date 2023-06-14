import HomeLink from './HomeLink';
import SearchBar from './SearchBar';
import SettingCorner from './SettingCorner';

export default function Nav() {
  return (
    <header id="Nav" className="px-8 py-4 sticky flex justify-between items-center gap-8">
      <HomeLink />
      <SearchBar />
      <SettingCorner />
    </header>
  );
}
