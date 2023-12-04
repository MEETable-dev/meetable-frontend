import React from 'react';
import styles from '../css/PolicyModal.module.css'; // Update the import path as necessary
import { svgList } from "../assets/svg";

const PolicyModal = ({ title, onClose, children }, ref) => {
  return (
    <div ref={ref}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHead}>
            <div className={styles.title}><b>{title}</b></div>
            <button className={styles.closeButton} onClick={onClose}>
              <div className={styles.closeX}>
                {svgList.policyIcon.closeBtn}
              </div>
            </button>
          </div>

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