import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../css/Home.module.css';
import CalendarMine from '../components/CalendarMine';
import { AiFillStar } from 'react-icons/ai';
import { svgList } from "../assets/svg";
import { format, parseISO, addDays, subDays, isValid } from 'date-fns';
import AddSchModal from "../components/AddSchModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import UpdateSch from "../components/UpdateSch";

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
  const [selectedSchDetail, setSelectedSchDetail] = useState(null); // 선택된 스케줄 상태 추가

  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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


  const getDetail = async () => {
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
      await window.location.reload();
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

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/calendar/scheduleinfo`,
        {
          params: { month: month },
        }
      );
      setSelectedDateSchedules(response.data[format(parsedDate, 'yyyy-MM-dd')] || []);
	    console.log('schedule is', response.data);
    } catch (error) {
      console.log(error.response.data);
      setSelectedDateSchedules([]);
    }

    setSelectedSchedule(null);
  };

  const handleScheduleSelect = async (schedule) => {

    if (selectedSchedule === schedule && selectedSchedule) {
      setIsOpen(!isOpen);
    } else {
      setSelectedSchedule(schedule); // 스케줄 선택 시 상태 업데이트
      setIsOpen(true);
      setEditMode(false);
    }

    try {
      const response2 = await axios.get(
        `${process.env.REACT_APP_API_URL}/calendar/detail`,
        {
          params: { calendarId: schedule.id }
        }
      );
      console.log('schedule detail is', response2.data);
      setSelectedSchDetail(response2.data);
    } catch (error) {
      console.log(error.response.data);
    }
    
  };

  const handleEditMode = () => {
    setEditMode(!editMode);

    // 선택한 날짜의 스케줄 상세 정보 불러오기 - 실험
    if (editMode) {


    }

  };

//   const handleIsOpen = () => {
// 	setIsOpen(!isOpen);
//   };

  const handlePrevDay = () => {
    const newDate = subDays(selectedDate || new Date(), 1);
	setSelectedDate(newDate);
	setSelectWeek(newDate);
    handleDateSelect(newDate);
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate || new Date(), 1);
	setSelectedDate(newDate);
	setSelectWeek(newDate);
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
          selectedDate={selectedDate} // 추가된 부분
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
            <p className={styles.goToBtn}>
              <svg className={styles.hoverButton} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.4231 15.0831C2.00216 15.0831 1.64585 14.9373 1.35419 14.6456C1.06252 14.354 0.916687 13.9977 0.916687 13.5767V2.42292C0.916687 2.00198 1.06252 1.64567 1.35419 1.354C1.64585 1.06234 2.00216 0.916504 2.4231 0.916504H7.67946V2.16648H2.4231C2.35899 2.16648 2.30022 2.19319 2.24679 2.24661C2.19337 2.30004 2.16667 2.35881 2.16667 2.42292V13.5767C2.16667 13.6408 2.19337 13.6996 2.24679 13.753C2.30022 13.8064 2.35899 13.8332 2.4231 13.8332H13.5769C13.641 13.8332 13.6998 13.8064 13.7532 13.753C13.8066 13.6996 13.8333 13.6408 13.8333 13.5767V8.32036H15.0833V13.5767C15.0833 13.9977 14.9375 14.354 14.6458 14.6456C14.3541 14.9373 13.9978 15.0831 13.5769 15.0831H2.4231ZM6.09935 10.7787L5.22117 9.90046L12.9551 2.16648H9.66667V0.916504H15.0833V6.33315H13.8333V3.04467L6.09935 10.7787Z" fill="#222222"/>
              </svg>
            </p>
                  </div>
          { selectedSchedule === schedule ? 
            <div 
            className={styles.editBtns} onClick={() => handleEditMode(true)}
            >
            {svgList.schDetailIcon.pencilBtn}
            </div> : null
          }
          { selectedSchedule === schedule ? 
            <div className={styles.editBtns} onClick={() => { handleDelID(schedule.id) }}>
              {svgList.schDetailIcon.trashBtn}
            </div> : null
          }
                </div>
                {selectedSchedule && selectedSchedule.id === schedule.id && !editMode && isOpen && (
                  <div className={styles.schInfo}>
            {/* 시간 */}
            <div className={styles.contentArea}>
              <div className={styles.contentName}> 
                {svgList.addSchModal.clockIcon} 
              </div>
              {selectedSchDetail ?
              <div className={styles.contentInput}>
                {selectedSchDetail.times.map((time, index) => {
                  const startTimeParts = time.startTime.split(':');
                  const endTimeParts = time.endTime.split(':');

                  // 시간과 분을 2자릿수로 맞추기
                  const startHour = startTimeParts[0].padStart(2, '0');
                  const startMinute = startTimeParts[1].padStart(2, '0');

                  const endHour = endTimeParts[0].padStart(2, '0');
                  const endMinute = endTimeParts[1].padStart(2, '0');

                  const date = new Date(time.date);
                  const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'long' });
                  
                  const formattedDate = `${date.getFullYear().toString().slice(2)}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

                  return (
                    <div className={styles.timeCollectInput} key={index}>
                      {selectedSchDetail.isReptition === 'T' ? (
                        `${dayOfWeek} ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`
                      ) : (
                        `${formattedDate} ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`
                      )}
                    </div>
                  );
                })}
              </div> : null}
            </div>
            {/* 반복 */}
            <div className={styles.contentArea}>
              <div className={styles.contentName}> {svgList.addSchModal.retryIcon} </div>
              {selectedSchDetail ? (
                <div className={styles.contentInput}>
                  <div className={styles.timeCollectInput}>
                    {selectedSchDetail.isReptition === 'T' ? (
                      `${selectedSchDetail.reptitionCycle}주마다, 
                      ${selectedSchDetail.isContinuous === 'T'
                          ? '계속 반복'
                          : `${
                              selectedSchDetail.reptitionTime === 1
                                ? `${selectedSchDetail.endDate.slice(2, 10).split('-')[0]}년 ${selectedSchDetail.endDate.slice(2, 10).split('-')[1]}월 ${selectedSchDetail.endDate.slice(2, 10).split('-')[2]}일까지 반복`
                                : `${selectedSchDetail.reptitionTime}회 반복`
                            }`
                      }`) : ('반복 없음')}
                  </div>
                </div>
              ) : null}
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
          </div> )}
          {selectedSchedule && selectedSchedule.id === schedule.id && editMode && isOpen && (
          <UpdateSch
            onClose={() => {
              handleEditMode();
              window.location.reload();  // 창을 새로고침
            }}
            targetSch={selectedSchedule}
            targetSchDetail={selectedSchDetail}
            idSch={selectedSchedule.id}
          />
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

	  {mypageModal === 'serviceTerms' && <AddSchModal onClose={() => toggleModal(null)} defaultDate={selectedDate}>
        내 정보 모달
      </AddSchModal>}
	  {mypageModal === 'deleteConfirm' && <DeleteConfirmModal onClose={() => toggleModal(null)} delID={delID}>
        삭제 확인 모달
      </DeleteConfirmModal>}
    </div>
  );
};

export default Home;
