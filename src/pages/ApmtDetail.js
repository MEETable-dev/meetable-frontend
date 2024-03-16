import styles from '../css/ApmtDetail.module.css';
import { useState, useEffect } from 'react';
import CalendarWeekWithTime from 'components/CalendarWeekWithTime';
import CalendarWeekWithoutTime from 'components/CalendarWeekWithoutTime';
import CalendarMonthWithTime from 'components/CalendarMonthWithTime';
import CalendarMonthWithoutTime from 'components/CalendarMonthWithoutTime';
import ColorBar from '../components/ColorBar';
import Filter from '../components/Filter';
import TimeNO from '../components/TimeNO';
import TimeYES from '../components/TimeYES';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { svgList } from 'assets/svg';
import { AiOutlineEdit } from 'react-icons/ai';
import ApmtShareModal from 'components/ApmtShareModal';

const ApmtDetail = () => {
	const accessToken = useSelector((state) => state.user.accessToken);

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [selectWeek, setSelectWeek] = useState(new Date());

	const [time, setTime] = useState(true);
	const [week, setWeek] = useState(false);

	const [promiseId, setPromiseId] = useState('');
	const [promiseName, setPromiseName] = useState('');
	const [promiseTotal, setPromiseTotal] = useState(0);
	const [promisePartis, setPromisePartis] = useState([]);

	const [filterSelectionNum, setFilterSelectionNum] = useState(1);
	const [filterSelectionTime, setFilterSelectionTime] = useState(0.5);
	const [filterSelectionParti, setFilterSelectionParti] = useState([]);

	const [shareModal, setShareModal] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		setPromiseId(
			window.location.href.split('/ApmtDetail/')[1].replace(':', ''),
		);
		console.log(promiseId);
		getApmtInfo();
		getParticipantsInfo();
	}, [promiseId]);

	const getApmtInfo = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/baseinfo/${
					promiseId.split('_')[0]
				}`,
				!accessToken && { headers: { Authorization: '@' } },
			);
			console.log(response.data);
			if (response.data.weekvsdate == 'W') setWeek(true);
			else setWeek(false);
			if (response.data.ampmvstime == 'F') setTime(false);
			else setTime(true);
			setPromiseName(response.data.promise_name);
			if (response.data.total <= 1) setShareModal(true);
			setPromiseTotal(response.data.total);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const getParticipantsInfo = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/participants/${
					promiseId.split('_')[0]
				}`,
				!accessToken && { headers: { Authorization: '@' } },
			);
			console.log(response.data);
			setPromisePartis([]);
			response.data.map((item, index) => {
				setPromisePartis((prev) => [...prev, item.name]);
			});
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const handleCopyClipBoard = (text) => {
		try {
			navigator.clipboard.writeText(text);
			alert('클립보드에 복사되었습니다.');
		} catch (error) {
			alert('클립보드 복사에 실패하였습니다.');
		}
	};

	return (
		<div style={{ height: 'auto' }}>
			{/* 약속 세부 */}
			{!(!week && time) && (
				<div
					className={styles.apmtHeader}
					style={
						windowWidth < 580
							? { width: '300px' }
							: windowWidth >= 580 && windowWidth <= 1200
							? { width: '48vw' }
							: { width: '580px' }
					}
				>
					<div className={styles.header} style={{ paddingLeft: '1vw' }}>
						<div
							className={styles.apmtName}
							style={
								// windowWidth < 580
								// 	? { fontSize: 18 }
								// 	: windowWidth >= 580 && windowWidth <= 1200
								// 	? { fontSize: 20 }
								// 	: { fontSize: 22 },
								{
									maxWidth:
										windowWidth < 580
											? 80
											: windowWidth >= 580 && windowWidth <= 1200
											? 150
											: 190,
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
								}
							}
						>
							{/* {promiseName} */}
							가나닥라마알마ㅓ이ㅏ러만얼머ㅏ
						</div>
						<div
							className={styles.share}
							style={{ paddingTop: 5 }}
							onClick={() => setShareModal(true)}
						>
							{svgList.apmtDetail.shareIcon}
						</div>
					</div>
					<div className={styles.header}>
						<div className={`${styles.headerBtn} ${styles.white}`}>
							{windowWidth < 580
								? '빠지기'
								: windowWidth >= 580 && windowWidth <= 620
								? '빠지기'
								: '약속에서 빠지기'}
						</div>
						<div className={`${styles.headerBtn} ${styles.purple}`}>
							{windowWidth < 700 ? '확정' : '확정하기'}
						</div>
						<div
							className={`${styles.headerBtn} ${styles.purple}`}
							style={{ padding: 5, marginRight: 0 }}
						>
							<AiOutlineEdit size={20} color="#ffffff" />
						</div>
					</div>
				</div>
			)}
			<div style={{ display: 'table' }}>
				<div className={styles.calendar}>
					{!week && time && (
						<div className={styles.apmtHeader}>
							<div className={styles.apmtName}>{promiseName}</div>
							<div className={styles.share} onClick={() => setShareModal(true)}>
								{svgList.apmtDetail.shareIcon}
							</div>
						</div>
					)}
					{!week && time && (
						<CalendarMonthWithTime
							selectWeek={selectWeek}
							setSelectWeek={setSelectWeek}
						/>
					)}
					{/* {!week && time && <div>달력에서 주 선택</div>} */}
				</div>
				<div
					className={styles.empty}
					style={windowWidth > 1200 ? { padding: '0.5vw' } : { padding: 0 }}
				></div>
				<div
					className={styles.calendar}
					style={
						windowWidth > 1200
							? { justifyContent: 'center' }
							: {
									justifyContent: 'center',
									marginLeft: '20px',
									marginRight: '20px',
							  }
					}
				>
					{time && (
						<CalendarWeekWithTime
							selectWeek={selectWeek}
							setSelectWeek={setSelectWeek}
						/>
					)}
					{/* {time && <div>주에서 시간 선택</div>} */}
					{week && !time && (
						<CalendarWeekWithoutTime
							selectWeek={selectWeek}
							setSelectWeek={setSelectWeek}
						/>
					)}
					{/* {week && !time && <div>주에서 날짜 선택</div>} */}
					{!week && !time && (
						<CalendarMonthWithoutTime
							selectWeek={selectWeek}
							setSelectWeek={setSelectWeek}
						/>
					)}
					{/* {!week && !time && <div>달력에서 날짜 선택</div>} */}
				</div>
				<div className={styles.empty} style={{ padding: '0.3vw' }}></div>
				<div className={styles.participants}>
					<div className={styles.partiContainer}>
						<div className={styles.partiHead}>참가자</div>
						<div className={styles.partiBody}>
							{promisePartis.map((item, index) => (
								<div key={index} className={styles.partiList}>
									{item}
								</div>
							))}
							{/* <div className={styles.partiList}>선우정아이어요</div>
							<div className={styles.partiList}>가나다</div> */}
						</div>
					</div>
				</div>
			</div>
			{accessToken && (
				<Filter
					total={promiseTotal}
					options={promisePartis}
					selectionNum={filterSelectionNum}
					onSelectNum={(option) => {
						setFilterSelectionNum(option);
					}}
					selectionParti={filterSelectionParti}
					onSelectParti={(option) => {
						if (filterSelectionParti.includes(option)) {
							setFilterSelectionParti((prev) =>
								[...prev].filter((element) => element != option),
							);
						} else {
							setFilterSelectionParti((prev) => [...prev, option]);
						}
					}}
				/>
			)}
			<ColorBar total={promiseTotal} />
			{shareModal && (
				<ApmtShareModal title={''} onClose={() => setShareModal(false)}>
					<div className={styles.modalHeader}>
						친구에게 약속 링크를 공유하여
						<br />
						함께 시간을 조율해 보세요.
					</div>
					<div className={styles.modalMiddleHeader}>
						약속 링크
						<div
							className={styles.modalTxt}
							onClick={() =>
								handleCopyClipBoard(
									`https://www.meetable.com/ApmtDetail/:${promiseId}`,
								)
							}
						>
							https://www.meetable.com/ApmtDetail/:{promiseId}
							{svgList.apmtDetail.copyIcon}
						</div>
					</div>
					<div className={styles.modalMiddleHeader}>
						약속 코드
						<div
							className={styles.modalTxt}
							onClick={() => handleCopyClipBoard(promiseId)}
							style={{ maxWidth: 120 }}
						>
							{promiseId}
							{svgList.apmtDetail.copyIcon}
						</div>
					</div>
				</ApmtShareModal>
			)}
		</div>
	);
};

export default ApmtDetail;