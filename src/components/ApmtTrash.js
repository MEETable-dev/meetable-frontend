import styles from '../css/ApmtTrash.module.css';
import React from "react";
import { svgList } from 'assets/svg';


const ApmtTrash = ({ className, onClick, children, text}) =>{
    return (

    <div className={styles.ApmtBox} onClick = {onClick}>
        <div className={styles.ApmtIcon}>{svgList.folder.trash}</div>
        <div className={styles.ApmtName}>{children}
          </div>
      </div>
    );
};

export default ApmtTrash;