import styles from '../css/ApmtDetail.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { svgList } from 'assets/svg';
import CalendarWeekWithTime from 'components/CalendarWeekWithTime';
import CalendarWeekWithoutTime from 'components/CalendarWeekWithoutTime';
import CalendarMonthWithTime from 'components/CalendarMonthWithTime';
import CalendarMonthWithoutTime from 'components/CalendarMonthWithoutTime';
import ColorBar from '../components/ColorBar';
import Filter from '../components/Filter';
import { AiOutlineEdit } from 'react-icons/ai';
import ApmtShareModal from 'components/ApmtShareModal';
import OnlyShowModal from 'components/OnlyShowModal';

const ApmtDetail = () => {
	const navigate = useNavigate();

	const accessToken = useSelector((state) => state.user.accessToken);
	const [nonmemberId, setNonmemberId] = useState(-1);
	const [nonmemberNickname, setNonmemberNickname] = useState('');
	const [nonmemberPw, setNonmemberPw] = useState('');

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [selectWeek, setSelectWeek] = useState(new Date());

	const [time, setTime] = useState(true);
	const [week, setWeek] = useState(false);

	const [promiseId, setPromiseId] = useState('');
	const [promiseCode, setPromiseCode] = useState('');
	const [promiseName, setPromiseName] = useState('');
	const [promiseTotal, setPromiseTotal] = useState(0); // 참여중인 인원 수
	const [promisePartis, setPromisePartis] = useState([]); // 참여중인 사람 목록

	const [editing, setEditing] = useState(false); // 편집 버전
	const [selectedInfo, setSelectedInfo] = useState({});
	const [canParti, setCanParti] = useState([]); // 올 수 있다고 표기한 사람 목록

	const [filterSelectionNum, setFilterSelectionNum] = useState(1); // 최소 인원 필터 선택값
	// const [filterSelectionTime, setFilterSelectionTime] = useState(0.5); // 최소 시간 필터 선택값
	const [filterSelectionParti, setFilterSelectionParti] = useState([]); // 필수참여자 필터 선택값

	const [imIn, setImIn] = useState(false); // 내가 이 약속에 참여중인지 아닌지
	const [myName, setMyName] = useState(''); // 내 이름
	const [canConfirm, setCanConfirm] = useState(false); // 확정 권한

	const [partiModal, setPartiModal] = useState('no'); // 참여하기 모달 (no:안보임/show:참여하기/link:비회원으로 참여한 약속 불러오기)
	const [addDescription, setAddDescription] = useState('out'); // 추가설명 여부 (hover:떼면 안보임/click:다시 클릭해야 안보임/out:안보임)
	const [shareModal, setShareModal] = useState(false); // 공유모달 여부
	const [copyModal, setCopyModal] = useState(false); // 복사 완료 모달 여부
	const [wrongAddressModal, setWrongAddressModal] = useState(false); // 없는 주소 모달 여부

	const [confirmModal, setConfirmModal] = useState(false); // 확정 모달 여부
	const [showConfirmModal, setShowConfirmModal] = useState('no'); // 확정완료된 일정 모달 보여주기 여부 (no/hover/show)
	const [modalPosition, setModalPosition] = useState([]);
	const [cancelConfirmModal, setCancelConfirmModal] = useState(false); // 확정 취소 모달 여부

	const [confirmed, setConfirmed] = useState(new Set()); // 저장되어 있는 확정 날짜들
	const [confirming, setConfirming] = useState(false); // 확정 일정 선택 중인지 아닌지
	const [confirmSelected, setConfirmSelected] = useState(new Set()); // 저장 전 변동된 확정 목록
	const [place, setPlace] = useState(''); // 장소
	const [notion, setNotion] = useState(''); // 공지

	const [selectConfirmDate, setSelectConfirmDate] = useState([]);

	const [reset, setReset] = useState(true);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		const handleClick = (e) => {
			setShowConfirmModal('no');
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('click', handleClick);
		window.addEventListener('contextmenu', handleClick);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('click', handleClick);
			window.removeEventListener('contextmenu', handleClick);
		};
	}, []);

	useEffect(() => {
		setPromiseId(window.location.href.split('tail/')[1].replace(':', ''));
		console.log(promiseId);
		if (window.location.href.split('tail/')[1].replace(':', '')) {
			getApmtInfo();
			getParticipantsInfo();
			if (accessToken) {
				getMyParti();
				getMyName();
			}
		} else {
			setWrongAddressModal(true);
		}
	}, [promiseId]);

	useEffect(() => {
		getApmtInfoReset();
	}, [reset]);

	// useEffect(() => {
	// 	const getConfirm = async () => {
	// 		try {
	// 			const response = await axios.get(
	// 				`${process.env.REACT_APP_API_URL}/confirm/confirminfo/${
	// 					promiseId.split('_')[0]
	// 				}`,
	// 				!accessToken && { headers: { Authorization: '@' } },
	// 			);
	// 			console.log('confirminfo: ', response.data);
	// 			if (week) {
	// 				setConfirmed(new Set(response.data.weekConfirmed));
	// 				setConfirmSelected(new Set(response.data.weekConfirmed));
	// 			} else {
	// 				setConfirmed(new Set(response.data.dateConfirmed));
	// 				setConfirmSelected(new Set(response.data.dateConfirmed));
	// 			}
	// 			setPlace(response.data.place);
	// 			setNotion(response.data.notice);
	// 		} catch (error) {
	// 			const errorResponse = error.response;
	// 			console.log(errorResponse.data.statusCode);
	// 		}
	// 	};
	// 	// 저장된 확정 목록 가져오기
	// 	// confirmed와 confirmSelected 에 저장
	// 	console.log('확정된 약속 가져오기');
	// 	getConfirm();
	// }, [reset]);

	const getConfirmed = async (week) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/confirm/confirminfo/${
					promiseId.split('_')[0]
				}`,
				!accessToken && { headers: { Authorization: '@' } },
			);
			if (week) {
				setConfirmed(new Set(response.data.weekConfirmed));
				setConfirmSelected(new Set(response.data.weekConfirmed));
			} else {
				setConfirmed(new Set(response.data.dateConfirmed));
				setConfirmSelected(new Set(response.data.dateConfirmed));
			}
			setPlace(response.data.place);
			setNotion(response.data.notice);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
			if (errorResponse.data.statusCode === 4044) {
				setConfirmed(new Set());
				setConfirmSelected(new Set());
				setPlace('');
				setNotion('');
			}
		}
	};

	const confirm = async () => {
		try {
			if (week) {
				// let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
				// let confirmList = [];
				// confirmSelected.forEach((item) => {
				// 	confirmList.push(days[getDay(new Date(item))]);
				// });
				// console.log('confirmList: ', confirmList);

				if (time) {
					console.log('요일시간확정');
				} else {
					if (confirmed.size === 0) {
						const response = await axios.post(
							`${process.env.REACT_APP_API_URL}/confirm/add`,
							{
								promiseId: promiseId.split('_')[0],
								place: place,
								notice: notion,
								weekAvailable: [...confirmSelected],
							},
							!accessToken && { headers: { Authorization: '@' } },
						);
						console.log(response.data);
						setConfirmed(new Set(response.data.weekConfirmed));
						setConfirming(false);
					} else {
						console.log('update', confirmSelected, confirmed);
						const response = await axios.patch(
							`${process.env.REACT_APP_API_URL}/confirm/update`,
							{
								promiseId: promiseId.split('_')[0],
								place: place,
								notice: notion,
								weekAvailable: [...confirmSelected],
							},
							!accessToken && { headers: { Authorization: '@' } },
						);
						console.log('updated', response.data);
						setConfirmed(new Set(response.data.weekConfirmed));
						setConfirming(false);
					}
				}
			} else {
				if (time) {
					console.log('날짜시간확정');
				} else {
					if (confirmed.size === 0) {
						const response = await axios.post(
							`${process.env.REACT_APP_API_URL}/confirm/add`,
							{
								promiseId: promiseId.split('_')[0],
								place: place,
								notice: notion,
								dateAvailable: [...confirmSelected],
							},
							!accessToken && { headers: { Authorization: '@' } },
						);
						console.log('확정하기 후 반응: ', response.data);
						setConfirmed(new Set([...confirmSelected]));
						setConfirming(false);
					} else {
						const response = await axios.patch(
							`${process.env.REACT_APP_API_URL}/confirm/update`,
							{
								promiseId: promiseId.split('_')[0],
								place: place,
								notice: notion,
								dateAvailable: [...confirmSelected],
							},
							!accessToken && { headers: { Authorization: '@' } },
						);
						console.log('updated ', response.data);
						setConfirmed(new Set([...confirmSelected]));
						setConfirming(false);
					}
				}
			}
			setReset(!reset);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const getMyName = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/username`,
			);
			console.log(response.data);
			setMyName(response.data.name);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const getMyParti = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/isparticipate/${
					promiseId.split('_')[0]
				}`,
			);
			console.log(response.data);
			setImIn(response.data.isParticipating);
			if (response.data.canconfirm === 'T') setCanConfirm(true);
			else setCanConfirm(false);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const getApmtInfo = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/baseinfo/${
					promiseId.split('_')[0]
				}`,
				!accessToken && { headers: { Authorization: '@' } },
			);
			console.log(response.data);
			setPromiseCode(response.data.promise_code);
			if (
				response.data.promise_code.toLowerCase() ===
				promiseId.split('_')[promiseId.split('_').length - 1].toLowerCase()
			) {
				if (response.data.weekvsdate === 'W') setWeek(true);
				else setWeek(false);
				if (response.data.ampmvstime === 'F') setTime(false);
				else setTime(true);
				setPromiseName(response.data.promise_name);
				if (response.data.total <= 1) setShareModal(true);
				setPromiseTotal(response.data.total);
				setSelectedInfo(response.data.count);

				getConfirmed(response.data.weekvsdate === 'W');
			} else {
				// navigate(`/`, {});
				setWrongAddressModal(true);
			}
			//
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const getApmtInfoReset = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/baseinfo/${
					promiseId.split('_')[0]
				}`,
				!accessToken && { headers: { Authorization: '@' } },
			);
			console.log(response.data);
			setPromiseCode(response.data.promise_code);
			if (
				response.data.promise_code.toLowerCase() ===
				promiseId.split('_')[promiseId.split('_').length - 1].toLowerCase()
			) {
				if (response.data.weekvsdate === 'W') setWeek(true);
				else setWeek(false);
				if (response.data.ampmvstime === 'F') setTime(false);
				else setTime(true);
				setPromiseName(response.data.promise_name);
				setPromiseTotal(response.data.total);
				setSelectedInfo(response.data.count);
			} else {
				// navigate(`/`, {});
				setWrongAddressModal(true);
			}

			getConfirmed(response.data.weekvsdate === 'W');
			//
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

	const participate = async () => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/promise/participate`,
				{
					promiseId: promiseId.split('_')[0],
					nickname: nonmemberNickname,
					password: nonmemberPw,
				},
				!accessToken && { headers: { Authorization: '@' } },
			);
			console.log('parti', response.data);
			if (response.data.nonmemberId) {
				setNonmemberId(response.data.nonmemberId);
			}
			if (response.data.canconfirm === 'T') setCanConfirm(true);
			else setCanConfirm(false);
			setPartiModal('no');
			setReset(!reset);
			getParticipantsInfo();
			getMyParti();
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	const handleCopyClipBoard = (text) => {
		try {
			navigator.clipboard.writeText(text);
			// alert('클립보드에 복사되었습니다.');
			setCopyModal(true);
		} catch (error) {
			// alert('클립보드 복사에 실패하였습니다.');
		}
	};

	const sortDaysOfWeek = (days) => {
		if (week) {
			const dayOrder = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

			// 요일 이름을 순서대로 정렬
			return days.sort((a, b) => {
				return dayOrder.indexOf(a) - dayOrder.indexOf(b);
			});
		} else {
			return days.sort();
		}
	};

	const cancelConfirm = async () => {
		try {
			if (accessToken) {
				const response = await axios.delete(
					`${process.env.REACT_APP_API_URL}/confirm/cancel`,
					{
						data: {
							promiseid: promiseId.split('_')[0],
						},
					},
				);

				console.log('deleete', response.data);
			} else {
				const response = await axios.delete(
					`${process.env.REACT_APP_API_URL}/confirm/cancel`,
					{
						data: {
							promiseid: promiseId.split('_')[0],
						},

						headers: { Authorization: '@' },
					},
				);
				console.log(response.data);
			}

			setCancelConfirmModal(false);
			setConfirmModal(false);
			setShowConfirmModal('no');
			getApmtInfoReset();
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data.statusCode);
		}
	};

	return (
		<div style={{ height: 'auto' }}>
			{confirming && (
				<div className={styles.confirmDiv}>
					<div className={styles.desDiv}>확정할 날짜를 모두 선택해 주세요.</div>
					<div
						className={styles.confirmBtn}
						style={{
							backgroundColor: '#FFFFFF',
							color: '#8E66EE',
							border: '1px solid #8E66EE',
						}}
						onClick={() => {
							setConfirmSelected(new Set(confirmed));
							setConfirming(false);
						}}
					>
						닫기
					</div>
					{confirmSelected
						.difference(confirmed)
						.union(confirmed.difference(confirmSelected)).size !== 0 && (
						<div style={{ width: 10 }}></div>
					)}
					{confirmSelected
						.difference(confirmed)
						.union(confirmed.difference(confirmSelected)).size !== 0 && (
						<div
							className={styles.confirmBtn}
							onClick={() => {
								if (confirmSelected.size === 0) {
									// 확정 취소
									setCancelConfirmModal(true);
								} else {
									setConfirmModal(true);
								}
								setConfirming(false);
							}}
						>
							선택 완료
						</div>
					)}
				</div>
			)}
			{!(!week && time) && (
				<div
					className={styles.apmtHeader}
					style={
						windowWidth < 580
							? { width: '300px' }
							: windowWidth >= 580 && windowWidth <= 1200
							? { width: '48vw' }
							: { width: '584px' }
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
							{promiseName}
							{/* 가나닥라마알마ㅓ이ㅏ러만얼머ㅏ */}
						</div>
						<div
							className={styles.share}
							style={{ paddingTop: 5 }}
							onClick={() => setShareModal(true)}
						>
							{svgList.apmtDetail.shareIcon}
						</div>
					</div>
					{((accessToken && imIn) || nonmemberId !== -1) && !confirming ? (
						<div className={styles.header}>
							<div className={`${styles.headerBtn} ${styles.white}`}>
								{windowWidth < 580
									? '빠지기'
									: windowWidth >= 580 && windowWidth <= 620
									? '빠지기'
									: '약속에서 빠지기'}
							</div>
							{!editing && canConfirm && (
								<div
									className={`${styles.headerBtn} ${styles.purple}`}
									onClick={() => {
										setConfirming(true);
										console.log(confirmed);
									}}
								>
									{windowWidth < 700 ? '확정' : '확정하기'}
								</div>
							)}
							<div
								className={`${styles.headerBtn} ${styles.purple}`}
								style={{
									padding: 5,
									marginRight: 0,
									backgroundColor: editing ? '#ffffff' : '#8E66EE',
								}}
								onClick={() => setEditing(!editing)}
							>
								<AiOutlineEdit
									size={20}
									color={editing ? '#8E66EE' : '#ffffff'}
								/>
							</div>
						</div>
					) : (
						!confirming && (
							<div className={styles.header}>
								<div
									className={`${styles.headerBtn} ${styles.purple}`}
									onClick={() => setPartiModal('show')}
								>
									참여하기
								</div>
							</div>
						)
					)}
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
							promiseId={promiseId}
							promiseTotal={promiseTotal}
							selectWeek={selectWeek}
							// setSelectWeek={setSelectWeek}
							editing={editing}
							selectedInfo={selectedInfo}
							canParti={canParti}
							setCanParti={setCanParti}
							reset={reset}
							setReset={setReset}
							nonmemberId={nonmemberId}
							confirming={confirming}
							confirmSelected={confirmSelected}
							setConfirmSelected={setConfirmSelected}
							confirmed={confirmed}
							showConfirmModal={showConfirmModal}
							setShowConfirmModal={setShowConfirmModal}
							setModalPosition={setModalPosition}
						/>
					)}
					{/* {week && !time && <div>주에서 날짜 선택</div>} */}
					{!week && !time && (
						<CalendarMonthWithoutTime
							promiseId={promiseId}
							promiseTotal={promiseTotal}
							selectWeek={selectWeek}
							setSelectWeek={setSelectWeek}
							editing={editing}
							selectedInfo={selectedInfo}
							canParti={canParti}
							setCanParti={setCanParti}
							reset={reset}
							setReset={setReset}
							nonmemberId={nonmemberId}
							confirming={confirming}
							confirmSelected={confirmSelected}
							setConfirmSelected={setConfirmSelected}
							confirmed={confirmed}
							showConfirmModal={showConfirmModal}
							setShowConfirmModal={setShowConfirmModal}
							setModalPosition={setModalPosition}
						/>
					)}
					{/* {!week && !time && <div>달력에서 날짜 선택</div>} */}
				</div>
				<div className={styles.empty} style={{ padding: '0.3vw' }}></div>
				<div className={styles.participants}>
					<div className={styles.partiContainer}>
						<div
							className={styles.partiHead}
							style={editing ? { color: '#888888' } : {}}
						>
							참가자
						</div>
						<div className={styles.partiBody}>
							{editing
								? [].map((item, index) => (
										<div
											key={index}
											className={styles.partiList}
											style={editing ? { color: '#888888' } : {}}
										>
											{item}
										</div>
								  ))
								: canParti.map((item, index) => (
										<div
											key={index}
											className={styles.partiList}
											style={editing ? { color: '#888888' } : {}}
										>
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
								[...prev].filter((element) => element !== option),
							);
						} else {
							setFilterSelectionParti((prev) => [...prev, option]);
						}
					}}
					disabled={editing}
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
									`https://www.meetable.com/ApmtDetail/:${
										promiseId.split('_')[0]
									}_${promiseCode}`,
								)
							}
						>
							{`https://www.meetable.com/ApmtDetail/:${
								promiseId.split('_')[0]
							}_${promiseCode}`}
							{svgList.apmtDetail.copyIcon}
						</div>
					</div>
					<div className={styles.modalMiddleHeader}>
						약속 코드
						<div
							className={styles.modalTxt}
							onClick={() =>
								handleCopyClipBoard(`${promiseId.split('_')[0]}_${promiseCode}`)
							}
							style={{ maxWidth: 120 }}
						>
							{`${promiseId.split('_')[0]}_${promiseCode}`}
							{svgList.apmtDetail.copyIcon}
						</div>
					</div>
				</ApmtShareModal>
			)}
			{copyModal && (
				<ApmtShareModal title={''} onClose={() => setCopyModal(false)}>
					<div className={styles.modalHeader}>
						링크를 복사했어요.
						<br />
						링크를 통해 친구가 약속에 참여할 수 있어요.
					</div>
					<div
						className={styles.modalBtn}
						style={{ marginTop: 24 }}
						onClick={() => setCopyModal(false)}
					>
						확인
					</div>
				</ApmtShareModal>
			)}
			{partiModal !== 'no' && (
				<ApmtShareModal title={''} onClose={() => setPartiModal('no')}>
					<div
						className={styles.modalHeader}
						style={{ fontSize: 16, fontWeight: '600', width: 280 }}
					>
						{accessToken
							? partiModal === 'show'
								? '약속 참여하기'
								: '비회원으로 참여한 약속 불러오기'
							: '비회원 약속 참여하기'}
						{!accessToken &&
							(addDescription === 'hover' || addDescription === 'click') && (
								<div style={{ position: 'absolute', top: -20, left: 42 }}>
									<svg
										width="154"
										height="43"
										viewBox="0 0 154 43"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<mask id="path-1-inside-1_0_1" fill="white">
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M5 0C2.23858 0 0 2.23858 0 5V33.6286V34V43L11.0616 34H149C151.761 34 154 31.7614 154 29V5C154 2.23858 151.761 0 149 0H5Z"
											/>
										</mask>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M5 0C2.23858 0 0 2.23858 0 5V33.6286V34V43L11.0616 34H149C151.761 34 154 31.7614 154 29V5C154 2.23858 151.761 0 149 0H5Z"
											fill="white"
										/>
										<path
											d="M0 43H-1V45.1028L0.63112 43.7757L0 43ZM11.0616 34V33H10.7062L10.4305 33.2243L11.0616 34ZM1 5C1 2.79086 2.79086 1 5 1V-1C1.68629 -1 -1 1.68629 -1 5H1ZM1 33.6286V5H-1V33.6286H1ZM1 34V33.6286H-1V34H1ZM1 43V34H-1V43H1ZM10.4305 33.2243L-0.63112 42.2244L0.63112 43.7757L11.6927 34.7757L10.4305 33.2243ZM149 33H11.0616V35H149V33ZM153 29C153 31.2091 151.209 33 149 33V35C152.314 35 155 32.3137 155 29H153ZM153 5V29H155V5H153ZM149 1C151.209 1 153 2.79086 153 5H155C155 1.68629 152.314 -1 149 -1V1ZM5 1H149V-1H5V1Z"
											fill="#D0D0D0"
											mask="url(#path-1-inside-1_0_1)"
										/>
										<path
											d="M14.1172 5.49609V15.9961H12.9922V5.49609H14.1172ZM5.49219 13.1836C8.28125 11.8535 9.64648 9.96094 9.86328 7.51172H5.99609V6.62109H10.9883C10.9883 9.69727 9.68164 12.3574 6.07812 14.0859L5.49219 13.1836ZM24.4766 5.98828V6.89062H21.2773C21.3359 8.04492 22.8535 9.06445 24.8047 9.29297L24.3828 10.1953C22.584 9.94336 21.1074 9.09961 20.5449 7.91602C19.9707 9.09961 18.5 9.94336 16.707 10.1953L16.2852 9.29297C18.248 9.06445 19.748 8.04492 19.8008 6.89062H16.6367V5.98828H24.4766ZM15.7578 12V11.0977H19.9883V9.43359H21.0898V11.0977H25.3555V12H15.7578ZM16.9648 15.7734V12.7852H18.0898V14.8711H24.2539V15.7734H16.9648ZM35.1641 5.49609V15.9961H34.0977V5.49609H35.1641ZM26.2461 10.0312C26.2461 7.75781 27.1367 6.33398 28.5078 6.33984C29.7852 6.33398 30.6465 7.54688 30.7754 9.51562H31.9648V5.69531H33.0312V15.4805H31.9648V10.418H30.7812C30.6816 12.4688 29.8086 13.7402 28.5078 13.7344C27.1367 13.7402 26.2461 12.3105 26.2461 10.0312ZM27.2773 10.0312C27.2773 11.7012 27.752 12.6855 28.5078 12.6797C29.2812 12.6855 29.7617 11.7012 29.7617 10.0312C29.7617 8.35547 29.2812 7.37695 28.5078 7.38281C27.752 7.37695 27.2773 8.35547 27.2773 10.0312ZM43.1094 7.66406C43.1094 8.87695 44.0586 10.002 45.6641 10.4648L45.1484 11.332C43.9355 10.9805 43.0391 10.2363 42.5703 9.28125C42.1074 10.3301 41.1934 11.1445 39.9453 11.5312L39.4062 10.6641C41.0117 10.1895 42.0078 8.99414 42.0078 7.66406V7.55859H39.7227V6.66797H42.0078V5.44922H43.1211V6.66797H45.3945V7.55859H43.1094V7.66406ZM40.9766 15.8672V12.1641H47.6797V15.8672H40.9766ZM42.0664 14.9648H46.5781V13.043H42.0664V14.9648ZM46.5664 11.6953V5.49609H47.6797V8.09766H49.2031V9.02344H47.6797V11.6953H46.5664ZM52.6484 6.28125C53.6094 6.28711 54.3945 6.83203 54.8574 7.78125H57.4531V5.49609H58.5547V16.0195H57.4531V11.9883H54.9336C54.4824 13.043 53.6621 13.6582 52.6484 13.6523C51.084 13.6582 49.9766 12.2285 49.9883 9.96094C49.9766 7.7168 51.084 6.28711 52.6484 6.28125ZM51.043 9.96094C51.0488 11.6309 51.6992 12.6562 52.6484 12.6562C53.5977 12.6562 54.248 11.6309 54.2539 9.96094C54.248 8.31445 53.5977 7.2832 52.6484 7.27734C51.6992 7.2832 51.0488 8.31445 51.043 9.96094ZM55.1738 8.69531C55.2559 9.08203 55.3086 9.50391 55.3086 9.96094C55.3086 10.3594 55.2734 10.7285 55.2031 11.0742H57.4531V8.69531H55.1738ZM69.125 5.50781V12H68.0703V9.23438H66.875V11.8477H65.832V5.66016H66.875V8.33203H68.0703V5.50781H69.125ZM60.1133 7.52344V6.63281H62.2344V5.54297H63.3359V6.63281H65.4219V7.52344H60.1133ZM60.5234 9.80859C60.5234 8.70117 61.4609 7.99219 62.7734 7.99219C64.1152 7.99219 65.0469 8.70117 65.0469 9.80859C65.0469 10.8809 64.1152 11.6133 62.7734 11.6133C61.4609 11.6133 60.5234 10.8809 60.5234 9.80859ZM60.8164 15.0234C62.1465 14.6016 62.8965 13.5703 62.9023 12.6211V12.3047H63.9922V12.6211C63.9863 13.4766 64.4199 14.3672 65.3574 14.8945C66.3066 14.3203 66.7695 13.3711 66.7695 12.6211V12.3047H67.8711V12.6211C67.8652 13.6289 68.5977 14.6367 69.957 15.0234L69.4297 15.8672C68.3867 15.5273 67.6777 14.8477 67.3086 14.0156C66.9863 14.8301 66.3594 15.5859 65.3867 15.9609C64.3789 15.5977 63.7461 14.8887 63.4238 14.0625C63.043 14.8535 62.334 15.5215 61.3438 15.8672L60.8164 15.0234ZM61.5195 9.80859C61.5195 10.4062 62.0293 10.7871 62.7734 10.793C63.5293 10.7871 64.0449 10.4062 64.0391 9.80859C64.0449 9.18164 63.5293 8.80664 62.7734 8.8125C62.0293 8.80664 61.5195 9.18164 61.5195 9.80859ZM75.3242 5.67188C77.6914 5.66602 79.0684 6.30469 79.0742 7.47656C79.0684 8.6543 77.6914 9.29297 75.3242 9.29297C72.957 9.29297 71.5684 8.6543 71.5742 7.47656C71.5684 6.30469 72.957 5.66602 75.3242 5.67188ZM70.543 10.8281V9.9375H80.1172V10.8281H70.543ZM71.6914 12.4688V11.6367H78.9102V14.0977H72.793V15.0352H79.2031V15.8906H71.7031V13.2891H77.8086V12.4688H71.6914ZM72.7344 7.47656C72.7285 8.12695 73.6543 8.46094 75.3242 8.46094C77.0059 8.46094 77.9316 8.12695 77.9258 7.47656C77.9316 6.85547 77.0059 6.49219 75.3242 6.49219C73.6543 6.49219 72.7285 6.85547 72.7344 7.47656ZM90.8281 5.70703V9.71484H91.9414V5.49609H92.9961V15.9961H91.9414V10.6289H90.8281V15.4922H89.7969V5.70703H90.8281ZM84.1133 13.3242V6.79688H86.3867V7.71094H85.1328V12.375C85.502 12.3574 85.9355 12.3047 86.4219 12.1875L86.5156 13.125C85.6719 13.3066 85.0273 13.3242 84.5469 13.3242H84.1133ZM86.8203 13.3242V6.79688H89.1523V7.71094H87.8281V12.3809C88.2734 12.3691 88.7773 12.3164 89.3281 12.1641L89.4219 13.1016C88.5781 13.3125 87.8867 13.3242 87.2656 13.3242H86.8203ZM100.789 8.16797C100.777 10.0254 101.861 11.9297 103.426 12.6914L102.734 13.582C101.592 12.9844 100.707 11.8125 100.244 10.4121C99.7754 11.9004 98.8555 13.1602 97.6602 13.7812L96.9688 12.8789C98.5801 12.1055 99.6699 10.0898 99.6758 8.16797V6.375H100.789V8.16797ZM104.211 15.9961V5.49609H105.324V9.67969H107.012V10.6289H105.324V15.9961H104.211ZM117.09 10.6172V11.5195H107.516V10.6172H109.812V9.20508C108.998 8.87695 108.541 8.34961 108.547 7.65234C108.541 6.4043 109.988 5.67773 112.297 5.68359C114.6 5.67773 116.041 6.4043 116.047 7.65234C116.041 8.34961 115.584 8.87695 114.77 9.21094V10.6172H117.09ZM108.652 14.0977C108.652 12.8965 110.012 12.2344 112.297 12.2344C114.553 12.2344 115.912 12.8965 115.918 14.0977C115.912 15.3105 114.553 15.9727 112.297 15.9727C110.012 15.9727 108.652 15.3105 108.652 14.0977ZM109.695 7.65234C109.689 8.35547 110.662 8.74805 112.297 8.75391C113.92 8.74805 114.904 8.35547 114.898 7.65234C114.904 6.94922 113.92 6.54492 112.297 6.53906C110.662 6.54492 109.689 6.94922 109.695 7.65234ZM109.777 14.0977C109.771 14.7539 110.691 15.1289 112.297 15.1172C113.879 15.1289 114.805 14.7539 114.805 14.0977C114.805 13.4531 113.879 13.0898 112.297 13.0898C110.691 13.0898 109.771 13.4531 109.777 14.0977ZM110.938 10.6172H113.668V9.49805C113.258 9.5625 112.795 9.59766 112.297 9.59766C111.805 9.59766 111.348 9.5625 110.938 9.50391V10.6172ZM126.84 5.50781V12H125.785V9.23438H124.59V11.8477H123.547V5.66016H124.59V8.33203H125.785V5.50781H126.84ZM117.828 7.52344V6.63281H119.949V5.54297H121.051V6.63281H123.137V7.52344H117.828ZM118.238 9.80859C118.238 8.70117 119.176 7.99219 120.488 7.99219C121.83 7.99219 122.762 8.70117 122.762 9.80859C122.762 10.8809 121.83 11.6133 120.488 11.6133C119.176 11.6133 118.238 10.8809 118.238 9.80859ZM118.531 15.0234C119.861 14.6016 120.611 13.5703 120.617 12.6211V12.3047H121.707V12.6211C121.701 13.4766 122.135 14.3672 123.072 14.8945C124.021 14.3203 124.484 13.3711 124.484 12.6211V12.3047H125.586V12.6211C125.58 13.6289 126.312 14.6367 127.672 15.0234L127.145 15.8672C126.102 15.5273 125.393 14.8477 125.023 14.0156C124.701 14.8301 124.074 15.5859 123.102 15.9609C122.094 15.5977 121.461 14.8887 121.139 14.0625C120.758 14.8535 120.049 15.5215 119.059 15.8672L118.531 15.0234ZM119.234 9.80859C119.234 10.4062 119.744 10.7871 120.488 10.793C121.244 10.7871 121.76 10.4062 121.754 9.80859C121.76 9.18164 121.244 8.80664 120.488 8.8125C119.744 8.80664 119.234 9.18164 119.234 9.80859ZM133.695 6.31641V7.23047H129.98V10.7461C131.738 10.7461 132.91 10.6875 134.258 10.4297L134.375 11.332C132.91 11.5898 131.645 11.6602 129.688 11.6602H128.879V6.31641H133.695ZM130.168 15.832V12.5625H131.293V14.9297H137.281V15.832H130.168ZM133.039 9.24609V8.35547H135.898V5.50781H137.012V13.1602H135.898V9.24609H133.039ZM14.1289 18.4961V23.957H13.0273V22.7031H10.7305V23.5703H5.89062V18.9766H7.00391V20.3945H9.62891V18.9766H10.7305V19.9375H13.0273V18.4961H14.1289ZM7.00391 22.6797H9.62891V21.25H7.00391V22.6797ZM7.26172 25.293V24.4258H14.1289V27.0039H8.39844V27.9766H14.5039V28.8672H7.28516V26.1719H13.0273V25.293H7.26172ZM10.7305 21.8477H13.0273V20.793H10.7305V21.8477ZM24.5117 18.4961V24.6953H23.3984V23.1367H21.1133V23.9922H16.2383V19.2812H21.1133V20.1484H23.3984V18.4961H24.5117ZM17.3398 23.1016H20.0234V20.1719H17.3398V23.1016ZM17.4453 26.9922C17.4395 25.7207 18.7871 24.9824 20.9961 24.9883C23.1934 24.9824 24.541 25.7207 24.5469 26.9922C24.541 28.2578 23.1934 28.9785 20.9961 28.9727C18.7871 28.9785 17.4395 28.2578 17.4453 26.9922ZM18.5469 26.9922C18.541 27.6953 19.4551 28.1113 20.9961 28.1172C22.5254 28.1113 23.4395 27.6953 23.4453 26.9922C23.4395 26.2539 22.5254 25.8496 20.9961 25.8438C19.4551 25.8496 18.541 26.2539 18.5469 26.9922ZM21.1133 22.2344H23.3984V21.0391H21.1133V22.2344ZM31.9766 19.6211V20.2656C31.9707 21.1504 31.9707 22.5039 31.6719 24.3789L30.5703 24.2969C30.8398 22.6211 30.8691 21.3965 30.875 20.5234H26.6094V19.6211H31.9766ZM26.0234 25.832C26.6797 25.8262 27.4121 25.8203 28.1797 25.8027V22.6211H29.2812V25.7676C30.3945 25.7207 31.5371 25.6504 32.5859 25.5156L32.6445 26.3477C30.459 26.6992 28.0156 26.7461 26.1523 26.7344L26.0234 25.832ZM33.1836 28.9961V18.4961H34.3086V22.832H35.9141V23.7812H34.3086V28.9961H33.1836ZM48.125 18.4961V29.0195H47.0117V18.4961H48.125ZM40.0156 26.5V19.375H41.1289V22.0703H43.9531V19.375H45.0547V26.5H40.0156ZM41.1289 25.5859H43.9531V22.9492H41.1289V25.5859ZM55.3438 19.0586V23.3828H50.3516V19.0586H55.3438ZM51.4414 22.5156H54.2422V19.9609H51.4414V22.5156ZM51.6055 25.2461V24.3789H58.4961V26.9922H52.7188V28H58.8359V28.8906H51.6289V26.1836H57.4062V25.2461H51.6055ZM57.3945 23.875V18.4961H58.4961V23.875H57.3945ZM68.9258 18.5078V26.2656H67.8125V22.3047H65.5156V24.5195H60.6758V19.1992H61.7891V20.9805H64.4141V19.1992H65.5156V21.4023H67.8125V18.5078H68.9258ZM61.7891 23.6172H64.4141V21.8359H61.7891V23.6172ZM62.0703 28.7734V25.5039H63.1953V27.8711H69.1602V28.7734H62.0703ZM79.6367 19.9727V20.875H71V19.9727H74.7734V18.6484H75.875V19.9727H79.6367ZM70.543 27.8125V26.9102H74.7734V25.5215C72.9336 25.4043 71.8145 24.6777 71.8203 23.5117C71.8145 22.2461 73.1562 21.502 75.3242 21.5078C77.4629 21.502 78.8223 22.2461 78.8164 23.5117C78.8223 24.6777 77.6914 25.4043 75.875 25.5215V26.9102H80.1523V27.8125H70.543ZM72.957 23.5117C72.9453 24.2441 73.8242 24.6426 75.3242 24.6484C76.8008 24.6426 77.6855 24.2441 77.6797 23.5117C77.6855 22.7852 76.8008 22.3867 75.3242 22.3867C73.8242 22.3867 72.9453 22.7852 72.957 23.5117ZM90.5117 23.3125V24.168H80.9023V23.3125H90.5117ZM82.0391 25.7031V24.9062H89.3281V27.2148H83.1641V28.082H89.6562V28.8672H82.0508V26.4766H88.2266V25.7031H82.0391ZM82.1094 19.5508V18.7656H89.3047V21.0391H83.2344V21.8359H89.4805V22.6211H82.1328V20.3008H88.1914V19.5508H82.1094ZM97.9766 20.3594C97.9707 21.6836 98.9199 22.9785 100.508 23.5234L99.9336 24.3906C98.7559 23.9863 97.8828 23.1426 97.4258 22.1055C96.9688 23.2598 96.0488 24.1855 94.8008 24.625L94.2266 23.7461C95.8379 23.1953 96.8457 21.7949 96.8398 20.3711V20.0781H94.5664V19.1758H100.227V20.0781H97.9766V20.3594ZM95.8555 26.207V25.3047H102.969V28.9961H101.855V26.207H95.8555ZM99.9102 22.082V21.168H101.855V18.4961H102.969V24.7773H101.855V22.082H99.9102ZM107.434 19.2812C108.863 19.2871 109.9 20.4941 110.07 22.4336H112.238V18.4961H113.34V29.0195H112.238V23.3359H110.082C109.959 25.3867 108.898 26.6582 107.434 26.6523C105.869 26.6582 104.762 25.2285 104.773 22.9609C104.762 20.7168 105.869 19.2871 107.434 19.2812ZM105.828 22.9609C105.834 24.6309 106.484 25.6562 107.434 25.6562C108.383 25.6562 109.033 24.6309 109.039 22.9609C109.033 21.3145 108.383 20.2832 107.434 20.2773C106.484 20.2832 105.834 21.3145 105.828 22.9609ZM124.531 24.4141V25.3164H120.266V28.9844H119.176V25.3164H114.957V24.4141H124.531ZM115.496 22.7383C117.453 22.4688 119.082 21.3027 119.117 20.0078H115.848V19.1172H123.629V20.0078H120.383C120.4 21.3027 122.018 22.4688 124.004 22.7383L123.594 23.6172C121.871 23.3477 120.383 22.498 119.744 21.3027C119.1 22.498 117.617 23.3477 115.918 23.6172L115.496 22.7383ZM128.527 21.3672C128.527 23.043 129.23 24.8301 130.637 25.6914L130.016 26.5469C129.031 25.9551 128.369 24.9062 128.006 23.6934C127.625 25.0234 126.898 26.1602 125.879 26.7812L125.188 25.9492C126.67 25.0586 127.455 23.2012 127.449 21.4141V19.457H128.527V21.3672ZM129.5 23.1133V22.1875H131.129V18.6953H132.184V28.4805H131.129V23.1133H129.5ZM133.297 28.9961V18.4961H134.363V28.9961H133.297ZM145.309 26.7578V27.6836H135.699V26.7578H137.996V24.0156C137.135 23.541 136.607 22.791 136.613 21.8477C136.607 20.1953 138.23 19.1113 140.48 19.1055C142.736 19.1113 144.359 20.1953 144.359 21.8477C144.359 22.7734 143.855 23.5176 143.012 23.9922V26.7578H145.309ZM137.691 21.8477C137.691 22.9727 138.834 23.7051 140.48 23.7109C142.115 23.7051 143.275 22.9727 143.281 21.8477C143.275 20.7168 142.115 19.9961 140.48 19.9961C138.834 19.9961 137.691 20.7168 137.691 21.8477ZM139.098 26.7578H141.887V24.4258C141.459 24.5254 140.984 24.5781 140.48 24.5781C139.988 24.5781 139.52 24.5254 139.098 24.4258V26.7578ZM147.266 28.082C146.809 28.0762 146.428 27.707 146.434 27.25C146.428 26.793 146.809 26.418 147.266 26.418C147.717 26.418 148.092 26.793 148.098 27.25C148.092 27.707 147.717 28.0762 147.266 28.082Z"
											fill="#888888"
										/>
									</svg>
								</div>
							)}
					</div>
					{!accessToken && (
						<div
							className={`${styles.subBtnNonmember}`}
							onMouseOver={() => {
								if (addDescription !== 'click') setAddDescription('hover');
							}}
							onMouseOut={() => {
								if (addDescription !== 'click') setAddDescription('out');
							}}
							onClick={() => {
								if (addDescription === 'click') setAddDescription('hover');
								else setAddDescription('click');
							}}
						>
							{svgList.apmtDetail.iInModal}기존에 이 약속에 참여했었나요?
						</div>
					)}
					{accessToken && partiModal === 'show' && (
						<div
							className={`${styles.subBtnMember}`}
							onClick={() => setPartiModal('link')}
						>
							비회원으로 참여한 적이 있는 약속인가요?
						</div>
					)}
					{accessToken && partiModal === 'link' && (
						<div style={{ height: 20 }}></div>
					)}
					<div className={styles.inputArea}>
						<input
							className={styles.inputItem}
							placeholder="별명"
							value={nonmemberNickname}
							onChange={(e) => {
								setNonmemberNickname(e.target.value.trim());
							}}
							onSubmit={() => participate()}
						/>
						<div
							style={{
								position: 'absolute',
								right: 2,
								top: 3,
								cursor: 'pointer',
							}}
							onClick={() => {
								setNonmemberNickname('');
							}}
						>
							{svgList.loginIcon.delBtn}
						</div>
						{(!accessToken || (accessToken && partiModal === 'link')) && (
							<input
								className={styles.inputItem}
								placeholder="(선택사항)비밀번호"
								value={nonmemberPw}
								type="password"
								onChange={(e) => {
									setNonmemberPw(e.target.value.trim());
								}}
							/>
						)}
						{(!accessToken || (accessToken && partiModal === 'link')) && (
							<div
								style={{
									position: 'absolute',
									right: 2,
									top: 48,
									cursor: 'pointer',
								}}
								onClick={() => {
									setNonmemberPw('');
								}}
							>
								{svgList.loginIcon.delBtn}
							</div>
						)}
					</div>
					<div
						className={styles.modalBtn}
						style={!accessToken ? { marginBottom: 30 } : { marginBottom: 0 }}
						onClick={() => {
							if (partiModal === 'link') {
								console.log('비회원 약속 불러오기');
							} else {
								participate();
							}
						}}
					>
						{partiModal === 'link' ? '약속 불러오기' : '참여하기'}
					</div>
					{!accessToken && (
						<div className={styles.subBtnNonmember} style={{ marginBottom: 0 }}>
							<div
								onClick={() => {
									window.location.href = '/emailauth';
								}}
							>
								미터블 가입하기
							</div>
							<div id={styles.bar}>|</div>
							<div
								onClick={() => {
									window.location.href = `/:username/apmtdetail/:`;
								}}
							>
								로그인
							</div>
						</div>
					)}
				</ApmtShareModal>
			)}
			{confirmModal && (
				<ApmtShareModal
					title={''}
					onClose={() => {
						setConfirmModal(false);
						setConfirmSelected(new Set(confirmed));
					}}
				>
					<div className={styles.modalHeader}>약속 확정하기</div>
					<div className={styles.modalContent}>
						<div className={styles.whenContent}>
							<div className={styles.icon}>{svgList.confirm.when}</div>
							<div className={styles.whenText} style={{ flex: 1 }}>
								{sortDaysOfWeek(Array.from(confirmSelected)).map(
									(item, index) => {
										if (week) {
											let day = '';
											switch (item) {
												case 'MON':
													day = '월';
													break;
												case 'TUE':
													day = '화';
													break;
												case 'WED':
													day = '수';
													break;
												case 'THU':
													day = '목';
													break;
												case 'FRI':
													day = '금';
													break;
												case 'SAT':
													day = '토';
													break;
												case 'SUN':
													day = '일';
													break;
											}
											return (
												`${day}` +
												(index === confirmSelected.size - 1 ? ' ' : ', ')
											);
										}

										const date = new Date(item);
										console.log(item);
										const year =
											String(date.getFullYear())[2] +
											String(date.getFullYear())[3];
										const month = date.getMonth() + 1;
										const day = date.getDate();
										const dayOfWeek = [
											'일',
											'월',
											'화',
											'수',
											'목',
											'금',
											'토',
										][date.getDay()];
										return (
											<div>{`${year}년 ${month}월 ${day}일 ${dayOfWeek}\n`}</div>
										);
									},
								)}
							</div>
							<div
								className={styles.icon}
								onClick={() => {
									setConfirming(true);
									setConfirmModal(false);
								}}
							>
								{svgList.loginIcon.pencilBtn}
							</div>
						</div>
						<div className={styles.inputContent}>
							<div className={styles.icon}>{svgList.confirm.where}</div>
							<div className={styles.modalInput}>
								<textarea
									className={styles.inputItem}
									style={{ marginBottom: 0 }}
									placeholder="위치"
									value={place}
									onChange={(e) => {
										setPlace(e.target.value);
									}}
								/>
								<div
									style={{
										position: 'absolute',
										cursor: 'pointer',
										top: 2,
										right: 2,
									}}
									onClick={() => {
										setPlace('');
									}}
								>
									{svgList.loginIcon.delBtn}
								</div>
							</div>
						</div>
						<div className={styles.inputContent}>
							<div className={styles.icon}>{svgList.confirm.notion}</div>
							<div className={styles.modalInput}>
								<textarea
									className={styles.inputItem}
									style={{ marginBottom: 0 }}
									placeholder="공지 (ex. 매주 모입시다)"
									value={notion}
									onChange={(e) => {
										setNotion(e.target.value);
									}}
								/>
								<div
									style={{
										position: 'absolute',
										cursor: 'pointer',
										top: 2,
										right: 2,
									}}
									onClick={() => {
										setNotion('');
									}}
								>
									{svgList.loginIcon.delBtn}
								</div>
							</div>
						</div>
					</div>
					<div className={styles.modalBtnView}>
						<div
							className={styles.confirmModalBtn}
							style={{ color: '#8E66EE' }}
							onClick={() => {
								setConfirmModal(false);
								setConfirmSelected(new Set(confirmed));
							}}
						>
							취소
						</div>
						<div style={{ width: 10 }}></div>
						<div
							className={styles.confirmModalBtn}
							style={{ backgroundColor: '#8E66EE', color: 'white' }}
							onClick={() => {
								// console.log(confirmSelected);
								confirm();
								setConfirmModal(false);
							}}
						>
							완료
						</div>
					</div>
				</ApmtShareModal>
			)}
			{(showConfirmModal === 'hover' || showConfirmModal === 'click') && (
				<div
					style={{
						position: 'absolute',
						top: modalPosition[1] + 10,
						left: modalPosition[0] + 10,
					}}
					className={styles.modalBody}
					onClick={(e) => {
						e.stopPropagation();
						setShowConfirmModal('click');
					}}
				>
					<div className={styles.modalContent}>
						<div className={styles.whenContent}>
							<div className={styles.icon}>{svgList.confirm.when}</div>
							<div
								className={styles.whenText}
								style={
									week ? { flexDirection: 'row' } : { flexDirection: 'column' }
								}
							>
								{sortDaysOfWeek(Array.from(confirmSelected)).map(
									(item, index) => {
										{
											/* {['MON', 'WED'].map((item, index) => { */
										}
										if (week) {
											let day = '';
											switch (item) {
												case 'MON':
													day = '월';
													break;
												case 'TUE':
													day = '화';
													break;
												case 'WED':
													day = '수';
													break;
												case 'THU':
													day = '목';
													break;
												case 'FRI':
													day = '금';
													break;
												case 'SAT':
													day = '토';
													break;
												case 'SUN':
													day = '일';
													break;
											}
											return (
												<div style={{ display: 'flex', marginRight: 10 }}>
													<div
														style={{
															paddingTop: 1,
														}}
														onClick={() => {
															setSelectConfirmDate((prev) => {
																if (prev.includes(item)) {
																	return prev.filter((im) => im !== item);
																}
																return [...prev, item];
															});
														}}
													>
														{selectConfirmDate.includes(item)
															? svgList.confirm.checkboxChecked
															: svgList.confirm.checkBoxNotChecked}
													</div>
													{day}
												</div>
											);
										}

										const date = new Date(item);
										console.log(item);
										const year =
											String(date.getFullYear())[2] +
											String(date.getFullYear())[3];
										const month = date.getMonth() + 1;
										const day = date.getDate();
										const dayOfWeek = [
											'일',
											'월',
											'화',
											'수',
											'목',
											'금',
											'토',
										][date.getDay()];
										return (
											<div
												style={{ display: 'flex', justifyContent: 'center' }}
											>
												<div
													style={{ marginRight: 4, paddingTop: 1 }}
													onClick={() => {
														setSelectConfirmDate((prev) => {
															if (prev.includes(item)) {
																return prev.filter((im) => im !== item);
															}
															return [...prev, item];
														});
													}}
												>
													{new Set(selectConfirmDate).has(item)
														? svgList.confirm.checkboxChecked
														: svgList.confirm.checkBoxNotChecked}
												</div>
												{`${year}년 ${month}월 ${day}일 ${dayOfWeek}\n`}
											</div>
										);
									},
								)}
							</div>
							{canConfirm && (
								<div
									className={styles.icon}
									style={{ paddingTop: 1, paddingLeft: 6 }}
									onClick={(e) => {
										e.stopPropagation();

										setShowConfirmModal('no');
										setConfirming(true);
									}}
								>
									{svgList.loginIcon.pencilBtn}
								</div>
							)}
						</div>
						<div className={styles.whenContent}>
							<div className={styles.icon}>{svgList.confirm.where}</div>
							<div className={styles.whenText}>{place}</div>
						</div>
						<div className={styles.whenContent}>
							<div className={styles.icon}>{svgList.confirm.notion}</div>
							<div className={styles.whenText}>{notion}</div>
						</div>
					</div>
					<div className={styles.modalBtnView} style={{ paddingTop: 20 }}>
						<div
							className={styles.confirmModalBtn}
							style={{ color: '#8E66EE' }}
							onClick={(e) => {
								e.stopPropagation();
								setShowConfirmModal('no');
								setConfirmModal(true);
							}}
						>
							세부사항
							<br /> 수정하기
						</div>
						<div style={{ width: 10 }}></div>
						<div
							className={styles.confirmModalBtn}
							style={{ color: '#8E66EE' }}
							onClick={() => {
								// confirm();
								// setConfirmModal(false);
								// 확정 취소 모달 띄우기
								setCancelConfirmModal(true);
							}}
						>
							확정
							<br />
							취소하기
						</div>
					</div>
					<div
						className={styles.confirmModalBtn}
						style={
							selectConfirmDate.length === 0
								? {
										backgroundColor: '#D0D0D0',
										borderColor: '#D0D0D0',
										color: 'white',
										paddingTop: 15,
										paddingBottom: 15,
										marginTop: 8,
										minWidth: 250,
								  }
								: {
										backgroundColor: '#8E66EE',
										color: 'white',
										paddingTop: 15,
										paddingBottom: 15,
										marginTop: 8,
										minWidth: 250,
								  }
						}
					>
						내 캘린더에 복사하기
					</div>
				</div>
			)}
			{cancelConfirmModal && (
				<ApmtShareModal
					title={'확정을 취소하시겠어요?'}
					onClose={() => setCancelConfirmModal(false)}
				>
					<div className={styles.modalHeader}>
						확정을 취소하시겠어요?
						<div style={{ height: 8 }}></div>
						약속에 참여 중인 모두에게 확정 취소됩니다.
					</div>
					<div className={styles.modalBtnView} style={{ paddingTop: 0 }}>
						<div
							className={styles.modalBtn}
							style={{
								marginTop: 24,
								backgroundColor: 'white',
								color: '#8E66EE',
								border: '1px solid #8E66EE',
								flex: 1,
							}}
							onClick={() => setCancelConfirmModal(false)}
						>
							아니요
						</div>
						<div style={{ width: 8 }}></div>
						<div
							className={styles.modalBtn}
							style={{ marginTop: 24, flex: 2 }}
							onClick={() => {
								cancelConfirm();
							}}
						>
							네, 취소할게요
						</div>
					</div>
				</ApmtShareModal>
			)}
			{wrongAddressModal && (
				<OnlyShowModal>
					<div className={styles.wrongAddTitle}>앗! 없는 주소예요.</div>
					<div className={styles.wrongAddContent}>
						최고의 일정 조율 서비스 미터블에서
						<br />
						약속 일정을 관리하세요!
					</div>
					<div
						className={styles.wrongAddBtn}
						onClick={() => {
							navigate('/');
						}}
					>
						미터블 홈으로 가기
					</div>
				</OnlyShowModal>
			)}
		</div>
	);
};

export default ApmtDetail;