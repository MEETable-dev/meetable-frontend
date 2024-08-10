import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/HomeSchDetail.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

import SubmitBtn from "../components/SubmitBtn";
import CalendarNewApmt from "../components/CalendarNewApmt";
import InputArea from '../components/InputArea';

const HomeSchDetail = ({ onClose, changePW }, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);
    const navigate = useNavigate();
  
    const [isRepeat, setIsRepeat] = useState('N'); // 요일 vs 날짜
    const [repeatDetail, setRepeatDetail] = useState('A');
	const [daySelect, setDaySelect] = useState(false); // 달력 나와있는지 아닌지
	const [endDaySelect, setEndDaySelect] = useState(false); // 종료날짜 달력 나와있는지 아닌지
	const [selectedColor, setSelectedColor] = useState('red');

	const [selectDate, setSelectDate] = useState(new Set());
	const [selectEndDate, setSelectEndDate] = useState(new Date());
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

	const createSchedule = async () => {
		try {
			const formattedStartTime = formatTime(startTime);
			const formattedEndTime = formatTime(endTime);
			const formattedDates = Array.from(selectDate).map((date) =>
				format(date, 'yyyy-MM-dd'),
			);
			console.log(formattedDates);

			// header
			const config = {
				headers: {
					Authorization: '@',
				},
			};
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/promise/create`,
				{
					promise_name: amptName,
					weekvsdate: isRepeat,
					start_time: formattedStartTime,
					end_time: formattedEndTime,
					date: formattedDates,
				},
				config,
			); // config 객체를 요청과 함께 전달
			console.log(response.data);

			// 새로운 링크로 리디렉션
			const promiseCode = response.data.promiseCode;
			navigate(`/ApmtDetail/:${promiseCode}`, {
				state: { promiseCode: promiseCode },
			}); // 링크 맞나 확인 필요
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
			<div>
				<div
					className={`${styles.modalContent}`}
					onClick={handleContentClick}
				>
					<h2>일정 추가하기</h2>

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

					</div>
				</div>
			</div>
		</div>
	);
};

export default React.forwardRef(HomeSchDetail);