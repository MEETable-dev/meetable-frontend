import { svgList } from 'assets/svg';
import styles from '../css/Filter.module.css';
import DropDown from './DropDown';
import { useState } from 'react';

const Filter = ({
	total,
	options,
	selectionNum,
	onSelectNum,
	selectionTime,
	onSelectTime,
	selectionParti,
	onSelectParti,
}) => {
	const [openPersonFilter, setOpenPersonFilter] = useState(false);
	return (
		<div className={styles.filterBody}>
			<div className={styles.filterSection}>
				최소 인원
				<DropDown
					options={Array.from({ length: total }, (_, index) => index + 1)}
					selection={[]}
					// onSelect={(option) => onSelectParti(option)}
					type={'radio'}
					btnName={selectionNum}
					openState={openPersonFilter}
					setOpenState={setOpenPersonFilter}
				/>
				명
			</div>
			<div className={styles.filterSection}>최소 시간 시간</div>
			<div className={styles.filterSection}>
				필수참여자{' '}
				<DropDown
					options={options}
					selection={selectionParti}
					onSelect={(option) => onSelectParti(option)}
					type={'checkbox'}
					btnName={'지정'}
					openState={openPersonFilter}
					setOpenState={setOpenPersonFilter}
				/>
			</div>
		</div>
	);
};

export default Filter;
