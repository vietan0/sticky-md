import { useContext } from 'react';
import { Root, Trigger, Portal, Content, Arrow, Item } from '@radix-ui/react-dropdown-menu';
import { signOut } from 'firebase/auth';
import { UserContext } from '../contexts/UserContext';
import { auth } from '../firebase';
import Settings from './icons/Settings';
import LogOut from './icons/LogOut';

export default function SettingCorner() {
  const currentUser = useContext(UserContext);

  return (
    <Root>
      <Trigger className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-800 rounded">
        {currentUser?.displayName || currentUser?.email}
      </Trigger>
      <Portal>
        <Content align="end" className="rounded bg-slate-900 p-2 flex flex-col">
          <Item className="p-2 rounded flex gap-2 hover:bg-slate-800 cursor-pointer">
            <Settings />
            <span>Settings</span>
          </Item>
          <Item
            onClick={async () => await signOut(auth)}
            className="p-2 rounded flex gap-2 hover:bg-slate-800 cursor-pointer"
          >
            <LogOut />
            <span>Log Out</span>
          </Item>
          <Arrow className="fill-slate-900" />
        </Content>
      </Portal>
    </Root>
  );
}
