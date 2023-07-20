import { useContext } from 'react';
import { Root, Trigger, Portal, CheckboxItem, Content, Arrow } from '@radix-ui/react-dropdown-menu';
import Sun from '../icons/Sun';
import Moon from '../icons/Moon';
import Desktop from '../icons/Desktop';
import { ThemeContext } from '../../contexts';

export default function ThemeToggle() {
  const { theme, setTheme, htmlHasDark } = useContext(ThemeContext);

  let themeIcon;
  if (theme === 'light') {
    themeIcon = <Sun className="h-6 w-6 stroke-blue-500" />;
  }
  if (theme === 'dark') {
    themeIcon = <Moon className="h-6 w-6 stroke-blue-500" />;
  }
  if (theme === 'os') {
    if (htmlHasDark) themeIcon = <Moon className="h-6 w-6 opacity-40" />;
    else themeIcon = <Sun className="h-6 w-6 opacity-40" />;
  }

  return (
    <Root>
      <Trigger className="rounded-full p-2 text-sm hover:bg-slate-200 dark:hover:bg-slate-800">
        {themeIcon}
      </Trigger>
      <Portal>
        <Content
          align="end"
          className="flex flex-col rounded bg-slate-100 p-1 text-sm shadow-lg dark:bg-slate-900"
        >
          <CheckboxItem
            checked={theme === 'light'}
            onCheckedChange={(checked) => {
              if (checked) setTheme('light');
            }}
            className={`${
              theme === 'light' ? 'text-blue-600' : ''
            } flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-800`}
          >
            <Sun className="h-5 w-5" />
            <span>Light Mode</span>
          </CheckboxItem>
          <CheckboxItem
            checked={theme === 'dark'}
            onCheckedChange={(checked) => {
              if (checked) setTheme('dark');
            }}
            className={`${
              theme === 'dark' ? 'text-blue-600' : ''
            } flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-800`}
          >
            <Moon className="h-5 w-5" />
            <span>Dark Mode</span>
          </CheckboxItem>
          <CheckboxItem
            checked={theme === 'os'}
            onCheckedChange={(checked) => {
              if (checked) setTheme('os');
            }}
            className={`${
              theme === 'os' ? 'text-blue-600' : ''
            } flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-800`}
          >
            <Desktop className="h-5 w-5" />
            <span>System</span>
          </CheckboxItem>
          <Arrow className="fill-slate-100 dark:fill-slate-900" />
        </Content>
      </Portal>
    </Root>
  );
}
