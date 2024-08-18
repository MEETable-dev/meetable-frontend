import { Outlet, useNavigate } from 'react-router-dom';
import { useResizeSidebar } from '../hooks/useResizeSidebar';
import styles from '../css/Layout.module.css';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef, useCallback } from 'react';
import { svgList } from '../assets/svg';
import React from 'react';
import { BsGrid } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { AiFillStar } from 'react-icons/ai';
import { AiOutlineStar } from 'react-icons/ai';
import { IoSyncOutline } from 'react-icons/io5';
import { RiSearchLine } from 'react-icons/ri';
import { TiDelete } from 'react-icons/ti';
import { IoMdArrowDropdown } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';
import { setToken } from '../store/modules/user';
import { useAppDispatch } from 'store';
import axios from 'axios';
import ApmtShareModal from './ApmtShareModal';
import MyInfoModal from '../components/MyInfoModal';
import PWChangeModal from '../components/PWChangeModal';
import useCustomColor from 'hooks/CustomColor';
import LayoutApmtItem from './layoutApmtItem';
import LayoutApmtList from './layoutApmtList';
import NotionModal from 'components/NotionModal';
import styles2 from 'css/EnterInfo.module.css';
import InputArea2 from 'components/InputArea2';
import {getData as getDataAll} from 'pages/AllApmt.js';

