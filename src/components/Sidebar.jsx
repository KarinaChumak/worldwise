import styles from './Sidebar.module.css';
import Logo from './Logo';
import AppNav from './AppNav';
import SidebarFooter from './SidebarFooter';
import { Outlet } from 'react-router';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo></Logo>
      <AppNav></AppNav>
      <Outlet></Outlet>

      <SidebarFooter></SidebarFooter>
    </div>
  );
}

export default Sidebar;
