import { svgList } from 'assets/svg';
import styles from '../css/DropDown.module.css';

const DropDown = ({
	options,
	selection,
	onSelect,
	type,
	btnName,
	openState,
	setOpenState,
}) => {
	switch (type) {
		case 'radio':
			return (
				<div className={styles.dropDownBody}>
					<div
						onClick={() => {
							setOpenState(!openState);
						}}
						className={styles.headerBtn}
						style={{ width: '4vw' }}
					>
						{btnName} {svgList.apmtDetail.toggle}
					</div>
					{openState && (
						<div
							className={styles.optionForm}
							style={{ padding: 0, overflowY: 'scroll' }}
						>
							{/* 선택지 폼 */}
							{options.map((option, index) => (
								<div
									key={index}
									onClick={() => onSelect(option)}
									className={styles.optionList}
								>
									{selection == option ? (
										<div className={styles.optionSelected}>{option}</div>
									) : (
										<div className={styles.optionUnSelected}>{option}</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			);
		case 'checkbox':
			return (
				<div className={styles.dropDownBody}>
					<div
						onClick={() => {
							setOpenState(!openState);
						}}
						className={styles.headerBtn}
					>
						{btnName}
					</div>
					{openState && (
						<div className={styles.optionForm}>
							{/* 선택지 폼 */}
							{options.map((option, index) => (
								<div
									key={index}
									onClick={() => onSelect(option)}
									className={styles.optionList}
								>
									{selection.includes(option) ? (
										<div>{svgList.apmtDetail.checkboxChecked}</div>
									) : (
										<div>{svgList.apmtDetail.checkboxEmpty}</div>
									)}
									<div style={{ marginTop: 1, marginLeft: 4 }}>{option}</div>
								</div>
							))}
						</div>
					)}
				</div>
			);
	}
};

export default DropDown;
