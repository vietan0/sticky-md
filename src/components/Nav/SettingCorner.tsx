import type { User } from 'firebase/auth';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import Avatar from 'boring-avatars';
import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from '../../contexts';
import { auth } from '../../firebase/auth';
import cn from '../../utils/cn';
import Settings from '../icons/Settings';
import SignOut from '../icons/SignOut';

export default function SettingCorner() {
  const currentUser = useContext(UserContext) as User;

  return (
    <Dropdown
      classNames={{
        content: cn('min-w-0 shadow-none outline outline-default-300'),
      }}
      placement="bottom-end"
      radius="sm"
      showArrow
    >
      <DropdownTrigger>
        <Button
          aria-label="Setting dropdown trigger"
          color="primary"
          isIconOnly
          radius="full"
          variant="light"
        >
          {currentUser?.photoURL
            ? <img alt="" className="w-8 rounded-full" src={currentUser.photoURL} />
            : (
                <Avatar
                  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                  name={currentUser?.uid || ''}
                  size={32}
                  variant="beam"
                />
              )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Choose themes"
        color="primary"
        onAction={key => key === 'signOut' && signOut(auth)}
        variant="flat"
      >
        <DropdownItem
          key="settings"
          startContent={<Settings className="size-5" />}
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="signOut"
          startContent={<SignOut className="size-5" />}
        >
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
