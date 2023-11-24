import React from 'react';
import styles from '../css/PolicyModal.module.css'; // Update the import path as necessary

const PolicyModal = ({ title, onClose, children }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2>{title}</h2>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
