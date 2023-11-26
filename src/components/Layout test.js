import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/Layout.module.css';
import { useSelector } from "react-redux";
import { setToken } from "../store/modules/user";
import { useState } from "react";
import { svgList } from "../assets/svg";
import React from "react";
import { useAppDispatch } from "store";
import axios from "axios";

const LayoutTest = () => {
  const dispatch = useAppDispatch();
  const sidebarInitialSize = 300;
  const sidebarMinWidth = 100;
  const sidebarMaxWidth = 500;
  const click = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/test`, )
      console.log(response.data)
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
    }
  };
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
          <div className={styles.headerCenter} onClick={()=>click()}>
            MEETable
          </div>
          <div className={styles.headerBtnRight}>
            <div>{accessToken && svgList.headerIcon.list}</div>
            <div>{svgList.headerIcon.person}</div>

          </div>
        </header>
        <main>
          <div className={styles.check}>
            <h2 className={styles.check} id={styles.login} onClick={()=>{
              dispatch(
                setToken('ABCD')
              );
            }
              }>login:{accessToken}</h2>
              <h2 className={styles.check} id={styles.logout} onClick={()=>{
              dispatch(
                setToken('')
              );
            }
              }>logout:{accessToken}</h2>
              <h2 className={styles.check} id={styles.logout} onClick={()=>{
              dispatch(
                setToken('@@-ABCD')
              );
            }
              }>testError:{accessToken}</h2>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutTest;