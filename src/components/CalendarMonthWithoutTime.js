// import ConfirmedApmt from './ConfirmedApmt';
// import CustomedSched from './CustomedSched';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../css/CalendarMonthWithoutTime.module.css';
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	isSameWeek,
	subDays,
	addDays,
	parse,
	isBefore,
	getWeekOfMonth,
	getDay,
	getYear,
	getMonth,
	isSameDay,
	add,
	isSameMonth,
} from 'date-fns';
import CustomColor from 'hooks/CustomColor';

const CalendarMonthWithoutTime = (props) => {
	const accessToken = useSelector((state) => state.user.accessToken);

	let promiseId = props.promiseId;
	let selectWeek = props.selectWeek;
	let setSelectWeek = props.setSelectWeek;
	let editing = props.editing;
	let promiseTotal = props.promiseTotal;
	let selectedInfo = props.selectedInfo;
	let canParti = props.canParti;
	let setCanParti = props.setCanParti;
	let reset = props.reset;
	let setReset = props.setReset;
	let nonmemberId = props.nonmemberId;
	let options = new Set(Object.keys(selectedInfo));

	const [dragStart, setDragStart] = useState(null);
	const [dragEnd, setDragEnd] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [selectDate, setSelectDate] = useState(new Set());
	const [selectingDate, setSelectingDate] = useState(new Set());
	const [removingDate, setRemovingDate] = useState(new Set());
	const [adding, setAdding] = useState(true);

	let confirming = props.confirming;
	let confirmSelected = props.confirmSelected;
	let setConfirmSelected = props.setConfirmSelected;
	let confirmed = props.confirmed;

	let showConfirmModal = props.showConfirmModal;
	let setShowConfirmModal = props.setShowConfirmModal;
	let setModalPosition = props.setModalPosition;

	const [confirmAdding, setConfirmAdding] = useState(new Set()); // 확정 선택 중 목록
	const [confirmRemoving, setConfirmRemoving] = useState(new Set()); // 확정 선택 중 목록

	const updateAndDelete = async (adding, selectingDate, selectDate) => {
		const result = [];
		if (adding) {
			selectingDate
				.difference(selectDate)
				.intersection(options)
				.forEach((dateStr) => {
					result.push(format(new Date(dateStr), 'yyyy-MM-dd'));
				});
		} else {
			selectingDate
				.intersection(selectDate)
				.intersection(options)
				.forEach((dateStr) => {
					result.push(format(new Date(dateStr), 'yyyy-MM-dd'));
				});
		}

		console.log(result);
		// 업데이트 로직 넣기
		if (!confirming) {
			try {
				if (adding) {
					const response = await axios.post(
						`${process.env.REACT_APP_API_URL}/promise/time`,
						{
							promiseId: promiseId.split('_')[0],
							dateAvailable: result,
						},
						!accessToken && { headers: { Authorization: `@${nonmemberId}` } },
					);
					console.log(response.data);
				} else {
					if (accessToken) {
						const response = await axios.delete(
							`${process.env.REACT_APP_API_URL}/promise/deletetime`,
							{
								data: {
									promiseId: promiseId.split('_')[0],
									dateToDelete: result,
								},
							},
						);
						console.log(response.data);
					} else {
						const response = await axios.delete(
							`${process.env.REACT_APP_API_URL}/promise/deletetime`,
							{
								data: {
									promiseId: promiseId.split('_')[0],
									dateToDelete: result,
								},
								headers: { Authorization: `@${nonmemberId}` },
							},
						);
						console.log(response.data);
					}
				}
				setReset(!reset);
			} catch (error) {
				const errorResponse = error.response;
				console.log(errorResponse.data.statusCode);
			}
		}
		return result;
	};

	const getMyParti = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/myinfo/${
					promiseId.split('_')[0]
				}?month=${format(selectWeek, 'yyyy-MM')}`,
				!accessToken && { headers: { Authorization: `@${nonmemberId}` } },
			);
			console.log('myparti', response.data);
			setSelectDate(new Set(response.data.date_available));
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	useEffect(() => {
		if (!isDragging && (nonmemberId !== -1 || accessToken)) getMyParti();
	}, [setReset, nonmemberId]);

	const handleMouseDown = (date, event) => {
		if (editing) {
			setDragStart(date);
			setIsDragging(true);
			if (selectDate.has(format(date, 'yyyy-MM-dd'))) setAdding(false);
			else setAdding(true);
		} else if (confirming) {
			setDragStart(date);
			setIsDragging(true);
			if (confirmSelected.has(format(date, 'yyyy-MM-dd'))) setAdding(false);
			else setAdding(true);
		} else {
			if (confirmed.has(format(date, 'yyyy-MM-dd'))) {
				setTimeout(() => {
					setShowConfirmModal('click');
					console.log(event.clientX, event.clientY);
					setModalPosition([event.clientX, event.clientY]);
				}, 50);
			} else {
				// 참가자 고정?
			}
		}
	};

	const handleMouseUp = (date) => {
		if (editing) {
			setDragEnd(date);
			setIsDragging(false);
			if (isSameDay(dragStart, date)) onDateClick(date);
			else {
				if (adding) {
					// console.log(selectingDate.difference(selectDate));
					// selectingDate.difference(selectDate).forEach((dateStr) => {
					// 	console.log(DaysOfWeek[getDay(new Date(dateStr))]);
					// });
					updateAndDelete(true, selectingDate, selectDate);
					setSelectDate(
						(prevState) => new Set([...prevState, ...selectingDate]),
					);
				} else {
					// console.log('del', removingDate.intersection(selectDate));
					// removingDate.intersection(selectDate).forEach((dateStr) => {
					// 	console.log(DaysOfWeek[getDay(new Date(dateStr))]);
					// });
					updateAndDelete(false, removingDate, selectDate);

					setSelectDate((prevState) => {
						return new Set(
							[...prevState].filter((element) => !removingDate.has(element)),
						);
					});
				}
			}
			setSelectingDate(new Set());
			setRemovingDate(new Set());
		} else if (confirming) {
			setDragEnd(date);
			setIsDragging(false);
			if (isSameDay(dragStart, date)) onDateClick(date);
			else {
				if (adding) {
					updateAndDelete(true, confirmAdding, confirmSelected);
					setConfirmSelected(
						(prevState) => new Set([...prevState, ...confirmAdding]),
					);
				} else {
					updateAndDelete(false, confirmRemoving, confirmSelected);
					setConfirmSelected((prevState) => {
						return new Set(
							[...prevState].filter((element) => !confirmRemoving.has(element)),
						);
					});
				}
			}
			setConfirmAdding(new Set());
			setConfirmRemoving(new Set());
		}
		console.log('confirmSelected', confirmSelected);
	};

	const handleMouseMove = (date, event) => {
		if (editing) {
			if (isDragging && !isSameDay(dragEnd, date)) {
				setDragEnd(date);
				setSelectingDate(new Set());
				setRemovingDate(new Set());

				let start = new Date();
				let end = new Date();
				if (getDay(dragStart) <= getDay(date)) {
					if (isBefore(dragStart, date)) {
						// 오른쪽아래
						start = dragStart;
						end = date;
					} else {
						// 오른쪽위
						start = addDays(startOfWeek(date), getDay(dragStart));
						end = addDays(startOfWeek(dragStart), getDay(date));
					}
				} else {
					if (isBefore(date, dragStart)) {
						// 왼쪽위
						start = date;
						end = dragStart;
					} else {
						// 왼쪽아래
						start = addDays(startOfWeek(dragStart), getDay(date));
						end = addDays(startOfWeek(date), getDay(dragStart));
					}
				}

				let A = start;
				while (isBefore(A, addDays(end, 1))) {
					let day = format(A, 'yyyy-MM-dd');
					// console.log(day);
					if (adding)
						setSelectingDate((prevState) => new Set([...prevState, day]));
					// console.log(selectingDate)
					else setRemovingDate((prevState) => new Set([...prevState, day]));

					if (getDay(A) == getDay(end)) {
						A = addDays(A, 7 - getDay(end) + getDay(start));
						continue;
					}
					A = addDays(A, 1);
				}
			}
		} else {
			getCanParti(date);
			if (confirming) {
				if (isDragging && !isSameDay(dragEnd, date)) {
					setDragEnd(date);
					setConfirmAdding(new Set());
					setConfirmRemoving(new Set());

					let start = new Date();
					let end = new Date();
					if (getDay(dragStart) <= getDay(date)) {
						if (isBefore(dragStart, date)) {
							// 오른쪽아래
							start = dragStart;
							end = date;
						} else {
							// 오른쪽위
							start = addDays(startOfWeek(date), getDay(dragStart));
							end = addDays(startOfWeek(dragStart), getDay(date));
						}
					} else {
						if (isBefore(date, dragStart)) {
							// 왼쪽위
							start = date;
							end = dragStart;
						} else {
							// 왼쪽아래
							start = addDays(startOfWeek(dragStart), getDay(date));
							end = addDays(startOfWeek(date), getDay(dragStart));
						}
					}

					let A = start;
					while (isBefore(A, addDays(end, 1))) {
						let day = format(A, 'yyyy-MM-dd');
						// console.log(day);
						if (adding)
							setConfirmAdding((prevState) => new Set([...prevState, day]));
						// console.log(selectingDate)
						else
							setConfirmRemoving((prevState) => new Set([...prevState, day]));

						if (getDay(A) == getDay(end)) {
							A = addDays(A, 7 - getDay(end) + getDay(start));
							continue;
						}
						A = addDays(A, 1);
					}
				}
			} else {
				if (confirmed.has(format(date, 'yyyy-MM-dd'))) {
					if (showConfirmModal == 'no') {
						setShowConfirmModal('hover');
						console.log(event.clientX, event.clientY);
						setModalPosition([event.clientX, event.clientY]);
					}
				} else {
					if (showConfirmModal == 'hover') {
						setShowConfirmModal('no');
					}
				}
			}
		}
	};

	const getCanParti = async (date) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/hover/${
					promiseId.split('_')[0]
				}?date=${format(date, 'yyyy-MM-dd')}`,
				!accessToken && { headers: { Authorization: `@${nonmemberId}` } },
			);
			setCanParti(response.data.participants);
			// response.data.participants.map((item, index) => {
			// 	setCanParti((prev) => [...prev, item.name]);
			// });
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const table = [];

	const Body = ({ selectWeek, onDateClick }) => {
		const monthStart = startOfMonth(selectWeek);
		const monthEnd = endOfMonth(selectWeek);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);
		// cont [selectWeek, setSelectWeek] = useState(currsentDate);

		const rows = [];
		let days = [];
		let dayHeaders = [];
		let day = startDate;
		let formattedDate = '';

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				formattedDate = format(day, 'd');
				const cloneDay = day;
				let color = CustomColor(
					promiseTotal,
					selectedInfo[`${format(day, 'yyyy-MM-dd')}`],
				);
				days.push(
					<div className={styles.eachDay} key={cloneDay}>
						<div
							// 범위에 포함 안되면 disabled 추가
							// 일정 있으면
							// 확정된 약속 있으면
							className={
								!options.has(format(day, 'yyyy-MM-dd'))
									? `${styles.col} ${styles.day} ${styles.disabled}`
									: editing
									? (selectDate.has(format(day, 'yyyy-MM-dd')) ||
											selectingDate.has(format(day, 'yyyy-MM-dd'))) &&
									  !removingDate.has(format(day, 'yyyy-MM-dd'))
										? `${styles.col} ${styles.day} ${styles.selected}`
										: `${styles.col} ${styles.day} ${styles.valid}`
									: confirming
									? (confirmSelected.has(format(day, 'yyyy-MM-dd')) ||
											confirmAdding.has(format(day, 'yyyy-MM-dd'))) &&
									  !confirmRemoving.has(format(day, 'yyyy-MM-dd'))
										? `${styles.col} ${styles.day} ${styles.confirmSelected}`
										: color === 'valid'
										? `${styles.col} ${styles.day} ${styles.valid}`
										: color === 'E0CEFF'
										? `${styles.col} ${styles.day} ${styles.Lv1}`
										: color === 'BEA1FE'
										? `${styles.col} ${styles.day} ${styles.Lv2}`
										: color === 'A988F0'
										? `${styles.col} ${styles.day} ${styles.Lv3}`
										: color === '8D63E8'
										? `${styles.col} ${styles.day} ${styles.Lv4}`
										: color === '6330DE'
										? `${styles.col} ${styles.day} ${styles.Lv5}`
										: color === '4B1CBC'
										? `${styles.col} ${styles.day} ${styles.Lv6}`
										: `${styles.col} ${styles.day} ${styles.Lv7}`
									: confirmed.has(format(day, 'yyyy-MM-dd'))
									? `${styles.col} ${styles.day} ${styles.confirmSelected}`
									: color === 'valid'
									? `${styles.col} ${styles.day} ${styles.valid}`
									: color === 'E0CEFF'
									? `${styles.col} ${styles.day} ${styles.Lv1}`
									: color === 'BEA1FE'
									? `${styles.col} ${styles.day} ${styles.Lv2}`
									: color === 'A988F0'
									? `${styles.col} ${styles.day} ${styles.Lv3}`
									: color === '8D63E8'
									? `${styles.col} ${styles.day} ${styles.Lv4}`
									: color === '6330DE'
									? `${styles.col} ${styles.day} ${styles.Lv5}`
									: color === '4B1CBC'
									? `${styles.col} ${styles.day} ${styles.Lv6}`
									: `${styles.col} ${styles.day} ${styles.Lv7}`
							}
							// id={`${styles.selected}`}
							style={getStyles()}
							key={day}
							onMouseDown={(e) => handleMouseDown(cloneDay, e)}
							onMouseUp={() => handleMouseUp(cloneDay)}
							onMouseMove={(e) => handleMouseMove(cloneDay, e)}
						>
							{!options.has(format(day, 'yyyy-MM-dd')) && (
								<svg
									width="60"
									height="60"
									viewBox="0 0 60 60"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M59 1L1 59"
										stroke="#A8A8A8"
										stroke-linecap="round"
									/>
									<path
										d="M1 1L59 59"
										stroke="#A8A8A8"
										stroke-linecap="round"
									/>
								</svg>
							)}
							{/* {options.has(format(day, 'yyyy-MM-dd')) && (
								<AiOutlineCalendar
									size={24}
									color="#FFFFFF"
									style={{ position: 'absolute', left: 0, top: 0 }}
								/>
							)} */}
							{options.has(format(day, 'yyyy-MM-dd')) &&
								selectedInfo[format(day, 'yyyy-MM-dd')] != 0 &&
								!editing && (
									<div className={styles.howmany}>
										{selectedInfo[format(day, 'yyyy-MM-dd')]}
									</div>
								)}
						</div>
					</div>,
				);
				dayHeaders.push(
					<div className={styles.col} style={getStyles()}>
						<div
							className={
								styles[
									format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
										? 'dateHeaderToday'
										: 'dateHeader'
								]
							}
						>
							{formattedDate}
						</div>
					</div>,
				);
				table.push(days);
				day = addDays(day, 1);
			}
			rows.push(
				<div style={{ marginBottom: '7px' }} key={'Week' + day}>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						{dayHeaders}
					</div>
					<div
						className={styles.week}
						style={{ display: 'flex', flexDirection: 'row' }}
					>
						{days}
					</div>
				</div>,
			);
			days = [];
			dayHeaders = [];
		}
		return <div className={styles.body}>{rows}</div>;
	};
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const DivDates = [];

	const getStyles = () => {
		if (windowWidth < 580) {
			return {
				position: 'relative',
				width: '27px',
				marginLeft: '2.9px',
				marginRight: '2.9px',
			};
		} else if (windowWidth >= 580 && windowWidth <= 1200) {
			return {
				position: 'relative',
				width: '4.5vw',
				marginLeft: '0.5vw',
				marginRight: '0.5vw',
			};
		} else {
			return {
				position: 'relative',
				width: '60px',
				marginLeft: '4px',
				marginRight: '4px',
			};
		}
	};

	for (let i = 0; i < 7; i++) {
		DivDates.push(
			<div className={styles.colDays} style={getStyles()}>
				{days[i]}
			</div>,
		);
	}

	const prevMonth = () => {
		setSelectWeek(subMonths(selectWeek, 1));
	};
	const nextMonth = () => {
		setSelectWeek(addMonths(selectWeek, 1));
	};
	const onDateClick = (day) => {
		if (confirming) {
			if (confirmSelected.has(format(day, 'yyyy-MM-dd'))) {
				updateAndDelete(
					false,
					new Set([format(day, 'yyyy-MM-dd')]),
					confirmSelected,
				);
				setConfirmSelected((prevState) => {
					prevState.delete(format(day, 'yyyy-MM-dd'));
					return new Set([...prevState]);
				});
			} else {
				updateAndDelete(
					true,
					new Set([format(day, 'yyyy-MM-dd')]),
					confirmSelected,
				);
				setConfirmSelected(
					(prevState) => new Set([...prevState, format(day, 'yyyy-MM-dd')]),
				);
			}
		} else {
			if (selectDate.has(format(day, 'yyyy-MM-dd'))) {
				updateAndDelete(
					false,
					new Set([format(day, 'yyyy-MM-dd')]),
					selectDate,
				);
				setSelectDate((prevState) => {
					prevState.delete(format(day, 'yyyy-MM-dd'));
					return new Set([...prevState]);
				});
			} else {
				updateAndDelete(true, new Set([format(day, 'yyyy-MM-dd')]), selectDate);
				// console.log(new Set([format(day, 'yyyy-MM-dd')]).difference(selectDate));
				setSelectDate(
					(prevState) => new Set([...prevState, format(day, 'yyyy-MM-dd')]),
				);
			}
		}
	};

	return (
		<div
			className={styles.entire}
			style={
				windowWidth < 580
					? { marginLeft: '10px', marginRight: '10px', width: '280px' }
					: windowWidth >= 580 && windowWidth <= 1200
					? { marginLeft: '1.8vw', marginRight: '1.8vw', width: '43vw' }
					: { width: '580px' }
			}
		>
			<div className={styles.headerContainer}>
				<div className={styles.headerLeft}></div>
				<div className={styles.headerCenter}>
					<div className={styles.toAnotherMonth} onClick={prevMonth}>
						<svg
							width="18"
							height="18"
							viewBox="0 0 18 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M11.9883 16.2403L13.0527 15.1759L6.87677 8.99989L13.0527 2.82392L11.9883 1.75952L4.74796 8.99989L11.9883 16.2403Z"
								fill="#888888"
							/>
						</svg>
					</div>
					<div className={styles.headerText}>
						{format(selectWeek, 'yy')}년 {format(selectWeek, 'M')}월
					</div>
					<div className={styles.toAnotherMonth} onClick={nextMonth}>
						<svg
							width="18"
							height="18"
							viewBox="0 0 18 18"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6.01167 16.2403L4.94727 15.1759L11.1232 8.99989L4.94727 2.82392L6.01167 1.75952L13.252 8.99989L6.01167 16.2403Z"
								fill="#888888"
							/>
						</svg>
					</div>
				</div>
				<div className={styles.headerRight}>
					<div
						className={styles.TodayBtn}
						onClick={() => {
							setSelectWeek(new Date());
						}}
					>
						오늘
					</div>
				</div>
			</div>
			<div className={styles.bodyContainer}>
				<div
					className={styles.DaysOfWeek}
					style={
						windowWidth < 580
							? { marginLeft: '12px', marginRight: '12px' }
							: windowWidth >= 580 && windowWidth <= 1200
							? { marginLeft: '2vw', marginRight: '2vw' }
							: { marginLeft: '40px', marginRight: '40px' }
					}
				>
					{DivDates}
				</div>
				<div
					className={styles.body}
					style={
						windowWidth < 580
							? { marginLeft: '12px', marginRight: '12px' }
							: windowWidth >= 580 && windowWidth <= 1200
							? { marginLeft: '2vw', marginRight: '2vw' }
							: { marginLeft: '40px', marginRight: '40px' }
					}
				>
					<Body selectWeek={selectWeek} onDateClick={onDateClick} />
				</div>
			</div>
			{/* <ConfirmedApmt />
    <CustomedSched /> */}
		</div>
	);
};

export default CalendarMonthWithoutTime;