const Layout = (props) => {
	const localStorage = window.localStorage;
	const navigate = useNavigate();

	const head = props.head;
	const dispatch = useAppDispatch();
	const sidebarInitialSize = 300;
	const sidebarMinWidth = 100;
	const sidebarMaxWidth = 500;
	const { resizing, size, startResizing, stopResizing, updateSize, reset } =
		useResizeSidebar(sidebarInitialSize, sidebarMinWidth, sidebarMaxWidth);
	const accessToken = useSelector((state) => state.user.accessToken);
	const [sidebarShown, setsidebarShown] = useState(true);

	const [searchApmtVal, setSearchApmtVal] = useState('');
	const [writeNameVal, setWriteNameVal] = useState('');
	const [showModal, setShowModal] = useState('');
	const [showHeaderModal, setShowHeaderModal] = useState('');
	const [showNotionModal, setShowNotionModal] = useState('');
	const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
	const [openFindModal, setOpenFindModal] = useState(false);
	const [pullNonRegisteredModal, setPullNonRegisteredModel] = useState(false);

	const [bookmarkData, setBookmarkData] = useState([]);
	const [ApmtData, setApmtData] = useState([]);
	const [selectedItemID, setSelectedItemID] = useState(null);
	const [openBookmark, setOpenBookmark] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [sortItem, setSortItem] = useState('id');

	//Joining Apmt
	const[nonRegLink, setNonRegLink] = useState('');
	var [linkVerified, setLinkVerified] = useState('-');
	const [apmtName, setApmtName] =useState('');
	const [name, setName]= useState('');
	const [pw, setPW] = useState('');
	const [pullApmtModal, setPullApmtModal] = useState(false);
	const[pullSuccessModal, setPullSuccessModal] = useState(false);
	const[neverJoinModal, setNeverJoinModal] = useState(false);


	//Trash Area
	const [TrashData, setTrashData] = useState([]);
	const [showTrash, setShowTrash] = useState(false);

	//Name Modification + Modals
	const [selectAll, setSelectAll] = useState(false);
	const [selectedItemList, setSelectedItemList] = useState([]);
	const [modifyName, setModifyName] = useState(false);

	const modalRef = useRef();
	const modalHeaderRef = useRef();
	const inputRef = useRef();
	const notionModalRef = useRef();
	const [devMode, setDevMode] = useState(false);
	const [link, setLink] = useState('');

	const [mypageModal, setMypageModal] = useState(null); // New state for tracking open modal
	const toggleModal = (modalId) => {
		setMypageModal(mypageModal === modalId ? null : modalId);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	const handleSortItem = () => {
		if (sortItem === 'id') {
			setSortItem('name');
			getDatabyName();
		} else if (sortItem === 'name') {
			setSortItem('id');
			getData();
		}
	};

	const handleShowTrash = useCallback(
		(e) => {
			setShowTrash(true);
			navigate('/:user/allapmt', { state: { showTrash: true } });
			setsidebarShown(true);
		},
		[showTrash],
	);

	const handleSelectAll = () => {
		if (!selectAll) {
			// 전체 선택 상태일 때
			setSelectAll(true);
			// 모든 약속의 promiseCode에서 앞에 있는 숫자만 추출하여 선택된 목록에 추가
			setSelectedItemList(ApmtData.map((apmt) => apmt.promiseCode));
			// console.log("ApmtData:",ApmtData)
			// console.log("handleSelectAll, selectedItemList: ", selectedItemList);
		} else {
			// 선택 해제 상태일 때
			setSelectAll(false);
			setSelectedItemList([]); // 모든 항목 선택 해제
		}
	};
	const checkValidCode = async (nonRegLink) => {
		console.log('checkValidCode called');
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/promise/verify`,
				{linkOrCode: nonRegLink},
			);
			// console.log(response.data)
			await setLinkVerified(true);
			// await console.log("Link Verified?: ", linkVerified);
			return true;
			
		} catch (error) {
			const errorResponse = error.response;
			setNonRegLink('');
			console.log(errorResponse.data);
			return false;
		}
	};
	const handleLinkVerified = async (nonRegLink) =>{
		console.log("handleLinkVerifiedCalled");
		linkVerified = await checkValidCode(nonRegLink);
		if (linkVerified===true ) {
			console.log("link verified!");
			setPullNonRegisteredModel(false);
			getApmtName(nonRegLink);
			setPullApmtModal(true);
			setLinkVerified('-');

		} else {
			console.log("link not verified.");
			setLinkVerified(false);
			
		}
	}

	const getApmtName = async (promiseCode) =>{
		try {
			console.log("apmt get name called ");
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/promise/baseinfo/${promiseCode.split('_')[0]}`,
				!accessToken && {headers : { Authorization:'@'}},
			);
			await getData();
			await getTrashData();
			// await closeModal();
			let truncatedName = response.data.promise_name;
  
			if (apmtName){
			  truncatedName = name.length > 12 ? name.slice(0, 12) + "..." : name;
			}
			setApmtName(truncatedName)
			console.log(truncatedName,"!!!!!!!!!!!!!!!!!!!!");
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	}

	const handlePostApmt = async (promiseCode) =>{
		try{
			console.log("handlePostApmt Called");
			console.log("promise ID: ", promiseCode.split('_')[0]);
			console.log("name: ", name);
			console.log("pw", pw);
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/promise/link`,
				{
					promiseId: promiseCode.split('_')[0],
					nickname: name,
					password: pw,
				},)
			await getData();
			await getTrashData();
			await setNonRegLink('');
			setPullApmtModal(false);
			// await closeModal();
			setPullSuccessModal(true);
		}
		catch(error){
			const errorResponse = error.response;
			console.log(errorResponse.data);
			// 이 경우에는 약속 valid 체크 했으니 무조건 비참여
			setNeverJoinModal(true);
			setPullApmtModal(false);
		}
		}
		const handleJoinApmt = async (promiseCode) =>{
			try{
				console.log("handleJoinApmt Called");
				console.log("promise ID: ", promiseCode.split('_')[0]);
				console.log("name: ", name);
				console.log("pw", pw);
				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}/promise/participate`,
					{
						promiseId: promiseCode.split('_')[0],
						nickname: name,
						password: pw,
					},)
				await getData();
				await getTrashData();
				await setNonRegLink('');
				// setPullApmtModal(false);
				closeModal();
				setApmtName('');
				setPullSuccessModal(true);
				setNeverJoinModal(false);
			}
			catch(error){
				const errorResponse = error.response;
				console.log(errorResponse.data);
				// 이 경우에는 약속 valid 체크 했으니 무조건 비참여
				// setNeverJoinModal(true);
			}
			}
	

	const closeNotionModal = (e) => {
		setShowNotionModal('');
		// setSelectedItemID(null);

		setSelectedItemList([]);
	};
	const restoreApmt = async (promiseCodes) => {
		console.log('restore', promiseCodes);
		console.log('ApmtData', ApmtData);
		try {
			const promiseIds = promiseCodes.map((code) =>
				parseInt(code.split('_')[0]),
			);
			const response = await axios.patch(
				`${process.env.REACT_APP_API_URL}/home/restore`,
				{ promiseId: promiseIds },
			);
			await getData();
			await getTrashData();
			await closeModal();
			console.log(response);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	//약속 삭제(휴지통으로 이동)
	const moveApmtToTrash = async (promiseCodes) => {
		const promiseIds = promiseCodes.map((code) => parseInt(code.split('_')[0]));
		console.log('promiseIds: ', promiseIds);
		console.log('promiseIds[0]: ', promiseIds[0]);
		try {
			const promiseIds = promiseCodes.map((code) =>
				parseInt(code.split('_')[0]),
			);

			const response = await axios.patch(
				`${process.env.REACT_APP_API_URL}/home/deletepromise`,
				{ promiseId: promiseIds },
			);
			await getData();
			await closeModal();
			console.log(response);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	//약속에서 빠지기
	const backoutApmt = async (promiseCodes) => {
		const promiseIds = promiseCodes.map((code) => parseInt(code.split('_')[0]));
		console.log('promiseIds: ', promiseIds);
		try {
			const promiseIds = promiseCodes.map((code) =>
				parseInt(code.split('_')[0]),
			);
			console.log('delete: ', promiseIds);
			const response = await axios.delete(
				`${process.env.REACT_APP_API_URL}/home/backoutpromise`,
				{
					data: { promiseId: promiseIds }, // promiseIds를 배열로 전달
				},
			);
			console.log(response.data);
			await getData();
			await closeModal();
			console.log(promiseCodes);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	//휴지통 비우기(모든 약속에서 빠지기)

	const backoutAll = async (TrashData) => {
		console.log(TrashData);
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_API_URL}/home/backoutall`,
			);
			console.log(response.data);
			await getData();
			await closeModal();
			console.log(TrashData);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	const openModal = useCallback((itemID, event, type, selectedItemList) => {
		if (type === 'p') {
			event.preventDefault();
			setModalPosition({ x: event.pageX, y: event.pageY });
			console.log('showModal: ', showModal);
			setSelectedItemList([itemID]);
			setModifyName(false);
			// setSelectedItemList([itemID]);
			
			if (selectedItemList && selectedItemList.length > 0) {
				//이미 아이템이 있는 경우에는 놔둔다.
				if (selectedItemList.length > 1) {
					console.log("!!!!!selectedItemList: ", selectedItemList);
					console.log('multiple objects!!!!!');
					setModifyName(false);
					//multiple objects
					setShowModal('m');
				} else {
					setSelectedItemList([itemID]);
					setShowModal(type);
				}
			} else {
				setSelectedItemList([itemID]);
				setShowModal(type);
			}
		} else {
			event.preventDefault();
			setModalPosition({ x: event.pageX, y: event.pageY });
			setShowModal(type);
		}
	}, []);

	const closeModal = (itemID) => {
		console.log('modal closed');
		setShowModal('');
		setModifyName(false);
		setSelectedItemList([]);
		setSelectAll(false);
		setName('');
		setPW('');
		// setApmtName('');
		setLinkVerified('-');
		setNonRegLink('');
		setPullApmtModal(false);
		setPullNonRegisteredModel(false);
		setPullSuccessModal(false);
		setNeverJoinModal(false);
	};

	const modalStyle = {
		position: 'absolute',
		top: `${modalPosition.y}px`,
		left: `${modalPosition.x}px`,
	};

	const ContextMenuModal = ({
		onClose,
		style,
		type,
		showTrash,
		selectedItemList,
	}) => {
		console.log('ContextMenuModal rendered');
		return (
			(type === 'p' && (
				<div style={style}>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setModifyName(true);
							setShowModal('');
						}}
					>
						이름 변경하기
					</div>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setShowNotionModal('B');
							setShowModal('');
						}}
					>
						약속에서 빠지기
					</div>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setShowNotionModal('T');
							setShowModal('');
						}}
					>
						약속 삭제하기
					</div>
				</div>
			)) ||
			( type === 'm'  && (
				<div style={style}>
										<div
						className={styles.modalBtn}
						onClick={() => {
							setModifyName(true);
							setShowModal('');
						}}
					>
						이름 변경하기
					</div>
					
					<div
						className={styles.modalBtn}
						onClick={() => {
							setShowNotionModal('B');
							setShowModal('');
						}}
					>
						약속에서 빠지기
					</div>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setShowNotionModal('T');
							setShowModal('');
						}}
					>
						약속 삭제하기
					</div>
				</div>
			)) ||
			(showTrash && type === 'p' && (
				<div style={style}>
					<div
						className={styles.modalBtn}
						onClick={() => {
							restoreApmt(selectedItemList);
							setShowModal('');
						}}
					>
						복원하기
					</div>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setShowNotionModal('B');
							setShowModal('');
						}}
					>
						약속에서 빠지기
					</div>
				</div>
			)) ||
			(type === 't' && (
				<div style={style}>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setShowNotionModal('BA');
							setShowModal('');
						}}
					>
						휴지통 비우기
					</div>
				</div>
			))
		);
	};

	//Bookmark Zone
	const bookmark = useCallback(async (promiseCode) => {
		try {
			const response = await axios.patch(
				`${process.env.REACT_APP_API_URL}/home/bookmark`,
				{
					isBookmark: 'T',
					promiseId: promiseCode.split('_')[0],
				},
			);
			console.log(response.data);
			// getData();
			await getData();
			// getDataAll(setApmtData, setBookmarkData);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
		console.log('북마크: ', promiseCode.split('_')[0]);
	}, []);

	const unBookmark = useCallback(async (promiseCode) => {
		try {
			const response = await axios.patch(
				`${process.env.REACT_APP_API_URL}/home/bookmark`,
				{
					isBookmark: 'F',
					promiseId: promiseCode.split('_')[0],
				},
			);
			console.log(response.data);
			await getData();
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
		console.log('북마크해제: ', promiseCode.split('_')[0]);
	}, []);

	const changeName = useCallback(async (promiseCode, changeNameVal) => {
		try {
			const response = await axios.patch(
				`${process.env.REACT_APP_API_URL}/home/promisename`,
				{
					promiseName: changeNameVal,
					promiseId: promiseCode.split('_')[0],
				},
			);
			console.log(response.data);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
		await getData();
		await closeModal();
	}, []);

	const handleClickOutside = (event) => {
		console.log(modalRef);
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			closeModal();
			closeNotionModal();
		}
		if (
			modalHeaderRef.current &&
			!modalHeaderRef.current.contains(event.target)
		) {
			setShowHeaderModal(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});


	const getData = async () => {
		console.log('getData (Not in useEffect) called');
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`,
			);
			// console.log(response.data)
			setBookmarkData(response.data.bookmark);
			setApmtData(response.data.promise);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	const getDatabyName = async () => {
		console.log('getData (Not in useEffect) called');
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=name`,
			);
			// console.log(response.data)
			setBookmarkData(response.data.bookmark);
			setApmtData(response.data.promise);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	useEffect(() => {
		const getData = async () => {
			console.log('getData called');
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`,
				);
				// console.log(response.data);
				setBookmarkData(response.data.bookmark);

				setApmtData(response.data.promise);
			} catch (error) {
				const errorResponse = error.response;
				console.log(errorResponse.data);
			}
		};
		if (accessToken) getData();
	}, []);

	useEffect(() => {
		const getTrashData = async () => {
			console.log('getTrashData called');
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_API_URL}/home/trash?sortBy=name`,
				);
				// console.log(response.data);
				setTrashData(response.data.trash);
			} catch (error) {
				const errorResponse = error.response;
				console.log(errorResponse.data);
			}
		};
		if (accessToken) getTrashData();
	}, []);

	const getTrashData = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/home/trash?sortBy=name`,
			);
			// console.log(response.data);
			setTrashData(response.data.trash);
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	const logout = async () => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/auth/logout`,
			);
			console.log(response.data);
			localStorage.removeItem('refreshToken');
			console.log('logout success');
			dispatch(setToken(''));
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
			if (errorResponse.data.statusCode === 1130) {
				dispatch(setToken(''));
				console.log('already logout');
			}
		}
	};
	const c = useCustomColor(8, 8);

	const [validLink, setValidLink] = useState(true);
	const checkLink = async () => {
		console.log('link', link);
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_API_URL}/promise/verify`,
				{
					linkOrCode: link.toLowerCase().includes('https://')
						? link.toLowerCase()
						: 'https://' + link.toLowerCase(),
				},
			);
			console.log(response.data);
			if (response.data.isValid === 1000) {
				// move to link
				window.location.href = link.toLowerCase();
			} else {
				// wkfahtehls zhem
				setValidLink(false);
			}
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
			if (errorResponse.data.statusCode === 4044) {
				setValidLink(false);
			}
		}
	};

	return (
		<div
			className={resizing ? styles.containerResizing : styles.container}
			onPointerMove={updateSize}
			onPointerUp={stopResizing}
			style={{overflowY: 'scroll' ,}}
			// style={{backgroundColor:c}}
		>
			{accessToken && sidebarShown && (
				<div className={styles.sidebarWrapper} style={{ flexBasis: size }}>
					<div className={styles.sidebarContent}>
						<div className={styles.sidebarHeader}>
							<div onClick={() => setsidebarShown(false)}>
								{svgList.headerIcon.headerHide}
							</div>
						</div>
						<div className={styles.sidebarMain}>
							<div
								className={styles.newApmt}
								onClick={() => (window.location.href = '/:user/newapmt')}
							>
								{<AiOutlineFileAdd size={20} />}
								<div className={styles.btnText}>새 약속 잡기</div>
							</div>
							<div
								className={size >= 300 ? styles.syncApmt : styles.syncApmtSmall}
								onClick = {()=>setPullNonRegisteredModel(true)}
							>
								{<IoSyncOutline size={20} color="#888888" />}
								<div className={styles.btnText}>
									비회원으로 참여한 {size < 300 && <div></div>} 약속 불러오기
								</div>
							</div>

							<div
								// className={styles.smallBtn}
								className={size >= 300 ? styles.syncApmt : styles.syncApmtSmall}
								onClick={() => setOpenFindModal(true)}
							>
								{svgList.folder.link} <div style={{ width: 4 }} />
								링크나 코드로 약속 참여하기
							</div>
							<div className={styles.searchContent}>
								<RiSearchLine
									size={18}
									color="#888888"
									className={styles.icon}
								/>
								<input
									value={searchApmtVal}
									name="searchApmt"
									placeholder="찾기"
									onChange={(e) => {
										setSearchApmtVal(e.target.value);
									}}
								></input>
								{searchApmtVal && (
									<TiDelete
										size={20}
										color="#D9D9D9"
										className={styles.x}
										onClick={() => {
											setSearchApmtVal('');
										}}
									/>
								)}
							</div>
							<div
								className={styles.btnArea}
								onClick={() => {
									navigate('/:user/allapmt', { state: { showTrash: false} });
									
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<BsGrid size={20} color="#888888" />
								</div>
								<div>전체 약속 리스트</div>
							</div>
							<div className={styles.labels}>
								즐겨찾기
								<div onClick={() => setOpenBookmark(!openBookmark)}>
									{openBookmark ? (
										<IoMdArrowDropdown
											color="#888888"
											size={15}
											style={{ marginTop: 3, marginLeft: 3 }}
										/>
									) : (
										<IoMdArrowDropup
											color="#888888"
											size={15}
											style={{ marginTop: 3, marginLeft: 3 }}
										/>
									)}
								</div>
							</div>
							{openBookmark && (
								<LayoutApmtList
									data={bookmarkData}
									fav={true}
									searchApmtVal={searchApmtVal}
									isTrash={false}
									selectedItemList={selectedItemList}
									changeName={changeName}
									modifyName={modifyName}
									setModifyName={setModifyName}
									bookmark={bookmark}
									unBookmark={unBookmark}
									openModal={openModal}
									handleShowTrash={handleShowTrash}
								/>
							)}
							<div className={styles.labelContainer} >
								<div className={styles.labels2}>내 약속</div>
								<div
									className={styles.btnArea}
									onClick={() => {
										handleSortItem();
									}}
								>
									{sortItem === 'name'
										? svgList.headerIcon.sortbyName
										: svgList.headerIcon.sortbyDay}
								</div>
							</div>
							<LayoutApmtList
								data={ApmtData}
								fav={false}
								searchApmtVal={searchApmtVal}
								isTrash={false}
								selectedItemList={selectedItemList}
								changeName={changeName}
								modifyName={modifyName}
								setModifyName={setModifyName}
								bookmark={bookmark}
								unBookmark={unBookmark}
								openModal={openModal}
								handleShowTrash={handleShowTrash}
								
							/>
						</div>
					</div>
					<div
						onPointerDown={startResizing}
						className={styles.sidebarBorder}
						onDoubleClick={reset}
					></div>
				</div>
			)}
			<div className={styles.mainWrapper}>
				{head && (
					<header
						className={styles.headerWrapper}
						id={head === 'trans' ? styles.trans : ''}
					>
						<div className={styles.headerBtnLeft}>
							{accessToken && !sidebarShown && (
								<div onClick={() => setsidebarShown(true)}>
									{svgList.headerIcon.headerShow}
								</div>
							)}
						</div>
						<div
							className={styles.headerCenter}
							onClick={() => {
								window.location.href = '/:user';
							}}
						>
							{svgList.logoIcon.logo}
							{devMode && (
								<div
									onClick={() => {
										dispatch(setToken(''));
									}}
								>
									리덕스 로그아웃
								</div>
							)}
						</div>
						{accessToken && (
							<div className={styles.headerBtnRight}>
								<div
									onClick={() => {
										window.location.href = '/:user/allapmt';
									}}
								>
									{' '}
									<BsGrid size={28} color="#888888" />
								</div>
								<div
									onClick={() => {
										setShowHeaderModal(true);
									}}
								>
									<CgProfile size={28} color="#888888" />
								</div>
							</div>
						)}
						{!accessToken && (
							<div className={styles.headerBtnRightNONMEMBER}>
								<div
									onClick={() => {
										if (
											window.location.href.toLowerCase().includes('apmtdetail')
										) {
											let code = window.location.href
												.toLowerCase()
												.split('apmtdetail/:')[1];
											console.log(code);
											localStorage.setItem(
												'originURL',
												`3000/:user/apmtdetail/:${code}`,
											);
										}
										window.location.href = `/login`;
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
						)}
					</header>
				)}
				<Outlet />
			</div>
			{showModal && (
				<div ref={modalRef} style={modalStyle} className={styles.modal}>
					<ContextMenuModal
						onClose={closeModal}
						type={showModal}
						showTrash={showTrash}
						selectedItemList={selectedItemList}
					/>
				</div>
			)}
			{showNotionModal !== '' && (
				<div ref={notionModalRef}>
					<NotionModal
						onClose={closeNotionModal}
						contextClose={closeModal}
						type={showNotionModal}
						selectedItemList={selectedItemList}
						setShowNotionModal={setShowNotionModal}
						backoutApmt={backoutApmt}
						moveApmtToTrash={moveApmtToTrash}
						backoutAll={backoutAll}
					/>
				</div>
			)}
			{showHeaderModal && (
				<div ref={modalHeaderRef} className={styles.headermodal}>
					<div
						className={styles.modalBtn}
						onClick={() => {
							setMypageModal('serviceTerms');
						}}
					>
						내 정보
					</div>
					<div className={styles.modalBtn} onClick={logout}>
						로그아웃
					</div>
				</div>
			)}
			{mypageModal === 'serviceTerms' && (
				<MyInfoModal
					onClose={() => toggleModal(null)}
					changePW={setMypageModal}
				>
					내 정보 모달
				</MyInfoModal>
			)}
			{mypageModal === 'marketing' && (
				<PWChangeModal onClose={() => toggleModal(null)}>
					비밀번호 변경 모달
				</PWChangeModal>
			)}
			{openFindModal && (
				<ApmtShareModal
					onClose={() => {
						setOpenFindModal(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,
						}}
					>
						링크나 코드로 약속 참여하기
					</div>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
						}}
					>
						<input
							// placeholdercolor 설정 : #888888
							type="text"
							style={{
								width: '100%',
								marginTop: 20,
								padding: '3px 20px 3px 1px',
								border: 'none',
								borderBottom: '1px solid #D0D0D0',
								fontSize: 15,
								color: '#222222',
								fontWeight: 400,
								outline: 'none',
							}}
							placeholder="약속의 링크나 코드"
							value={link}
							onChange={(e) => setLink(e.target.value.trim())}
						/>
						<div
							style={{
								position: 'absolute',
								right: 0,
								bottom: 4,
								cursor: 'pointer',
							}}
							onClick={() => {
								setLink('');
							}}
						>
							{svgList.loginIcon.delBtn}
						</div>
					</div>
					{!validLink && (
						<div
							style={{
								marginTop: 13,
								color: '#FF0000',
								fontSize: 13,
								fontWeight: '400',
							}}
						>
							올바른 링크/코드가 아니에요.
						</div>
					)}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#8E66EE',
							width: 260,
							borderRadius: 5,
							padding: 12,
							color: 'white',
							fontSize: 15,
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: validLink ? 42 : 22,
						}}
						onClick={() => {
							checkLink();
						}}
						

					>
						확인
					</div>
				</ApmtShareModal>
			)}
			{pullNonRegisteredModal && (
				<ApmtShareModal
					onClose={() => {
						closeModal();
						
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,
						}}
					>
						비회원으로 참여한 약속 불러오기
					</div>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
						}}
					>
						<input
							// placeholdercolor 설정 : #888888
							type="text"
							style={{
								width: '100%',
								marginTop: 20,
								padding: '3px 20px 3px 1px',
								border: 'none',
								borderBottom: '1px solid #D0D0D0',
								fontSize: 15,
								color: '#222222',
								fontWeight: 400,
								outline: 'none',
							}}
							placeholder="참여했던 약속의 링크나 코드"
							value={nonRegLink}
							onChange={(e) => setNonRegLink(e.target.value.trim())}
						/>
						<div
							style={{
								position: 'absolute',
								right: 0,
								bottom: 4,
								cursor: 'pointer',
							}}
							onClick={() => {
								setNonRegLink('');
							}}
						>
							{svgList.loginIcon.delBtn}
						</div>
					</div>
					<div className={styles2.alertZone}>
						<div
							className={`${styles2.errorMsg} ${
								linkVerified===false ? '' : styles2.hidden
							}`}>
							<div className={styles2.message}>
								올바른 링크/코드가 아니에요.
							</div>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#8E66EE',
							width: 260,
							borderRadius: 5,
							padding: 12,
							color: 'white',
							fontSize: 15,
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: 42,
						}}
						onClick={() => {
							handleLinkVerified(nonRegLink);
							//valid 한 비회원으로 참여한 약속인 경우에
						}}
					>
						확인
					</div>
				</ApmtShareModal>
			)}
			{pullApmtModal &&(
				<ApmtShareModal
				 onClose={() => {
					closeModal();
				}}
				>
					<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,
							padding: 10,
							marginRight: 20,
							marginLeft:20,
						}} >비회원으로 참여한 약속 불러오기</div>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,

						}}>{apmtName}</div>
					<div
						style={{
							position: 'relative',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
						}}
					>
						<input
							// placeholdercolor 설정 : #888888
							type="text"
							style={{
								width: '100%',
								marginTop: 20,
								padding: '3px 20px 3px 1px',
								border: 'none',
								borderBottom: '1px solid #D0D0D0',
								fontSize: 15,
								color: '#222222',
								fontWeight: 400,
								outline: 'none',
							}}
							placeholder="이름"
							value={name}
							onChange={(e) => setName(e.target.value.trim())}
						/>
						<div
							style={{
								position: 'absolute',
								right: 0,
								bottom: 48,
								cursor: 'pointer',
							}}
							onClick={() => {
								setName('');
							}}
						>
							{svgList.loginIcon.delBtn}
						</div>

						<input
							// placeholdercolor 설정 : #888888
							type="text"
							style={{
								width: '100%',
								marginTop: 20,
								padding: '3px 20px 3px 1px',
								border: 'none',
								borderBottom: '1px solid #D0D0D0',
								fontSize: 15,
								color: '#222222',
								fontWeight: 400,
								outline: 'none',
							}}
							placeholder="(선택사항) 비밀번호"
							value={pw}
							onChange={(e) => setPW(e.target.value.trim())}
						/>
						<div
							style={{
								position: 'absolute',
								right: 0,
								bottom: 4,
								cursor: 'pointer',
							}}
							onClick={() => {
								setPW('');
							}}
						>
							{svgList.loginIcon.delBtn}
						</div>
						</div>
						<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#8E66EE',
							width: 260,
							borderRadius: 5,
							padding: 12,
							color: 'white',
							fontSize: 15,
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: 42,
						}}
						onClick={() => {
							handlePostApmt(nonRegLink);
							//valid 한 비회원으로 참여한 약속인 경우에
						}}
					>
						확인
					</div>

				</ApmtShareModal>
				)}
				{pullSuccessModal && (
					<ApmtShareModal
					 onClose={()=> {
						closeModal();
					}}>
					<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,
						}}>내 약속 목록에 {apmtName}을(를) 불러왔어요.</div>
												<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#8E66EE',
							width: 260,
							borderRadius: 5,
							padding: 12,
							color: 'white',
							fontSize: 15,
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: 42,
						}}
						onClick={() => {
							closeModal();
							setApmtName('');
							//valid 한 비회원으로 참여한 약속인 경우에
						}}
					>
						확인
					</div></ApmtShareModal>
				)}
				{
					neverJoinModal && (
						<ApmtShareModal
						 onClose={()=> {
							closeModal();
							setApmtName('');
						}}>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,
							// marginLeft: 20,
							paddingLeft: 50,
							paddingRight: 50,
						}}>참여한 적 없는 약속이에요.</div>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							color: '#222222',
							fontSize: 15,
							fontWeight: 400,
							marginTop: 10,
							paddingLeft: 50,
							paddingRight: 50,
						}}>{apmtName}에 참여하시겠어요?</div>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
												<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'white',
							width: 100,
							borderRadius: 5,
							padding: 12,
							border: "1px solid #8E66EE",
							color: '#8E66EE',
							fontSize: 15,
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: 42,
							marginRight: 10,

						}}
						onClick={() => {
							closeModal();
							setApmtName('');
							//valid 한 비회원으로 참여한 약속인 경우에
						}}
					>
						아니요.
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#8E66EE',
							width: 150,
							borderRadius: 5,
							padding: 12,
							color: 'white',
							fontSize: 15,
							fontWeight: 400,
							cursor: 'pointer',
							marginTop: 42,
						}}
						onClick={() => {
							handleJoinApmt(nonRegLink);
							closeModal();
							setApmtName('');
							//valid 한 비회원으로 참여한 약속인 경우에
						}}
					>
						네, 참여할게요.
					</div>
						</div>

						</ApmtShareModal>
					)
				}
		</div>
	);
};

export default Layout;
