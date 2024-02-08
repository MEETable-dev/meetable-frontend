import { useState, useEffect } from 'react';
import styles from '../css/CalendarMine.module.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameWeek, subDays, addDays, parse, isBefore } from 'date-fns'
import { AiOutlineCalendar } from "react-icons/ai";

const not = '2023-12-05';

const CalendarMine = (props) => {
  let selectWeek = props.selectWeek;
  let setSelectWeek = props.setSelectWeek;
  // const Body = ({selectWeek, selectDate}) => {
  //   const monthStart = startOfMonth(selectWeek);
  //   const monthEnd = endOfMonth(selectWeek);
  //   const startDate = startOfWeek(monthStart);
  //   const endDate = endOfWeek(monthEnd);
    
  //   const rows = [];
  //   let day = startDate;
  //   let formattedDate = '';
    
  //   while (day <= endDate) {
  //     let days = [];
  //     for (let i = 0; i < 7; i++) {
  //       formattedDate = format(day, 'd');
  //       const cloneDay = day;
  //       days.push(
  //         <div className={styles.eachDay} key={day}>
  //           <div className={styles.col}>
  //             <div className={styles[format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'dateHeaderToday' : 'dateHeader']}>{formattedDate}</div>
  //           </div>
  //           <div
  //             className={
  //               selectDate.has(format(day, 'yyyy-MM-dd'))
  //               ? `${styles.day} ${styles.selected}`
  //               : format(day, 'yyyy-MM-dd') !== not
  //               ? `${styles.day} ${styles.valid}`
  //               : `${styles.day} ${styles.disabled}`
  //             }
  //             onClick={() => {
  //               setSelectWeek(cloneDay);
  //             }}
  //           >
  //           </div>
  //         </div>
  //       );
  //       day = addDays(day, 1);
  //     }
  //     rows.push(
  //       <div
  //         className={`${styles.dayContent} ${isSameWeek(selectWeek, subDays(day, 1)) ? styles.weekSelected : styles.week} ${styles.dateBox}`}
  //         key={'Week'+day}
  //       >
  //         {days}
  //       </div>
  //     );
  //   }
  //   return <div className={styles.body}>{rows}</div>;
  // }
  const Body = ({ selectWeek, selectDate }) => {
    const monthStart = startOfMonth(selectWeek);
    const monthEnd = endOfMonth(selectWeek);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
  
    let day = startDate;
  
    const rows = [];
  
    while (day <= endDate) {
      let days = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const isNotThisMonth = format(day, 'M') !== format(monthStart, 'M'); // Check if the day is not in the current month
        const dateHeaderClass = `${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'dateHeaderToday' : 'dateHeader'}`;
  
        days.push(
          <div className={styles.eachDay} key={day}>
            <div className={styles.col}>
              <div className={`${styles[dateHeaderClass]}  ${format(day, 'M') !== format(monthStart, 'M') ? styles.notThisMonth : ""}`}>{formattedDate}</div>
            </div>
            <div
              className={
                `${styles.day} ${selectDate.has(format(day, 'yyyy-MM-dd')) ? styles.selected : ''} ${format(day, 'yyyy-MM-dd') !== not ? styles.valid : styles.disabled}`
              }
              onClick={() => {
                if (!isNotThisMonth) setSelectWeek(day); // Prevent selecting days not in the current month
              }}
            >
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          className={`${styles.dayContent} ${isSameWeek(selectWeek, subDays(day, 1)) ? styles.weekSelected : styles.week} ${styles.dateBox}`}
          key={'Week' + day}
        >
          {days}
        </div>
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
      <div className={styles.boderBottom}><div></div></div>
    </div>
    {/* <ConfirmedApmt />
    <CustomedSched /> */}
  </div>
};

export default CalendarMine;