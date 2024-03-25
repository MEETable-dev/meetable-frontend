import React from 'react';
import styles from '../css/ApmtShareModal.module.css'; // Update the import path as necessary
import { svgList } from '../assets/svg';

const ApmtShareModal = ({ title, onClose, children }, ref) => {
	return (
		<div ref={ref}>
			<div className={styles.modalOverlay} onClick={onClose}>
				<div
					className={styles.modalContent}
					onClick={(e) => e.stopPropagation()}
				>
					<div className={styles.closeBtn} onClick={onClose}>
						{svgList.policyIcon.closeBtn}
					</div>
					<div className={styles.modalBody}>{children}</div>
				</div>
			</div>
		</div>
	);
};

export default React.forwardRef(ApmtShareModal);
