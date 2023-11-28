import styles from '../css/ApmtBox.module.css';
import React from "react";
import { svgList } from 'assets/svg';
import {useState} from 'react';



const ApmtBox = ({ className, onClick, children, text, fav, name, id }) => {
    return (
      <div className={styles.ApmtBox} onClick = {onClick}>
        <div className={styles.ApmtIcon}>{svgList.folder.Apmt}</div>
        <div className={styles.ApmtName}>
          {fav && (
            <div className={styles.favoritesIcon}>{svgList.folder.star}</div>
          )}
          <div className={styles.favoritesText}>{children}</div>
        </div>
      </div>
    );
  };

  
  export default ApmtBox;