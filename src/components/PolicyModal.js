import React from 'react';
import styles from '../css/PolicyModal.module.css'; // Update the import path as necessary
import { svgList } from "../assets/svg";

const PolicyModal = ({ title, onClose, children }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          {svgList.policyIcon.closeBtn}
        </button>
        <h2>{title}</h2>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
