import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts';
import Check from '../icons/Check';
import Desktop from '../icons/Desktop';
import Moon from '../icons/Moon';
import Sun from '../icons/Sun';

export default function ThemeToggle() {
  const { theme, setTheme, htmlHasDark } = useContext(ThemeContext);
  let themeIcon;

  if (theme === 'light') {
    themeIcon = <Sun className="size-6 stroke-blue-500" />;
  }

  if (theme === 'dark') {
    themeIcon = <Moon className="size-6 stroke-blue-500" />;
  }

  if (theme === 'os') {
    if (htmlHasDark)
      themeIcon = <Moon className="size-6" />;
    else themeIcon = <Sun className="size-6" />;
  }

  return (
    <Dropdown
      classNames={{
        content: 'min-w-0 outline outline-default-300 shadow-none',
      }}
      placement="bottom-end"
      radius="sm"
      showArrow
    >
      <DropdownTrigger>
        <Button
          aria-label="Theme dropdown trigger"
          color="primary"
          isIconOnly
          radius="full"
          variant="light"
        >
          {themeIcon}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Choose themes"
        color="primary"
        onAction={key => setTheme(key as 'light' | 'dark' | 'os')}
        selectionMode="single"
        variant="flat"
      >
        <DropdownItem
          key="light"
          selectedIcon={() => theme === 'light' && <Check className="size-4" />}
          startContent={<Sun className="size-5" />}
        >
          Light
        </DropdownItem>
        <DropdownItem
          key="dark"
          selectedIcon={() => theme === 'dark' && <Check className="size-4" />}
          startContent={<Moon className="size-5" />}
        >
          Dark
        </DropdownItem>
        <DropdownItem
          key="os"
          selectedIcon={() => theme === 'os' && <Check className="size-4" />}
          startContent={<Desktop className="size-5" />}
        >
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
