import { Outlet } from "react-router-dom";
import styles from '../css/header.module.css';

const Layout = () => {
  return (
    <div>
      <header className={styles.name}>Header</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;