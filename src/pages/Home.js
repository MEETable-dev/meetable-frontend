import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../css/Home.module.css';
import CalendarMine from '../components/CalendarMine';
import { svgList } from 'assets/svg';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { IoSyncOutline } from 'react-icons/io5';
import { AiFillStar } from 'react-icons/ai';

const Home = () => {
	const [reset, setReset] = useState(false);
	const [selectWeek, setSelectWeek] = useState(new Date());
	const [data, setData] = useState([]);
	const [cnt, setCnt] = useState(0);
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
					<div className={styles.bigBtn}>
						{<AiOutlineFileAdd size={20} />} <div style={{ width: 4 }} />새 약속
						잡기
					</div>
					<div className={styles.smallBtn}>
						{svgList.folder.link} <div style={{ width: 4 }} />
						링크나 코드로 약속 참여하기
					</div>
					<div className={styles.smallBtn}>
						{<IoSyncOutline size={20} color="#888888" />}{' '}
						<div style={{ width: 4 }} />
						비회원으로 참여한 약속 불러오기
					</div>
				</div>
				<div className={styles.favBtnView}>
					{data.map((item, index) => (
						<div className={styles.favBtn} key={index}>
							img
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
			<CalendarMine selectWeek={selectWeek} setSelectWeek={setSelectWeek} />
		</div>
	);
};

export default Home;
