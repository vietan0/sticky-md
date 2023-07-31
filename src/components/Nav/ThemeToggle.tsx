import { useContext } from 'react';
import { Root, Trigger, Portal, CheckboxItem, Content, Arrow } from '@radix-ui/react-dropdown-menu';
import Sun from '../icons/Sun';
import Moon from '../icons/Moon';
import Desktop from '../icons/Desktop';
import { ThemeContext } from '../../contexts';
import TooltipWrapper from '../TooltipWrapper';

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
      <TooltipWrapper content="Switch theme">
        <Trigger
          title="Switch theme"
          className="DROPDOWN_TRIGGER rounded-full p-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          {themeIcon}
        </Trigger>
      </TooltipWrapper>
      <Portal className="outline outline-1 outline-black">
        <Content
          align="end"
          className="z-50 flex flex-col rounded bg-white p-1 text-sm drop-shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:bg-neutral-900"
        >
          <CheckboxItem
            checked={theme === 'light'}
            onCheckedChange={(checked) => {
              if (checked) setTheme('light');
            }}
            className={`${
              theme === 'light' ? 'text-blue-600' : ''
            } flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800`}
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
            } flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800`}
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
            } flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800`}
          >
            <Desktop className="h-5 w-5" />
            <span>System</span>
          </CheckboxItem>
          <Arrow className="fill-neutral-100 dark:fill-neutral-900" />
        </Content>
      </Portal>
    </Root>
  );
}
