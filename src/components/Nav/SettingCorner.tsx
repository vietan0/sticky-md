import { useContext } from 'react';
import { Root, Trigger, Portal, Content, Arrow, Item } from '@radix-ui/react-dropdown-menu';
import { User, signOut } from 'firebase/auth';
import Avatar from 'boring-avatars';
import { UserContext } from '../../contexts';
import { auth } from '../../firebase/auth';
import Settings from '../icons/Settings';
import SignOut from '../icons/SignOut';

export default function SettingCorner() {
  const currentUser = useContext(UserContext) as User;

  return (
    <Root>
      <Trigger className="rounded-full p-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800">
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="" className="w-8 rounded-full" />
        ) : (
          <Avatar
            size={32}
            name={currentUser?.uid || ''}
            variant="pixel"
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
        )}
      </Trigger>
      <Portal>
        <Content
          align="end"
          className="flex flex-col rounded bg-neutral-100 p-1 text-sm shadow-lg dark:bg-neutral-900"
        >
          <Item className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Item>
          <Item
            onClick={async () => await signOut(auth)}
            className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <SignOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Item>
          <Arrow className="fill-neutral-100 dark:fill-neutral-900" />
        </Content>
      </Portal>
    </Root>
  );
}
