import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/layout.module.css';
import { useSelector } from "react-redux";
import { useState } from "react";
import { svgList } from "../assets/svg";
import React from "react";

const Layout = () => {
  const sidebarInitialSize = 300;
  const sidebarMinWidth = 100;
  const sidebarMaxWidth = 500;
  const { resizing, size, startResizing, stopResizing, updateSize, reset } = 
    useResizeSidebar(sidebarInitialSize, sidebarMinWidth, sidebarMaxWidth)
    const accessToken = useSelector((state) => state.user.accessToken);
    const [sidebarShown, setsidebarShown] = useState(true);
  return (
    <div className={resizing ? styles.containerResizing : styles.container} 
      onPointerMove={updateSize} onPointerUp={stopResizing}
    >
      {accessToken && sidebarShown && <div className={styles.sidebarWrapper} style={{flexBasis:size}}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <div onClick={()=>setsidebarShown(false)}>{svgList.headerIcon.headerHide}</div>
          </div>
          <div className={styles.sidebarMain}>
            <ul>
              <li>{process.env.REACT_APP_API_URL}</li>
              <li>{accessToken}</li>
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
        </div>
        <div 
          onPointerDown={startResizing}
          className={styles.sidebarBorder}
          onDoubleClick={reset}>
        </div>
      </div>}
      <div className={styles.mainWrapper}>
        <header className={styles.headerWrapper}>
          <div className={styles.headerBtnLeft}>
            {accessToken && !sidebarShown && <div onClick={()=>setsidebarShown(true)}>{svgList.headerIcon.headerShow}</div>}
          </div>
          <div className={styles.headerCenter}>
            MEETable
          </div>
          <div className={styles.headerBtnRight}>
            <div>{accessToken && svgList.headerIcon.list}</div>
            <div>{svgList.headerIcon.person}</div>

          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;