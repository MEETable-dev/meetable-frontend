import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/AddSchModal.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

import SubmitBtn from "../components/SubmitBtn";
import CalendarNewSch from "../components/CalendarNewSch";
import InputArea from '../components/InputArea';

const AddSchModal = ({ onClose, defaultDate}, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);
    const navigate = useNavigate();
  
    const [isRepeat, setIsRepeat] = useState('F'); // F vs T
    const [repeatDetail, setRepeatDetail] = useState('A');
	const [daySelect, setDaySelect] = useState(false); // 달력 나와있는지 아닌지
	const [endDaySelect, setEndDaySelect] = useState(false); // 종료날짜 달력 나와있는지 아닌지
	const [selectedColor, setSelectedColor] = useState('red');

	const [selectDate, setSelectDate] = useState(new Set());
	const [selectEndDate, setSelectEndDate] = useState(new Date());

	useEffect(() => {
		if (defaultDate) {
			const date = new Date(defaultDate); // defaultDate를 Date 객체로 변환
			setSelectDate(new Set([date])); // 선택된 날짜를 설정
			setSelectEndDate(date); // 종료 날짜를 설정
		}
	}, [defaultDate]);	

	const selectedDatesSet = new Set([selectEndDate]); // 날짜 객체를 원소로 갖는 새로운 Set 생성

	const [timeByDate, setTimeByDate] = useState({}); // 날짜별 시간 상태 관리

	const [startTime, setStartTime] = useState(0);
	const [startMinute, setStartMinute] = useState(0);
	const [endTime, setEndTime] = useState(23);
	const [endMinute, setEndMinute] = useState(55);

	const [repeatTime, setRepeatTime] = useState(1);
	const [repeatNum, setRepeatNum] = useState(1);

	const [amptName, setAmptName] = useState('');
	const [placeName, setPlaceName] = useState('');
	const [memo, setMemo] = useState('');

	useEffect(() => {
		if (selectDate.size > 1) {
			setIsRepeat('F');
			// 다른 반복 옵션들을 비활성화
			setRepeatDetail('A');
		}
	}, [selectDate]);	

	const createSchedule = async () => {
		try {
			const formattedDates = Array.from(selectDate).map((date) =>
				format(date, 'yyyy-MM-dd'),
			);
			console.log(formattedDates);
			const colorOption = colors.findIndex(color => color.name === selectedColor);
			const scheduleTimes = Array.from(selectDate).map(date => {
				const dateString = format(date, 'yyyy-MM-dd');
				const {
				  startTime = 0,
				  startMinute = 0,
				  endTime = 23,
				  endMinute = 55,
				} = timeByDate[dateString] || {};
			  
				// 시간과 분을 문자열로 포맷팅하여 'hh:mm:ss' 형식으로 만듦
				const formattedStartTime = `${String(startTime).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
				const formattedEndTime = `${String(endTime).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
			  
				// 날짜와 시작/종료 시간을 결합하여 최종 문자열을 만듦
				return `${dateString} ${formattedStartTime} ${formattedEndTime}`;
			});
			const reptitionCycle = (isRepeat === 'T') ? repeatTime : 1;
			const isContinuous = (isRepeat === 'T' && repeatDetail === 'A') ? 'T' : 'F';
			const reptitionTime = (isRepeat === 'T' && repeatDetail === 'B') ? repeatNum : 1;
			const endDate = (isRepeat === 'T' && repeatDetail === 'C') ? format(selectEndDate, 'yyyy-MM-dd') : 0; // 아닐 경우엔 어떻게??

			// header
			const config = {
				headers: {
					Authorization: '@',
				},
			};
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/calendar/add`,
				{
					color: colorOption, // 0부터 시작? 1부터 시작?? - 일단은 0부터로..
					name: amptName,
					place: placeName,
					memo: memo,
					isreptition: isRepeat,
					scheduleTimes: scheduleTimes,
					reptitioncycle: reptitionCycle,
					iscontinuous: isContinuous,
					reptition_time: reptitionTime,
					end_date: endDate
				},
			); // config 객체를 요청과 함께 전달
			console.log(response.data);
			// 모달 닫히거나 생성되었다 알람 띄우기..?
			onClose();
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	// 일정 색 선택
	const handleColorSelect = (color) => {
		setSelectedColor(color);
	};
	const colors = [
		{ name: 'red', backgroundColor: '#FFC1C1' },
		{ name: 'orange', backgroundColor: '#FFD3B4' },
		{ name: 'yellow', backgroundColor: '#FFF48F' },
		{ name: 'green', backgroundColor: '#A3E399' },
		{ name: 'lightblue', backgroundColor: '#9AE0EA' },
		{ name: 'blue', backgroundColor: '#9BB3E1' },
		{ name: 'purple', backgroundColor: '#D29CE6' },
		{ name: 'pink', backgroundColor: '#FDA7FF' },
	];

	// Render color selection divs with onClick handler
	const renderColorSelection = () => {
		return colors.map((color) => (
			<div
				key={color.name}
				className={`${styles.colorSelect} ${
					selectedColor === color.name ? styles.selectedColor : ''
				}`}
				style={{ backgroundColor: color.backgroundColor }}
				onClick={() => handleColorSelect(color.name)}
			></div>
		));
	};

	// 날짜 변경 핸들러
	const handleDateChange = (newDate) => {
		setSelectDate((prevSelectDate) => {
			const dateString = format(newDate, 'yyyy-MM-dd');
			const updatedSelectDate = new Set(prevSelectDate);

			// 이미 선택된 날짜들을 문자열로 변환하여 비교
			const formattedDates = Array.from(updatedSelectDate).map((date) =>
				format(date, 'yyyy-MM-dd'),
			);

			if (formattedDates.includes(dateString)) {
				// 이미 선택된 날짜면 삭제
				updatedSelectDate.forEach((date) => {
					if (format(date, 'yyyy-MM-dd') === dateString) {
						updatedSelectDate.delete(date);
					}
				});
			} else {
				// 새로운 날짜면 추가
				updatedSelectDate.add(newDate);
			}
			return updatedSelectDate;
		});
	};

	const handleEndDateChange = (newDate) => {
		setSelectEndDate(newDate);
	};

	const handleTimeChange = (date, field, value) => {
		const dateString = format(date, 'yyyy-MM-dd');
		setTimeByDate((prevTimeByDate) => {
			const newTimeByDate = {
				...prevTimeByDate,
				[dateString]: {
					...prevTimeByDate[dateString],
					[field]: value,
				},
			};

			const { startTime, startMinute, endTime, endMinute } =
				newTimeByDate[dateString];

			if (field === 'startTime' || field === 'startMinute') {
				const newStartTime = field === 'startTime' ? value : startTime;
				const newStartMinute = field === 'startMinute' ? value : startMinute;

				if (
					newStartTime > endTime ||
					(newStartTime === endTime && newStartMinute > endMinute)
				) {
					newTimeByDate[dateString].endTime = newStartTime;
					newTimeByDate[dateString].endMinute = newStartMinute;
				}
			} else if (field === 'endTime' || field === 'endMinute') {
				const newEndTime = field === 'endTime' ? value : endTime;
				const newEndMinute = field === 'endMinute' ? value : endMinute;

				if (
					newEndTime < startTime ||
					(newEndTime === startTime && newEndMinute < startMinute)
				) {
					newTimeByDate[dateString].startTime = newEndTime;
					newTimeByDate[dateString].startMinute = newEndMinute;
				}
			}
			return newTimeByDate;
		});
	};

	const handleRepeatTimeChange = (e) => {
		setRepeatTime(parseInt(e.target.value, 10));
	};

	const handleRepeatNumChange = (e) => {
		const newValue = e.target.value;
		if (/^\d*$/.test(newValue)) {  // 숫자만 허용
			setRepeatNum(newValue);
		}
	};

	const startTimeOptions = Array.from({ length: 24 }, (_, i) => (
		<option key={i} value={i} disabled={i > endTime}>
			{i}
		</option>
	));
	const startMinuteOptions = Array.from({ length: 12 }, (_, i) => (
		<option
			key={i}
			value={i * 5}
			disabled={endTime == startTime ? i * 5 > endMinute : null}
		>
			{i * 5}
		</option>
	));
	const endTimeOptions = Array.from({ length: 24 }, (_, i) => (
		<option key={i} value={i} disabled={i < startTime}>
			{i}
		</option>
	));
	const endMinuteOptions = Array.from({ length: 12 }, (_, i) => (
		<option
			key={i}
			value={i * 5}
			disabled={endTime == startTime ? i * 5 < startMinute : null}
		>
			{i * 5}
		</option>
	));

	const formatTime = (hour) => {
		if (hour === 24) {
			return '23:59:59';
		} else {
			return `${hour.toString().padStart(2, '0')}:00:00`;
		}
	};

	const repeatTimeOptions = Array.from({ length: 5 }, (_, i) => (
		<option key={i} value={i + 1}>
			{i + 1}
		</option>
	));

	const handleDaySelect = () => {
		setDaySelect(!daySelect);
	};

	const handleEndDaySelect = () => {
		setEndDaySelect(!endDaySelect);
	};

	const handleRepeatDetailC = () => {
		setRepeatDetail('C');
		if (!endDaySelect) {
			handleEndDaySelect();
		}
	};

	// 추가
	const handleContentClick = (e) => {
		e.stopPropagation();
		if (daySelect) {
			handleDaySelect();
		}
		if (endDaySelect) {
			handleEndDaySelect();
		}
	};

	const handleCalendarClick = (e) => {
		e.stopPropagation();
	};

	const handleAmptNameChange = (e) => {
		setAmptName(e.target.value);
	};
	const handleClearAmptName = () => {
		setAmptName('');
	};
	const handlePlaceNameChange = (e) => {
		setPlaceName(e.target.value);
	};
	const handleClearPlaceName = () => {
		setPlaceName('');
	};
	const handleMemoChange = (e) => {
		setMemo(e.target.value);
	};
	const handleClearMemo = () => {
		setMemo('');
	};

	// 시작 시간이나 종료 시간이 변경될 때 호출되는 useEffect
	useEffect(() => {
		// 시작 시간과 종료 시간이 같고 시작 분이 종료 분보다 크면 시작 분을 종료 분으로 설정
		if (startTime === endTime && startMinute > endMinute) {
			setStartMinute(endMinute);
		}
	}, [startTime, endTime, startMinute, endMinute]);

	return (
		<div ref={ref}>
			<div className={styles.modalOverlay} onClick={onClose}>
				<div
					className={`${styles.modalContent}`}
					onClick={handleContentClick}
				>
					<div className={styles.modalContentScroll}>
						<h2>일정 추가하기</h2>

						{/* 색 고르기 */}
						<div className={styles.colorBody}>{renderColorSelection()}</div>

						<div className={styles.modalBody}>
						{/* 약속 이름 */}
						<div className={styles.contentArea}>
							<div className={styles.contentName}>
								{svgList.addSchModal.calenderIcon}
							</div>
							<div className={styles.contentInput}>
								<div className={`${styles.timeCollectInput}`}>
									<InputArea
										placeholder="일정 이름"
										value={amptName}
										onChange={handleAmptNameChange}
										onClear={handleClearAmptName}
									>
										{svgList.loginIcon.delBtn}
									</InputArea>
								</div>
							</div>
						</div>

						{/* 시간 선택 */}
						<div className={styles.contentArea}>
							<div className={styles.contentName}>
								{svgList.addSchModal.clockIcon}
							</div>
							<div className={styles.contentInput}>
								<div className={styles.selectDateArea}>
									<div className={styles.selectDateContent1}>날짜 선택</div>
									<div
										className={styles.selectDateContent2}
										onClick={handleDaySelect}
									>
										{
											<svg
												width="14"
												height="14"
												viewBox="0 0 14 14"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M6.2308 7.76913H0.333344V6.23071H6.2308V0.333252H7.76922V6.23071H13.6667V7.76913H7.76922V13.6666H6.2308V7.76913Z"
													fill="#8E66EE"
												/>
											</svg>
										}
									</div>
								</div>
								{daySelect ? (
									<div
										className={styles.calendar}
										onClick={handleCalendarClick}
									>
										<CalendarNewSch
											spaceX={4}
											spaceY={4}
											selectedDates={selectDate}
											onDateChange={handleDateChange}
										/>
									</div>
								) : null}

								{/* 선택된 날짜들 각각에 대한 컴포넌트 */}
								{Array.from(selectDate).map((date, index) => {
									const dateString = format(date, 'yyyy-MM-dd');
									const {
										startTime = 0,
										startMinute = 0,
										endTime = 23,
										endMinute = 55,
									} = timeByDate[dateString] || {};
									return (
										<div key={index} className={styles.oneDate}>
											<div className={styles.timeCollectInput}>
												<div className={styles.dateFont}>
													{format(date, 'yyyy년 MM월 dd일')}
												</div>
											</div>
											<div className={styles.timeCollectInput}>
												{/* 시간 선택 드롭다운 */}
												<div className={styles.timeSelectContainer}>
													{/* 부터 */}
													<select
														className={styles.timeSelect}
														value={startTime}
														onChange={(e) =>
															handleTimeChange(
																date,
																'startTime',
																parseInt(e.target.value, 10),
															)
														}
													>
														{startTimeOptions}
													</select>
													<span>시 </span>

													<select
														className={styles.timeSelect}
														value={startMinute}
														onChange={(e) =>
															handleTimeChange(
																date,
																'startMinute',
																parseInt(e.target.value, 10),
															)
														}
													>
														{startMinuteOptions}
													</select>
													<span>분 ~ </span>

													{/* 까지 */}
													<select
														className={styles.timeSelect}
														value={endTime}
														onChange={(e) =>
															handleTimeChange(
																date,
																'endTime',
																parseInt(e.target.value, 10),
															)
														}
													>
														{endTimeOptions}
													</select>
													<span>시 </span>
													<select
														className={styles.timeSelect}
														value={endMinute}
														onChange={(e) =>
															handleTimeChange(
																date,
																'endMinute',
																parseInt(e.target.value, 10),
															)
														}
													>
														{endMinuteOptions}
													</select>
													<span>분</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* 반복 */}
						<div className={styles.contentArea}>
							<div className={styles.contentName}>
								{svgList.addSchModal.retryIcon}
							</div>
							<div className={styles.contentInput}>
								<div
									className={styles.timeCollectInput}
									style={{ marginTop: '5px' }}
								>
									<button
										className={styles.selectBtn}
										onClick={() => setIsRepeat('F')}
									>
										{isRepeat === 'F' ? (
											<div>{svgList.newAmpt.btnSelected}</div>
										) : (
											<div>{svgList.newAmpt.btnNone}</div>
										)}
									</button>
									<div>반복 없음</div>
								</div>

								{isRepeat === 'T'  || selectDate.size <= 1 ?
								<div className={styles.timeCollectInput}>
									<button
										className={styles.selectBtn}
										onClick={() => setIsRepeat('T')}
									>
										{isRepeat === 'T' ? (
											<div>{svgList.newAmpt.btnSelected}</div>
										) : (
											<div>{svgList.newAmpt.btnNone}</div>
										)}
									</button>
									<div className={styles.timeSelectContainer}>
										<select
											className={styles.timeSelect}
											value={repeatTime}
											onChange={handleRepeatTimeChange}
										>
											{repeatTimeOptions}
										</select>
										<span>주마다 반복</span>
									</div>
								</div> : null }
								{isRepeat === 'T' ? (
									<div className={styles.repeatDetails}>
										<div className={styles.timeCollectInput}>
											<button
												className={styles.selectBtn}
												onClick={() => setRepeatDetail('A')}
											>
												{repeatDetail === 'A' ? (
													<div>{svgList.newAmpt.btnSelected}</div>
												) : (
													<div>{svgList.newAmpt.btnNone}</div>
												)}
											</button>
											<div>계속 반복</div>
										</div>
										<div className={styles.timeCollectInput}>
											<button
												className={styles.selectBtn}
												onClick={() => setRepeatDetail('B')}
											>
												{repeatDetail === 'B' ? (
													<div>{svgList.newAmpt.btnSelected}</div>
												) : (
													<div>{svgList.newAmpt.btnNone}</div>
												)}
											</button>
											<div className={styles.timeSelectContainer}>
												<input
													className={styles.repeatNum}
													value={repeatNum}
													onChange={handleRepeatNumChange}
												></input>
												<span>회 반복</span>
											</div>
										</div>
										<div className={styles.timeCollectInput}>
											<button
												className={styles.selectBtn}
												onClick={handleRepeatDetailC}
											>
												{repeatDetail === 'C' ? (
													<div>{svgList.newAmpt.btnSelected}</div>
												) : (
													<div>{svgList.newAmpt.btnNone}</div>
												)}
											</button>
											<div>종료일 선택</div>
										</div>
										{/* 종료일 달력에서 지정 */}
										{Array.isArray(selectEndDate) ? selectEndDate.map((date) => (
											<div className={styles.timeCollectInput}>
												<div className={styles.dateFont}>
													{format(date, 'yyyy년 MM월 dd일')}
												</div>
											</div>
										)) : (
											(repeatDetail === 'C') ?
											<div className={styles.timeCollectInput}>
												<div className={styles.dateFont}>
													{format(selectEndDate, 'yyyy년 MM월 dd일')}
												</div>
											</div> : null
										)}
										{(isRepeat === 'T') && (repeatDetail === 'C') && (endDaySelect) ? (
											<div
												className={styles.calendarEnd}
												onClick={handleCalendarClick}
											>
												<CalendarNewSch
													spaceX={4}
													spaceY={4}
													selectedDates={selectedDatesSet} // Set을 전달
													onDateChange={handleEndDateChange}
												/>
											</div>
										) : null}
									</div>
								) : null}
							</div>
						</div>

						{/* 장소 */}
						<div className={styles.contentArea}>
							<div className={styles.contentName}>
								{svgList.addSchModal.mapIcon}
							</div>
							<div className={styles.contentInput}>
								<div className={`${styles.timeCollectInput}`}>
									<InputArea
										value={placeName}
										placeholder={'장소'}
										onChange={handlePlaceNameChange}
										onClear={handleClearPlaceName}
									>
										{svgList.loginIcon.delBtn}
									</InputArea>
								</div>
							</div>
						</div>

						{/* 메모 */}
						<div className={styles.contentArea}>
							<div className={styles.contentName}>
								{svgList.addSchModal.memoIcon}
							</div>
							<div className={styles.contentInput}>
								<div className={`${styles.timeCollectInput}`}>
									<InputArea
										value={memo}
										placeholder={'메모'}
										onChange={handleMemoChange}
										onClear={handleClearMemo}
									>
										{svgList.loginIcon.delBtn}
									</InputArea>
								</div>
							</div>
						</div>

						<div className={styles.btnZone}>
							<SubmitBtn
								text="취소"
								onClick={onClose}
								isActive={true}
								className={`${styles.cancelBtn}`}
							/>
							<SubmitBtn
								text="완료"
								onClick={createSchedule}
								isActive={amptName && selectDate.size !== 0}
								className={`${styles.createBtn}`}
							/>
						</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.forwardRef(AddSchModal);