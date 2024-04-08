import { svgList } from 'assets/svg';
import styles from '../css/Filter.module.css';
import DropDown from './DropDown';
import { useState, useEffect } from 'react';

const Filter = ({
	total,
	options,
	selectionNum,
	onSelectNum,
	selectionTime,
	onSelectTime,
	selectionParti,
	onSelectParti,
	disabled,
}) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const [openNumFilter, setOpenNumFilter] = useState(false);
	const [openTimeFilter, setOpenTimeFilter] = useState(false);
	const [openPersonFilter, setOpenPersonFilter] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className={styles.filterBody}>
			<div
				className={styles.filterSection}
				style={disabled ? { color: '#888888' } : {}}
			>
				최소{windowWidth <= 450 ? <br /> : ' '}인원
				<DropDown
					// options={[2, 1, 20, 45, 40, 40]}
					options={Array.from({ length: total }, (_, index) => index + 1)}
					selection={selectionNum}
					onSelect={(option) => onSelectNum(option)}
					type={'radio'}
					btnName={selectionNum}
					openState={openNumFilter}
					setOpenState={setOpenNumFilter}
					disabled={disabled}
				/>
				명
			</div>
			{false && (
				<div
					className={styles.filterSection}
					style={disabled ? { color: '#888888' } : {}}
				>
					최소{windowWidth <= 450 ? <br /> : ' '}시간
					<DropDown
						// options={[2, 1, 20, 45]}
						options={[
							0.5,
							...Array.from({ length: 24 }, (_, index) => index + 1),
						]}
						selection={selectionNum}
						onSelect={(option) => onSelectNum(option)}
						type={'radio'}
						btnName={selectionNum}
						openState={openNumFilter}
						setOpenState={setOpenNumFilter}
						disabled={disabled}
					/>
					시간
				</div>
			)}
			<div
				className={styles.filterSection}
				style={
					disabled
						? { color: '#888888', textAlign: 'center' }
						: { textAlign: 'center' }
				}
			>
				필수{windowWidth <= 450 ? <br /> : ''}참여자{' '}
				<DropDown
					options={options}
					selection={selectionParti}
					onSelect={(option) => onSelectParti(option)}
					type={'checkbox'}
					btnName={'지정'}
					openState={openPersonFilter}
					setOpenState={setOpenPersonFilter}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

export default Filter;
