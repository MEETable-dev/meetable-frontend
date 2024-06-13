import { useState, useEffect } from 'react';
import styles from '../css/CalendarMine.module.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameWeek, subDays, addDays, parse, isBefore } from 'date-fns'
import { AiOutlineCalendar } from "react-icons/ai";
import AddSchModal from "../components/AddSchModal"
import axios from "axios";;

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

const CalendarMine = (props) => {
  const { selectWeek, setSelectWeek } = props;
  const [schedules, setSchedules] = useState({});

  const getSchInfo = async (month) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/calendar/scheduleinfo`, {
        params: { month: month }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
    }
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      const month = format(selectWeek, 'yyyy-MM');
      const fetchedSchedules = await getSchInfo(month);
      setSchedules(fetchedSchedules);
    };

    fetchSchedules();
  }, [selectWeek]);

  // 새로운 상태 hoveredDay 추가
  const [hoveredDay, setHoveredDay] = useState(null);

  const [mypageModal, setMypageModal] = useState(null); // New state for tracking open modal

  // 모달 상태 변화 감지 -> 효과 X...
  useEffect(() => {
    if (mypageModal === 'serviceTerms') {
      console.log("모달이 열렸습니다.");
      // 모달이 열릴 때 실행할 추가 작업
    } else {
      console.log("모달이 닫혔습니다.");
      // 모달이 닫힐 때 실행할 추가 작업
    }
  }, [mypageModal]);

  const toggleModal = (modalId) => {
    if (mypageModal !== null && modalId === null) {
      // 모달이 닫힐 때 페이지를 새로고침합니다.
      window.location.reload();
    }
    setMypageModal(mypageModal === modalId ? null : modalId);
  };
  

  const Body = ({ selectWeek }) => {
    const monthStart = startOfMonth(selectWeek);
    const monthEnd = endOfMonth(selectWeek);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      let days = [];
      for (let i = 0; i < 7; i++) {
        const dayKey = format(day, 'yyyy-MM-dd');
        const formattedDate = format(day, 'd');
        const daySchedules = schedules[dayKey] || [];

        const isNotThisMonth = format(day, 'M') !== format(monthStart, 'M'); // Check if the day is not in the current month
        const dateHeaderClass = `${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'dateHeaderToday' : 'dateHeader'}`;
    
        days.push(
          <div
            className={styles.eachDay}
            key={day}
            onMouseEnter={() => setHoveredDay(dayKey)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <div className={styles.col}>
              <div className={`${styles[dateHeaderClass]} ${isNotThisMonth ? styles.notThisMonth : ""}`}>{formattedDate}</div>
              {/* 조건부 렌더링으로 hoveredDay와 현재 day가 같을 때 버튼 표시 */}
              
              {/* 누르면 일정 추가 모달 뜨게 */}
              {hoveredDay === dayKey && (
                <svg className={styles.hoverButton} onClick={()=>{setMypageModal('serviceTerms')}} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#D0D0D0"/>
                  <path d="M7.4872 8.51291H3.55556V7.4873H7.4872V3.55566H8.51281V7.4873H12.4444V8.51291H8.51281V12.4446H7.4872V8.51291Z" fill="#888888"/>
                </svg>
              )}
            </div>
            {/* ex!! 백앤드 연결 후 정보 불러와서 날짜별로 유효한 일정만 추가하기!!!!! 아래는 예제 */}
            {daySchedules.map((schedule, index) => (
              <div key={index} className={styles.eachSch} style={{ backgroundColor: colors[schedule.color].backgroundColor }}>
                {schedule.name}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className={styles.dayContent} key={day}>{days}</div>
      );
    }

    return <div className={styles.body}>{rows}</div>;
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(()=>{
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const [selectDate, setSelectDate] = useState(new Set());
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const DivDates = [];
  
  for (let i = 0; i < 7; i++) {
    DivDates.push(
      // <div className={styles.colDays} style={getStyles()}>
      <div className={styles.colDays}>
        {days[i]}
      </div>
    )
  }

  const prevMonth = () => {
    setSelectWeek(subMonths(selectWeek, 1));
  };
  const nextMonth = () => {
    setSelectWeek(addMonths(selectWeek, 1));
  };
  const onDateClick = (day) => {
    if (selectDate.has(format(day, 'yyyy-MM-dd'))) {
      setSelectDate(prevState => {
        prevState.delete(format(day, 'yyyy-MM-dd'));
        return new Set(prevState);
      })
    }
    else {
      setSelectDate(prevState => new Set([...prevState, format(day, 'yyyy-MM-dd')]));
    }
  }

  return <div className={styles.entire} style={
    (windowWidth <= 900)
    ? {marginLeft:'1.8vw', marginRight:'1.8vw', width:'66.6vw'}
    : {width:'600px'}
  }>
    
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}></div>
      <div className={styles.headerCenter}>
        <div className={styles.toAnotherMonth} onClick={prevMonth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9883 16.2403L13.0527 15.1759L6.87677 8.99989L13.0527 2.82392L11.9883 1.75952L4.74796 8.99989L11.9883 16.2403Z" fill="#888888"/>
          </svg>
        </div>
        <div className={styles.headerText}>
          {format(selectWeek, 'yy')}년 {format(selectWeek, 'M')}월
        </div>
        <div className={styles.toAnotherMonth} onClick={nextMonth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.01167 16.2403L4.94727 15.1759L11.1232 8.99989L4.94727 2.82392L6.01167 1.75952L13.252 8.99989L6.01167 16.2403Z" fill="#888888"/>
          </svg>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.TodayBtn} onClick={()=>{setSelectWeek(new Date())}}>오늘</div>
      </div>
    </div>
    <div className={styles.bodyContainer}>
      <div className={styles.DaysOfWeek}>{DivDates}</div>
      <div className={styles.body}><Body selectWeek={selectWeek} selectDate={selectDate} onDateClick={onDateClick} /></div>
    </div>

    {/* 일정 추가 모달 띄우기 */}
    {mypageModal === 'serviceTerms' && <AddSchModal onClose={() => toggleModal(null)} changePW={setMypageModal}>
      내 정보 모달
    </AddSchModal>}
  </div>
};

export default CalendarMine;