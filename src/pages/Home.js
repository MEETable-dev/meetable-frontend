import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../css/Home.module.css';
import CalendarMine from '../components/CalendarMine';
import { AiFillStar } from 'react-icons/ai';
import { svgList } from "../assets/svg";
import { format, parseISO, addDays, subDays, isValid } from 'date-fns';
import AddSchModal from "../components/AddSchModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

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

const Home = () => {
  const [reset, setReset] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectWeek, setSelectWeek] = useState(new Date());
  const [data, setData] = useState([]);
  const [cnt, setCnt] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   const today = new Date();
//   const [selectedDay, setSelectedDay] = useState(format(today, 'yyyy-MM-dd')); // 선택된 날짜 상태 추가
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateSchedules, setSelectedDateSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null); // 선택된 스케줄 상태 추가

  const [editMode, setEditMode] = useState(false);
  const [delID, setDelID] = useState(null);
  const [mypageModal, setMypageModal] = useState(null);

  const handleDelID = (id) => {
	setDelID(id);
	setMypageModal('deleteConfirm');
  }

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
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`,
      );
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
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data);
    }
  };

  useEffect(() => {
    setCnt(Math.floor((windowWidth - 300) / 270));
  }, [windowWidth]);

  useEffect(() => {
	handleDateSelect(selectedDate);
  }, []);

  const handleDateSelect = async (date) => {
    console.log("Selected date: ", date);
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) {
      console.error("Invalid date selected:", date);
      return;
    }
    setSelectedDate(parsedDate);

    const month = format(parsedDate, 'yyyy-MM');

    // 날짜와 월에 해당하는 스케줄 정보 가져오기
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/calendar/scheduleinfo`,
        {
          params: { month: month },
        }
      );
      setSelectedDateSchedules(response.data[format(parsedDate, 'yyyy-MM-dd')] || []);
	  console.log('schedule is', response.data[format(parsedDate, 'yyyy-MM-dd')]);
    } catch (error) {
      console.log(error.response.data);
      setSelectedDateSchedules([]);
    }
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule); // 스케줄 선택 시 상태 업데이트
	setEditMode(false);
  };

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handlePrevDay = () => {
    const newDate = subDays(selectedDate || new Date(), 1);
    handleDateSelect(newDate);
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate || new Date(), 1);
    handleDateSelect(newDate);
  };

  useEffect(() => {
    if (mypageModal === 'serviceTerms') {
      console.log("모달이 열렸습니다.");
    } else {
      console.log("모달이 닫혔습니다.");
    }
	
	if (mypageModal === 'deleteConfirm') {
		console.log("확인 모달이 열렸습니다.");
	} else {
		console.log("확인 모달이 닫혔습니다.");
	}

  }, [mypageModal]);

  const toggleModal = (modalId) => {
    if (mypageModal !== null && modalId === null) {
      window.location.reload();
    }
    setMypageModal(mypageModal === modalId ? null : modalId);
  };

  return (
    <div className={styles.entire}>
      <div className={styles.btnView}>
        <div className={styles.favBtnView}>
          {data.map((item, index) => (
            <div
              className={styles.favBtn}
              key={index}
              onClick={() => {
                window.location.href = `/apmtdetail/:${item.promiseCode}`;
              }}
            >
              {item.weekvsdate !== 'W' ? (
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
        <CalendarMine 
          selectWeek={selectWeek} 
          setSelectWeek={setSelectWeek} 
          onDateSelect={handleDateSelect} 
        />
        <div style={{ width: 10 }} />
        <div className={styles.homeSchDetail}>
          <div className={styles.headerCenter}>
            <div className={styles.toAnotherMonth} onClick={handlePrevDay}>
              {svgList.schDetailIcon.prevDay}
            </div>
            <div className={styles.headerText}>
              {isValid(selectedDate) ? `${format(selectedDate, 'yy')}년 ${format(selectedDate, 'M')}월 ${format(selectedDate, 'd')}일` : ''}
            </div>
            <div className={styles.toAnotherMonth} onClick={handleNextDay}>
              {svgList.schDetailIcon.nextDay}
            </div>
          </div>
          {selectedDateSchedules.map((schedule, index) => (
            <div key={index} className={styles.schList}>
              <div
                className={styles.eachSch}
				style={{ backgroundColor: colors[schedule.color].backgroundColor }}
              >
                <div className={styles.schName} onClick={() => handleScheduleSelect(schedule)}>
                  {schedule.name}
                  <p className={styles.goToBtn}>{svgList.schDetailIcon.goToBtn}</p>
                </div>
                <div 
                  className={styles.editBtns} onClick={() => handleEditMode(true)}
                >
                  {svgList.schDetailIcon.pencilBtn}
                </div>
				<div className={styles.editBtns} onClick={() => { handleDelID(schedule.id) }}>
					{svgList.schDetailIcon.trashBtn}
				</div>
              </div>
              {selectedSchedule && selectedSchedule.id === schedule.id && !editMode && (
                <div className={styles.schInfo}>
					{/* 시간 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}> {svgList.addSchModal.clockIcon} </div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								N시 N분
							</div>
						</div>
					</div>
					{/* 반복 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}> {svgList.addSchModal.retryIcon} </div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								{selectedSchedule.isreptition ? 'Yes' : '반복 없음'}
							</div>
						</div>
					</div>
					{/* 장소 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}> {svgList.addSchModal.mapIcon} </div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								{selectedSchedule.place ? selectedSchedule.place : '-'}
							</div>
						</div>
					</div>
					{/* 메모 */}
					<div className={styles.contentArea}>
						<div className={styles.contentName}> {svgList.addSchModal.memoIcon} </div>
						<div className={styles.contentInput}>
							<div className={styles.timeCollectInput}>
								{selectedSchedule.memo ? selectedSchedule.memo : '-'}
							</div>
						</div>
					</div>
                  {/* <p>Schedule Times: {selectedSchedule.scheduleTimes}</p>
                  <p>Repetition Cycle: {selectedSchedule.reptitioncycle}</p>
                  <p>Is Continuous: {selectedSchedule.iscontinuous ? 'Yes' : 'No'}</p>
                  <p>Repetition Time: {selectedSchedule.reptition_time}</p>
                  <p>End Date: {selectedSchedule.end_date}</p> */}
                </div>
              )}
			{selectedSchedule && selectedSchedule.id === schedule.id && editMode && (
                <div className={styles.schEdit}>
                  edit mode
                </div>
              )}
            </div>
          ))}
			<div className={styles.addSch}>
                <div className={styles.schName}>
                  <p onClick={() => { setMypageModal('serviceTerms') }}>
					<svg className={styles.hoverButton} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#D0D0D0" />
					<path d="M7.4872 8.51291H3.55556V7.4873H7.4872V3.55566H8.51281V7.4873H12.4444V8.51291H8.51281V12.4446H7.4872V8.51291Z" fill="#888888" />
					</svg>
				  </p>
				  일정 추가하기
                </div>
			</div>
        </div>
      </div>

	  {mypageModal === 'serviceTerms' && <AddSchModal onClose={() => toggleModal(null)} changePW={setMypageModal}>
        내 정보 모달
      </AddSchModal>}
	  {mypageModal === 'deleteConfirm' && <DeleteConfirmModal onClose={() => toggleModal(null)} delID={delID}>
        삭제 확인 모달
      </DeleteConfirmModal>}
    </div>
  );
};

export default Home;
