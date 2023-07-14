import { useContext } from 'react';
import { Root, Trigger, Portal, Content, Arrow, Item } from '@radix-ui/react-dropdown-menu';
import { User, signOut } from 'firebase/auth';
import { UserContext } from '../../contexts/UserContext';
import { auth } from '../../firebase/auth';
import Settings from '../icons/Settings';
import SignOut from '../icons/SignOut';

export default function SettingCorner() {
  const currentUser = useContext(UserContext) as User;

  return (
    <Root>
      <Trigger className="rounded bg-slate-100 px-4 py-3 hover:bg-slate-200 dark:hover:bg-slate-800 dark:bg-slate-900">
        {currentUser?.displayName || currentUser?.email}
      </Trigger>
      <Portal>
        <Content align="end" className="flex flex-col rounded bg-slate-100 dark:bg-slate-900 p-2 shadow-lg">
          <Item className="flex cursor-pointer gap-2 rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-800">
            <Settings className="h-6 w-6" />
            <span>Settings</span>
          </Item>
          <Item
            onClick={async () => await signOut(auth)}
            className="flex cursor-pointer gap-2 rounded p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <SignOut className="h-6 w-6" />
            <span>Sign Out</span>
          </Item>
          <Arrow className="fill-slate-100 dark:fill-slate-900" />
        </Content>
      </Portal>
    </Root>
  );
}
