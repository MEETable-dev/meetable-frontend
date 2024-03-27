import React from 'react';
import styles from '../css/OnlyShowModal.module.css'; // Update the import path as necessary
import { svgList } from '../assets/svg';

const OnlyShowModal = ({ children }, ref) => {
	return (
		<div ref={ref}>
			<div className={styles.modalOverlay}>
				<div className={styles.modalContent}>
					<div className={styles.modalBody}>{children}</div>
				</div>
			</div>
		</div>
	);
};

export default React.forwardRef(OnlyShowModal);
