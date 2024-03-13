import { svgList } from 'assets/svg';
import styles from '../css/ColorBar.module.css';
const ColorBar = ({ total }) => {
	return (
		<div className={styles.filterBody}>
			0/{total}
			<div className={styles.filterImg}>{svgList.apmtDetail.colorBar}</div>
			{total}/{total}
		</div>
	);
};

export default ColorBar;
