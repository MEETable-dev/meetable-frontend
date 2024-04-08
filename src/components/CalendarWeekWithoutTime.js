// import ConfirmedApmt from './ConfirmedApmt';
// import CustomedSched from './CustomedSched';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../css/CalendarWeekWithoutTime.module.css';
import {
	format,
	addWeeks,
	subWeeks,
	addMinutes,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	isSameDay,
	getDay,
	addDays,
	parse,
	isBefore,
	startOfDay,
} from 'date-fns';
import { AiOutlineCalendar } from 'react-icons/ai';
import CustomColor from 'hooks/CustomColor';

const CalendarWeekWithoutTime = (props) => {
	const accessToken = useSelector((state) => state.user.accessToken);

	let promiseId = props.promiseId;
	let selectWeek = props.selectWeek;
	// let setSelectWeek = props.setSelectWeek;
	let editing = props.editing;
	let promiseTotal = props.promiseTotal;
	let selectedInfo = props.selectedInfo;
	let canParti = props.canParti;
	let setCanParti = props.setCanParti;
	let reset = props.reset;
	let setReset = props.setReset;
  let nonmemberId = props.nonmemberId;

	const [dragStart, setDragStart] = useState(null);
	const [dragEnd, setDragEnd] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [selectDate, setSelectDate] = useState(new Set());
	const [selectingDate, setSelectingDate] = useState(new Set());
	const [removingDate, setRemovingDate] = useState(new Set());
	const [adding, setAdding] = useState(true);

	const DaysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

	const updateAndDelete = async (adding, selectingDate) => {
		const result = [];
		if (adding) {
			selectingDate.difference(selectDate).forEach((dateStr) => {
				result.push(DaysOfWeek[getDay(new Date(dateStr))]);
			});
		} else {
			selectingDate.intersection(selectDate).forEach((dateStr) => {
				result.push(DaysOfWeek[getDay(new Date(dateStr))]);
			});
		}

		console.log(result);
		// 업데이트 로직 넣기
		try {
			if (adding) {
				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}/promise/time`,
					{
						promiseId: promiseId.split('_')[0],
						weekAvailable: result,
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
								weekToDelete: result,
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
								weekToDelete: result,
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
		return result;
	};

	function getThisWeekDatesForWeekdays(weekdayList) {
		const currentDayOfWeek = new Date().getDay(); // 오늘 요일
		const currentDate = new Date().getDate();

		const thisWeekDates = [];

		weekdayList.forEach((dayOfWeek) => {
			// 입력된 요일 인덱스
			const inputDayIndex = DaysOfWeek.indexOf(dayOfWeek);

			// 입력된 요일이 이번 주보다 이전에 있다면 이번 주의 해당 요일을 구함
			const daysToAdd = inputDayIndex - currentDayOfWeek;
			const targetDate = new Date(new Date());
			targetDate.setDate(currentDate + daysToAdd);

			const formattedDate = format(targetDate, 'yyyy-MM-dd');
			thisWeekDates.push(formattedDate);
		});

		return new Set(thisWeekDates);
	}

	const getMyParti = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/myinfo/${
					promiseId.split('_')[0]
				}`,
				!accessToken && { headers: { Authorization: `@${nonmemberId}` } },
			);
			setSelectDate(getThisWeekDatesForWeekdays(response.data.week_available));
			console.log('myparti', response.data.week_available);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	useEffect(() => {
		if (!isDragging && nonmemberId !== -1) getMyParti();
	}, [setReset, nonmemberId]);

	const handleMouseDown = (date) => {
		if (editing) {
			setDragStart(date);
			setIsDragging(true);
			if (selectDate.has(format(date, 'yyyy-MM-dd'))) setAdding(false);
			else setAdding(true);
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
					updateAndDelete(true, selectingDate);
					setSelectDate(
						(prevState) => new Set([...prevState, ...selectingDate]),
					);
				} else {
					// console.log('del', removingDate.intersection(selectDate));
					// removingDate.intersection(selectDate).forEach((dateStr) => {
					// 	console.log(DaysOfWeek[getDay(new Date(dateStr))]);
					// });
					updateAndDelete(false, removingDate);

					setSelectDate((prevState) => {
						return new Set(
							[...prevState].filter((element) => !removingDate.has(element)),
						);
					});
				}
			}
			setSelectingDate(new Set());
			setRemovingDate(new Set());
		}
	};

	const handleMouseMove = (date) => {
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
			// console.log(selectedInfo[`${DaysOfWeek[getDay(date)]}`]);
			getCanParti(date);
		}
	};

	const getCanParti = async (date) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/hover/${
					promiseId.split('_')[0]
				}?weekday=${DaysOfWeek[getDay(date)]}`,
				!accessToken && { headers: { Authorization: `@${nonmemberId}` } },
			);
			// console.log(response.data.participants);
			setCanParti(response.data.participants);
			// response.data.participants.map((item, index) => {
			// 	setCanParti((prev) => [...prev, item.name]);
			// });
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const Body = ({ selectDate, onTimeClick }) => {
		const startDate = startOfWeek(selectWeek);
		const endDate = endOfWeek(selectWeek);

		const cols = [];
		let times = [];
		let days = [];
		let dayHeaders = [];
		let day = startOfDay(startDate);
		let formattedDate = '';

		for (let i = 0; i < 7; i++) {
			formattedDate = format(day, 'd');
			// for (let j = 0; j < 48; j++) {
			const cloneDay = day;
			let color = CustomColor(
				promiseTotal,
				selectedInfo[`${DaysOfWeek[getDay(cloneDay)]}`],
			);
			days.push(
				<div
					// 범위에 포함 안되면 disabled 추가
					// 일정 있으면
					// 확정된 약속 있으면
					className={
						editing // 편집버전에서는 선택/선택x/비활성화 3단계의 배경색
							? (selectDate.has(format(day, 'yyyy-MM-dd')) ||
									selectingDate.has(format(day, 'yyyy-MM-dd'))) &&
							  !removingDate.has(format(day, 'yyyy-MM-dd'))
								? `${styles.col} ${styles.day} ${styles.selected}`
								: `${styles.col} ${styles.day} ${styles.valid}`
							: // 아닐 때는 선택 인원수에 따라 8단계의 배경색
							color === 'valid'
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
					onMouseDown={() => handleMouseDown(cloneDay)}
					onMouseUp={() => handleMouseUp(cloneDay)}
					onMouseMove={() => handleMouseMove(cloneDay)}
					// onClick={() => {
					//   // setSelectWeek(cloneDay);
					//   console.log(format(cloneDay, 'yyyy-MM-dd-HH-mm-ss'))
					//   onTimeClick(cloneDay)
					// }}
				>
					{/* <AiOutlineCalendar
						size={23}
						color="#FFFFFF"
						style={{ position: 'absolute', top: '2px', left: 2 }}
					/> */}
					<div className={styles.howmany}>
						{editing || selectedInfo[`${DaysOfWeek[getDay(cloneDay)]}`] === 0
							? ''
							: selectedInfo[`${DaysOfWeek[getDay(cloneDay)]}`]}
					</div>
				</div>,
			);
			day = addDays(day, 1);
			// }
			times.push(
				<div style={{ flexDirection: 'row' }}>
					<div>{days}</div>
				</div>,
			);
			days = [];
		}
		cols.push(
			<div
				style={{
					marginBottom: '7px',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				key={'Week' + day}
			>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					{dayHeaders}
				</div>
				<div
					className={styles.week}
					style={{ display: 'flex', flexDirection: 'row' }}
				>
					{times}
				</div>
			</div>,
		);
		return <div className={styles.body}>{cols}</div>;
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

	// const [selectDate, setSelectDate] = useState(new Set());

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

	const onTimeClick = (day) => {
		if (selectDate.has(format(day, 'yyyy-MM-dd-HH-mm-00'))) {
			setSelectDate((prevState) => {
				prevState.delete(format(day, 'yyyy-MM-dd-HH-mm-00'));
				return new Set(prevState);
			});
		} else {
			setSelectDate(
				(prevState) =>
					new Set([...prevState, format(day, 'yyyy-MM-dd-HH-mm-ss')]),
			);
		}
	};
	const onDateClick = (day) => {
		if (selectDate.has(format(day, 'yyyy-MM-dd'))) {
			updateAndDelete(false, new Set([format(day, 'yyyy-MM-dd')]));
			setSelectDate((prevState) => {
				prevState.delete(format(day, 'yyyy-MM-dd'));
				return new Set([...prevState]);
			});
		} else {
			updateAndDelete(true, new Set([day]));
			// console.log(new Set([format(day, 'yyyy-MM-dd')]).difference(selectDate));
			setSelectDate(
				(prevState) => new Set([...prevState, format(day, 'yyyy-MM-dd')]),
			);
		}
	};
	return (
		<div
			className={styles.entire}
			style={
				windowWidth < 580
					? { marginLeft: '10px', marginRight: '10px', width: '300px' }
					: windowWidth >= 580 && windowWidth <= 1200
					? { marginLeft: '1.8vw', marginRight: '1.8vw', width: '48vw' }
					: { width: '580px' }
			}
		>
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
					<Body selectDate={selectDate} onTimeClick={onTimeClick} />
				</div>
			</div>
		</div>
	);
};

export default CalendarWeekWithoutTime;