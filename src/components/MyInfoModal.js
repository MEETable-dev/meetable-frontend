import React from 'react';
import styles from '../css/PolicyModal.module.css'; // Update the import path as necessary
import { svgList } from "../assets/svg";

const PolicyModal = ({ title, onClose, children }, ref) => {
  return (
    <div ref={ref}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            <div className={styles.closeX}>
              {svgList.policyIcon.closeBtn}
            </div>
          </button>
          <h2>{title}</h2>
          <div className={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default PolicyModal;
export default React.forwardRef(PolicyModal);