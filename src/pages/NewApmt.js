import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/NewAmpt.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import SubmitBtn from "../components/SubmitBtn";
import CalendarNewApmtDrag from "../components/CalendarNewApmtDrag";
import InputArea from '../components/InputArea';


const NewApmt = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const navigate = useNavigate();

  const [selectedElement1, setSelectedElement1] = useState('W'); // 요일 vs 날짜
  const [selectedElement2, setSelectedElement2] = useState('F'); // 날짜만 vs 시간
	const [selectedElement3, setSelectedElement3] = useState('T'); // 나만 vs 누구든

	const [startTime, setStartTime] = useState(0);
	const [endTime, setEndTime] = useState(24);
	const [selectedDate, setSelectedDate] = useState(new Set());

	const [amptName, setAmptName] = useState('약속');
	const [nickname, setNickname] = useState('');
	const [nicknamePlace, setNicknamePlace] = useState('');

	const getUserInfo = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/member/info`,
				{},
			);
			console.log(response.data);
			setNickname(response.data.name);
			setNicknamePlace(response.data.name);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	useEffect(() => {
		if (accessToken) getUserInfo();
	}, []);

	const createAmpt = async () => {
		if (amptName && !nickname === !accessToken) {
			try {
				const formattedStartTime = formatTime(startTime);
				const formattedEndTime = formatTime(endTime);
				const formattedDates = Array.from(selectedDate);
				console.log(formattedDates);

				// header
				const config = {
					headers: {
						Authorization: '@',
					},
				};
				if (accessToken) {
					const response = await axios.post(
						`${process.env.REACT_APP_API_URL}/promise/create`,
						{
							promise_name: amptName,
							weekvsdate: selectedElement1,
							ampmvstime: selectedElement2,
							start_time: formattedStartTime,
							end_time: formattedEndTime,
							date: formattedDates,
							canallconfirm: selectedElement3,
							nickname: nickname,
						},
					);
					console.log(response.data);

					// 새로운 링크로 리디렉션
					const promiseCode = response.data.promiseCode;
					// console.log(promiseCode);
					navigate(`/:user/ApmtDetail/:${promiseCode}`, {
						state: { promiseCode: promiseCode },
					}); // 링크 맞나 확인 필요
				} else {
					const response = await axios.post(
						`${process.env.REACT_APP_API_URL}/promise/create`,
						{
							promise_name: amptName,
							weekvsdate: selectedElement1,
							ampmvstime: selectedElement2,
							start_time: formattedStartTime,
							end_time: formattedEndTime,
							date: formattedDates,
							canallconfirm: selectedElement3,
						},
						config,
					); // config 객체를 요청과 함께 전달
					console.log(response.data);

					// 새로운 링크로 리디렉션
					const promiseCode = response.data.promiseCode;
					navigate(`/ApmtDetail/:${promiseCode}`, {
						state: { promiseCode: promiseCode },
					}); // 링크 맞나 확인 필요
				}
			} catch (error) {
				const errorResponse = error.response;
				console.log(errorResponse.data.statusCode);
			}
		}
	};

	const handleStartTimeChange = (e) => {
		setStartTime(parseInt(e.target.value, 10));
	};
	const handleEndTimeChange = (e) => {
		setEndTime(parseInt(e.target.value, 10));
	};

	// 시간 옵션 제한
	const startTimeOptions = Array.from({ length: 25 }, (_, i) => (
		<option key={i} value={i} disabled={i >= endTime}>
			{i}
		</option>
	));
	const endTimeOptions = Array.from({ length: 25 }, (_, i) => (
		<option key={i} value={i} disabled={i <= startTime}>
			{i}
		</option>
	));

	const formatTime = (hour) => {
		if (hour === 24) {
			return '23:59:59';
		} else {
			return `${hour.toString().padStart(2, '0')}:00:00`;
		}
	};

	const handleAmptNameChange = (e) => {
		setAmptName(e.target.value);
	};
	const handleClearAmptName = () => {
		setAmptName('');
	};
	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
	};
	const handleClearNickname = () => {
		setNickname('');
	};

	// selectedElement1 값이 변경될 때 selectDate를 초기화
	useEffect(() => {
		if (selectedElement1 === 'W') {
			setSelectedDate(new Set());
		}
	}, [selectedElement1]);

	return (
		<div className={styles.entire}>
			<Helmet>
				<title>Meetable | 미터블</title>
				<meta
				name="description"
				content="Meetable(미터블)은 여러 사람들의 만남이 쉽게 이루어지도록 약속 조정 서비스를 제공하는 플랫폼입니다. 미터블을 이용하여 언제 어디서든 쉽게 약속을 잡고 일정을 관리해 보세요!"
				/>
				<meta name="keywords" content="meetable, 미터블, 미팅 플랫폼, 약속 잡기, 일정 조율, 한국" />
			</Helmet>
			<div className={`${styles.loginBox}`}>
				<div className={styles.loginLogo}>
					<p>
						<b>새 약속 잡기</b>
					</p>
				</div>

				<div className={styles.content}>
					{/* 약속 이름 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}>
							<p>약속 이름</p>
						</div>
						<div className={styles.contentInput}>
							<div
								className={`${styles.timeCollectInput} ${styles.inputPadding}`}
							>
								<InputArea
									placeholder="약속"
									value={amptName}
									onChange={handleAmptNameChange}
									onClear={handleClearAmptName}
								>
									{svgList.loginIcon.delBtn}
								</InputArea>
							</div>
						</div>
					</div>

					{/* 약속 유형 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}>
							<p>약속 유형</p>
						</div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								<button
									className={styles.selectBtn}
									onClick={() => setSelectedElement1('W')}
								>
									{selectedElement1 === 'W' ? (
										<div>{svgList.newAmpt.btnSelected}</div>
									) : (
										<div>{svgList.newAmpt.btnNone}</div>
									)}
								</button>
								<div>요일 기준</div>
							</div>

							<div className={styles.timeCollectInput}>
								<button
									className={styles.selectBtn}
									onClick={() => setSelectedElement1('D')}
								>
									{selectedElement1 === 'D' ? (
										<div>{svgList.newAmpt.btnSelected}</div>
									) : (
										<div>{svgList.newAmpt.btnNone}</div>
									)}
								</button>
								<div>날짜 기준</div>
							</div>
							{selectedElement1 === 'D' ? (
								<div className={styles.calendar}>
									<CalendarNewApmtDrag
										spaceX={4}
										spaceY={4}
										// onDateChange={handleDateChange}
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
									/>
								</div>
							) : null}
						</div>
					</div>

					{/* 시간 선택 */}
					{/* <div className={styles.contentArea}>
						<div className={styles.contentName}>
							<p>시간 선택</p>
						</div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								<button
									className={styles.selectBtn}
									onClick={() => setSelectedElement2('F')}
								>
									{selectedElement2 === 'F' ? (
										<div>{svgList.newAmpt.btnSelected}</div>
									) : (
										<div>{svgList.newAmpt.btnNone}</div>
									)}
								</button>
								<div>날짜만 정하기</div>
							</div>

							<div className={styles.timeCollectInput}>
								<button
									className={styles.selectBtn}
									onClick={() => setSelectedElement2('T')}
								>
									{selectedElement2 === 'T' ? (
										<div>{svgList.newAmpt.btnSelected}</div>
									) : (
										<div>{svgList.newAmpt.btnNone}</div>
									)}
								</button>
								<div className={styles.timeSelectContainer}>
									<select
										className={styles.timeSelect}
										value={startTime}
										onChange={handleStartTimeChange}
									>
										{startTimeOptions}
									</select>
									<span>시부터 </span>
									<select
										className={styles.timeSelect}
										value={endTime}
										onChange={handleEndTimeChange}
									>
										{endTimeOptions}
									</select>
									<span>시까지</span>
								</div>
							</div>
						</div>
					</div> */}

					{/* 확정하기 권한 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}>
							<p>확정하기 권한</p>
						</div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								<button
									className={styles.selectBtn}
									onClick={() => setSelectedElement3('T')}
								>
									{selectedElement3 === 'T' ? (
										<div>{svgList.newAmpt.btnSelected}</div>
									) : (
										<div>{svgList.newAmpt.btnNone}</div>
									)}
								</button>
								<div>약속에 참여하는 누구나</div>
							</div>

							{accessToken ? (
								<div className={styles.timeCollectInput}>
									<button
										className={styles.selectBtn}
										onClick={() => setSelectedElement3('F')}
									>
										{selectedElement3 === 'F' ? (
											<div>{svgList.newAmpt.btnSelected}</div>
										) : (
											<div>{svgList.newAmpt.btnNone}</div>
										)}
									</button>
									<div>나만</div>
								</div>
							) : null}
						</div>
					</div>

					{/* 멤버 - 내 별명 */}
					{accessToken ? (
						<div className={styles.contentArea}>
							<div className={styles.contentName}>
								<p>내 별명</p>
							</div>
							<div className={styles.contentInput}>
								<div
									className={`${styles.timeCollectInput} ${styles.inputPadding}`}
								>
									<InputArea
										tArea
										placeholder={nicknamePlace}
										value={nickname}
										onChange={handleNicknameChange}
										onClear={handleClearNickname}
									>
										{svgList.loginIcon.delBtn}
									</InputArea>
								</div>
							</div>
						</div>
					) : null}

					<SubmitBtn
						text="만들기"
						onClick={createAmpt}
						isActive={
							amptName && 
							!nickname === !accessToken && 
							(selectedElement1 === 'D' ? selectedDate.size > 0 : true)
						  }						  
						className={`${styles.createBtn} ${styles.btnLength}`}
					/>
				</div>
			</div>
			<div className={styles.mobileSignUp}>
				<div
					onClick={() => {
						window.location.href = `/:user/apmtdetail/:`;
					}}
				>
					로그인
				</div>
				<div id={styles.bar}>|</div>
				<div
					onClick={() => {
						window.location.href = '/emailauth';
					}}
				>
					가입하기
				</div>
			</div>
		</div>
	);
};

export default NewApmt;