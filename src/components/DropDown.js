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
	disabled,
}) => {
	switch (type) {
		case 'radio':
			return (
				<div className={styles.dropDownBody}>
					<div
						onClick={() => {
							if (!disabled) setOpenState(!openState);
						}}
						className={styles.headerBtn}
						style={
							disabled
								? {
										width: '4vw',
										maxWidth: 40,
										minWidth: 20,
										color: '#888888',
								  }
								: {
										width: '4vw',
										maxWidth: 40,
										minWidth: 20,
								  }
						}
					>
						{btnName} {svgList.apmtDetail.toggle}
					</div>
					{openState && (
						<div className={styles.optionForm} style={{ padding: 0 }}>
							{/* 선택지 폼 */}
							{options.map((option, index) => (
								<div
									key={index}
									onClick={() => {if(!disabled) onSelect(option)}}
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
							if (!disabled) setOpenState(!openState);
						}}
						className={styles.headerBtn}
						style={disabled ? { color: '#888888' } : {}}
					>
						{btnName}
					</div>
					{openState && (
						<div className={styles.optionForm}>
							{/* 선택지 폼 */}
							{options.map((option, index) => (
								<div
									key={index}
									onClick={() => {
										if (!disabled) onSelect(option);
									}}
									className={styles.optionList}
									style={disabled ? { color: '#888888' } : {}}
								>
									{selection.includes(option) ? ( // id와 type이 같은 걸 포함하고 있는지
										<div>{svgList.apmtDetail.checkboxChecked}</div>
									) : (
										<div>{svgList.apmtDetail.checkboxEmpty}</div>
									)}
									<div style={{ marginTop: 1, marginLeft: 4 }}>
										{option.split('-')[2]}
									</div>{' '}
								</div>
							))}
						</div>
					)}
				</div>
			);
	}
};

export default DropDown;
