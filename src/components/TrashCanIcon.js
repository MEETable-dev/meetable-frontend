import React from "react";
import styles from 'css/AllApmt.module.css';
import { svgList } from 'assets/svg';

function TrashCanIcon({onClick,  openModal}){
    return (
      <div className={styles.TrashBox} onClick ={()=>{onClick(true)}} onContextMenu={(event)=>{ event.preventDefault(); openModal('-1', event,'t')}}>
        <div className={styles.TrashIcon} >
          {svgList.folder.trash}
        </div>
        <div className={styles.TrashName}>휴지통</div>
      </div>
    );
  }

export default TrashCanIcon;