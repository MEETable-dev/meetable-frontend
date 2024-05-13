import React from "react";
import styles from 'css/Layout.module.css';
import { svgList } from 'assets/svg';
import { useNavigate, useLocation } from "react-router-dom";

function SmallTrashCan({onClick,  openModal}){
    return (
      <div className={styles.TrashBox} onClick ={()=>{onClick(true)}} onContextMenu={(event)=>{ event.preventDefault(); openModal('-1', event,'t')}}>
        <div className={styles.trashIcon} >
          {svgList.smallTrashIcon}
        </div>
        <div className={styles.TrashName}>휴지통</div>
      </div>
    );
  }

export default SmallTrashCan;