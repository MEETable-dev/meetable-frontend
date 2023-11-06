import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/layout.module.css';
import { useAppDispatch } from "../store";
// import userSlice from "../slices/user";
import { useSelector } from "react-redux";
import { setToken } from "../slices/user";
import user from "../slices/user";

const Layout = () => {
  const sidebarInitialSize = 300;
  const sidebarMinWidth = 100;
  const sidebarMaxWidth = 500;
  const { resizing, size, startResizing, stopResizing, updateSize, reset } = 
    useResizeSidebar(sidebarInitialSize, sidebarMinWidth, sidebarMaxWidth)
    const dispatch = useAppDispatch();
    const title = useSelector((state)=>{state.user.accessToken});
  return (
    <div className={resizing ? styles.containerResizing : styles.container} 
      onPointerMove={updateSize} onPointerUp={stopResizing}
    >
      <div className={styles.sidebarWrapper} style={{flexBasis:size}}>
        <div className={styles.sidebarContent}>
          <h2 onClick={()=>{
            dispatch(
              setToken('meetable')
            );
            console.log('hello')
          }
            }>{title}</h2>
          <ul>
            <li>Item</li>
            <li>Item</li>
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
          className={styles.sidebarBorder}
          onDoubleClick={reset}>
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