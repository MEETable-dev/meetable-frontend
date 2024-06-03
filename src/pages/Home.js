import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../css/Home.module.css';
import CalendarMine from '../components/CalendarMine';
import { svgList } from 'assets/svg';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { IoSyncOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';
import ApmtShareModal from 'components/ApmtShareModal';
import HomeSchDetail from '../components/HomeSchDetail';

const Home = () => {
	const [reset, setReset] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [selectWeek, setSelectWeek] = useState(new Date());
	const [data, setData] = useState([]);
	const [cnt, setCnt] = useState(0);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [link, setLink] = useState('');

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
		getData();
	}, [reset, cnt]);

	const getData = async () => {
		console.log('getData called');
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`,
			);
			console.log(response.data);
			setData(response.data.bookmark.slice(0, cnt));
		} catch (error) {
			const errorResponse = error.response;
			console.log(errorResponse.data);
		}
	};

	const unBookmark = async (promiseCode) => {
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
	};

	useEffect(() => {
		setCnt(Math.floor((windowWidth - 380) / 270));
		console.log(Math.floor((windowWidth - 380) / 270));
	}, [windowWidth]);

	return (
		<div className={styles.entire}>
			<div className={styles.btnView}>
				<div className={styles.funcBtnView}>
					{/* <div className={styles.bigBtn}>
						{<AiOutlineFileAdd size={20} />} <div style={{ width: 4 }} />새 약속
						잡기
					</div> */}
					<div className={styles.smallBtn} onClick={() => setOpenModal(true)}>
						{svgList.folder.link} <div style={{ width: 4 }} />
						링크나 코드로 약속 참여하기
					</div>
					{/* <div className={styles.smallBtn}>
						{<IoSyncOutline size={20} color="#888888" />}{' '}
						<div style={{ width: 4 }} />
						비회원으로 참여한 약속 불러오기
					</div> */}
				</div>
				<div className={styles.favBtnView}>
					{data.map((item, index) => (
						<div
							className={styles.favBtn}
							key={index}
							onClick={() => {
								window.location.href = `/apmtdetail/:${item.promiseCode}`;
							}}
						>
							{item.weekvsdate != 'W' ? (
								<img
									src={require('../assets/promiseImgMonth.png')}
									width={108}
									height={105}
								/>
							) : (
								<img
									src={require('../assets/promiseImgWeek.png')}
									width={160}
									height={60}
								/>
							)}
							<div className={styles.favBtnLabel}>
								<AiFillStar
									color="#FFBB0D"
									size={22}
									onClick={() => {
										unBookmark(item.promiseCode);
									}}
								/>
								<div style={{ width: 4 }} />
								{item.promiseName}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className={styles.titleView}>내 캘린더</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<CalendarMine selectWeek={selectWeek} setSelectWeek={setSelectWeek} />
				<div style={{ width: 10 }} />
				<HomeSchDetail></HomeSchDetail>
			</div>
			{openModal && (
				<ApmtShareModal
					onClose={() => {
						setOpenModal(false);
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
							if (link.toLowerCase().includes('tail/')) {
								window.open(
									':username/apmtdetail/:' +
										link.split('tail/')[1].replace(':', ''),
								);
							} else {
								window.open(':username/apmtdetail/:' + link);
							}
						}}
					>
						확인
					</div>
				</ApmtShareModal>
			)}
		</div>
	);
};

export default Home;
