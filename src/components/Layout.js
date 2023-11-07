import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/layout.module.css';

const Layout = () => {
  const sidebarInitialSize = 300;
  const sidebarMinWidth = 100;
  const sidebarMaxWidth = 500;
  const { resizing, size, startResizing, stopResizing, updateSize } = 
    useResizeSidebar(sidebarInitialSize, sidebarMinWidth, sidebarMaxWidth)
  return (
    <div className={resizing ? styles.containerResizing : styles.container} 
      onPointerMove={updateSize} onPointerUp={stopResizing}
    >
      <div className={styles.sidebarWrapper} style={{flexBasis:size}}>
        <div className={styles.sidebarContent}>
          <h2>Sidebar</h2>
          <ul>
            <li>Item</li>
            <li>item</li>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
          </ul>
        </div>
        <div 
          onPointerDown={startResizing}
          className={styles.sidebarBorder}>
        </div>
      </div>
      <div className={styles.mainWrapper}>
        <header className={styles.headerWrapper}><h1>Header</h1></header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;