// import ConfirmedApmt from './ConfirmedApmt';
// import CustomedSched from './CustomedSched';
import { useState, useEffect } from 'react';
import styles from '../css/CalendarMonthWithoutTime.module.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameWeek, subDays, addDays, parse, isBefore, getWeekOfMonth, getDay, getYear, getMonth, isSameDay, add, isSameMonth } from 'date-fns'
import { AiOutlineCalendar } from "react-icons/ai";

const not = new Set(['2024-01-05']);

const CalendarMonthWithoutTime = (props) => {
  let selectWeek = props.selectWeek;
  let setSelectWeek = props.setSelectWeek;

  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectDate, setSelectDate] = useState(new Set());
  const [selectingDate, setSelectingDate] = useState(new Set());
  const [removingDate, setRemovingDate] = useState(new Set());
  const [adding, setAdding] = useState(true);

  const handleMouseDown = (date) => {
    setDragStart(date);
    setIsDragging(true);
    if (selectDate.has(format(date, 'yyyy-MM-dd'))) setAdding(false);
    else setAdding(true);
  };

  const handleMouseUp = (date) => {
    setDragEnd(date);
    setIsDragging(false);
    if (adding) setSelectDate(prevState => new Set([...prevState, ...selectingDate].filter(element => !not.has(element))));
    else setSelectDate(prevState => {
      return new Set(
        [...prevState].filter(element => !removingDate.has(element))
      );
    })
    setSelectingDate(new Set());
    setRemovingDate(new Set());
    if (isSameDay(dragStart, date)) onDateClick(date);
  };

  const handleMouseMove = (date) => {
    if (isDragging && !isSameDay(dragEnd, date)) {
      setDragEnd(date);
      setSelectingDate(new Set());
      setRemovingDate(new Set());

      let start = new Date();
      let end = new Date();
      if (getDay(dragStart) <= getDay(date)) {
        if (isBefore(dragStart, date)) {
          // 오른쪽아래
          start = dragStart;
          end = date;
        }
        else {
          // 오른쪽위
          start = addDays(startOfWeek(date), getDay(dragStart));
          end = addDays(startOfWeek(dragStart), getDay(date));
        }
      }
      else {
        if (isBefore(date, dragStart)) {
          // 왼쪽위
          start = date;
          end = dragStart;
        }
        else {
          // 왼쪽아래
          start = addDays(startOfWeek(dragStart), getDay(date));
          end = addDays(startOfWeek(date), getDay(dragStart));
        }
      }

      let A = start;
      while (isBefore(A, addDays(end, 1))) {
        let day = format(A, 'yyyy-MM-dd');
        // console.log(day);
        if (adding) setSelectingDate(prevState => new Set([...prevState, day]));
        // console.log(selectingDate)
        else setRemovingDate(prevState => new Set([...prevState, day]));

        if (getDay(A) == getDay(end)) {
          A = addDays(A, 7 - getDay(end) + getDay(start));
          continue;
        }
        A = addDays(A, 1);
      }

      // if (isSameMonth(dragStart, date)) {
      //   let row = (getWeekOfMonth(dragStart) <= getWeekOfMonth(date));
      //   let col = (getDay(dragStart) <= getDay(date));
      //   console.log(getWeekOfMonth(dragStart), getDay(dragStart));
      //   console.log(getWeekOfMonth(date), getDay(date))
      //   setDragEnd(date);
      //   setSelectingDate(new Set());
      //   setRemovingDate(new Set());
      //   let first = getDay(startOfMonth(dragStart)) - 1;
      //   console.log('fisr', format(selectWeek, 'yyyy-MM-dd'))
      //   if (row) {
      //     if (col) {
      //       for (let r = getWeekOfMonth(dragStart); r <= getWeekOfMonth(date); r++) {
      //         for (let c = getDay(dragStart);
      //           c <= getDay(date);
      //           c++
      //         ) {
      //           if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           console.log(format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd'))
      //         }
      //       }
      //     } else {
      //       for (let r = getWeekOfMonth(dragStart); r <= getWeekOfMonth(date); r++) {
      //         for (let c = getDay(date);
      //           c <= getDay(dragStart);
      //           c++
      //         ) {
      //           if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           // console.log(format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd'))
      //         }
      //       }
      //     }
      //   } else {
      //     if (col) {
      //       for (let r = getWeekOfMonth(date); r <= getWeekOfMonth(dragStart); r++) {
      //         for (let c = getDay(dragStart);
      //           c <= getDay(date);
      //           c++
      //         ) {
      //           if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           // console.log(format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd'))
      //         }
      //       }
      //     } else {
      //       for (let r = getWeekOfMonth(date); r <= getWeekOfMonth(dragStart); r++) {
      //         for (let c = getDay(date);
      //           c <= getDay(dragStart);
      //           c++
      //         ) {
      //           if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           // console.log(format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd'))
      //         }
      //       }
      //     }
      //   }
      // } else if (isSameMonth(subMonths(dragStart, 1), date)) {
      //   console.log('date가 dragStart의 전 달')
      //   let col = (getDay(dragStart) <= getDay(date));
      //   setDragEnd(date);
      //   setSelectingDate(new Set());
      //   setRemovingDate(new Set());
      //   let first = getDay(startOfMonth(dragStart)) - 1;
      //   if (col) {
      //     for (let r = getWeekOfMonth(date); r <= getWeekOfMonth(endOfMonth(date)) + getWeekOfMonth(dragStart) - 1; r++) {
      //       for (let c = getDay(dragStart);
      //         c <= getDay(date);
      //         c++
      //       ) {
      //         // if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //         // else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //         console.log(format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd'))
      //       }
      //     }
      //   } else {
      //     for (let r = 0; r <= getWeekOfMonth(dragStart); r++) {
      //       for (let c = getDay(date);
      //         c <= getDay(dragStart);
      //         c++
      //       ) {
      //         // if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //         // else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //         console.log(format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd'))
      //       }
      //     }
      //   }
      // } else if (isSameMonth(addMonths(dragStart, 1), date)) {
      //   console.log('date가 dragStart의 다음 달')
      //   let col = (getDay(dragStart) <= getDay(date));
      //   setDragEnd(date);
      //   setSelectingDate(new Set());
      //   setRemovingDate(new Set());
      //   if (isSameMonth(addMonths(selectWeek, 1), date)) {
      //     let first = getDay(startOfMonth(dragStart)) - 1;
      //     if (col) {
      //       for (let r = getWeekOfMonth(dragStart); isSameMonth(startOfWeek(date), dragStart) ? r <= getWeekOfMonth(endOfMonth(dragStart)) : r <= getWeekOfMonth(endOfMonth(dragStart)) + 1; r++) {
      //         for (let c = getDay(dragStart);
      //           c <= getDay(date);
      //           c++
      //         ) {
      //           if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           console.log('first case:', format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd'))
      //         }
      //       }
      //     } else {
      //       for (let r = getWeekOfMonth(dragStart); isSameMonth(startOfWeek(date), dragStart) ? r <= getWeekOfMonth(endOfMonth(dragStart)) : r <= getWeekOfMonth(endOfMonth(dragStart)) + 1; r++) {
      //         for (let c = getDay(date);
      //           c <= getDay(dragStart);
      //           c++
      //         ) {
      //           if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           console.log('first2', format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd'))
      //         }
      //       }
      //     }
      //   } else if (isSameMonth(addMonths(dragStart, 1), selectWeek)) {
      //     let first1 = getDay(startOfMonth(dragStart));
      //     let first2 = getDay(startOfMonth(date));
      //     if (col) {
      //       for (let r = getWeekOfMonth(date); r <= 1; r--) {
      //         for (let c = getDay(dragStart);
      //           c <= getDay(date);
      //           c++
      //         ) {
      //           // if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           // else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           console.log('sec', format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c - first2), 'yyyy-MM-dd'))
      //         }
      //       }
      //     } else {
      //       for (let r = getWeekOfMonth(dragStart); isSameMonth(startOfWeek(date), dragStart) ? r <= getWeekOfMonth(endOfMonth(dragStart)) : r <= getWeekOfMonth(endOfMonth(dragStart)) + 1; r++) {
      //         for (let c = getDay(date);
      //           c <= getDay(dragStart);
      //           c++
      //         ) {
      //           // if (adding) setSelectingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           // else setRemovingDate(prevState => new Set([...prevState, format(new Date(getYear(dragStart), getMonth(dragStart), (r-1) * 7 + c - first), 'yyyy-MM-dd')]));
      //           console.log('third', format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd'))
      //         }
      //       }
      //     }
      //   }
      // } else {
      //   console.log('date와 dragStart가 2달차이')
      // }
      // for (let r = (row) ? getWeekOfMonth(dragStart) : getWeekOfMonth(date); r <= (row) ? getWeekOfMonth(date) : getWeekOfMonth(dragStart); r++) {
      //   for (let c = (col) ? getDay(dragStart) : getDay(date);
      //     c <= (col) ? getDay(date) : getDay(dragStart);
      //     c++
      //   ) {
      //     setSelectDate(prevState => new Set([...prevState, format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd')]));
      //     // console.log(format(new Date(getYear(date), getMonth(date), (r-1) * 7 + c), 'yyyy-MM-dd'))
      //   }
      // }

      // document.querySelector(`.table_${getWeekOfMonth(date)}_${getDay(date)}`).id = `${styles.selected}`
      // document.querySelector(`.table_${getWeekOfMonth(date)}_${getDay(date)}`).classList.remove(`${styles.valid}`);
      // document.querySelector(`.table_${getWeekOfMonth(date)}_${getDay(date)}`).classList.add(`${styles.uni}`);
      // setSelectDate(prevState => new Set([...prevState, format(date, 'yyyy-MM-dd')]));


      
      // 필요한 경우, 드래그 중인 상태를 갱신합니다.
    }
  };

  const table = [];

  const Body = ({selectWeek, selectDate, onDateClick}) => {
    const monthStart = startOfMonth(selectWeek);
    const monthEnd = endOfMonth(selectWeek);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    // cont [selectWeek, setSelectWeek] = useState(currsentDate);

    
    
    const rows = [];
    let days = [];
    let dayHeaders = [];
    let day = startDate;
    let formattedDate = '';

    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        days.push(
        <div className={styles.eachDay} key={cloneDay}>
          <div
            // 범위에 포함 안되면 disabled 추가
            // 일정 있으면
            // 확정된 약속 있으면
            className={
              not.has(format(day, 'yyyy-MM-dd'))
              ? `${styles.col} ${styles.day} ${styles.disabled}`
              : (selectDate.has(format(day, 'yyyy-MM-dd')) || selectingDate.has(format(day, 'yyyy-MM-dd'))) && !removingDate.has(format(day, 'yyyy-MM-dd'))
              ? `${styles.col} ${styles.day} ${styles.selected}`
              : `${styles.col} ${styles.day} ${styles.valid}`
            }
            // id={`${styles.selected}`}
            style={getStyles()}
            key={day}
            onMouseDown={() => handleMouseDown(cloneDay)}
            onMouseUp={() => handleMouseUp(cloneDay)}
            onMouseMove={() => handleMouseMove(cloneDay)}
          >
            {not.has(format(day, 'yyyy-MM-dd')) && <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M59 1L1 59" stroke="#A8A8A8" stroke-linecap="round"/>
                <path d="M1 1L59 59" stroke="#A8A8A8" stroke-linecap="round"/>
              </svg>
            }
            {!not.has(format(day, 'yyyy-MM-dd')) && <AiOutlineCalendar size={24} color='#FFFFFF' style={{position:'absolute', left:0, top:0}}/>}
            {!not.has(format(day, 'yyyy-MM-dd')) && <div>3</div>}
          </div>
        </div>
        );
        dayHeaders.push(
          <div className={styles.col} style={getStyles()}>
            <div className={styles[format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'dateHeaderToday' : 'dateHeader']}>{formattedDate}</div>
          </div>
        );
        table.push(days);
        day = addDays(day, 1);
      }
      rows.push(
        <div
          style={{marginBottom:'7px'}}
          key={'Week'+day}
          >
            <div style={{display:'flex', flexDirection:'row'}}>{dayHeaders}</div>
            <div className={styles.week} style={{display:'flex', flexDirection:'row'}}>{days}</div>
        </div>
      );
      days = [];
      dayHeaders = [];
    }
    return <div className={styles.body}>{rows}</div>;
  }
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
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const DivDates = [];

  const getStyles = () => {
    if (windowWidth < 580) {
      return {
        width: '27px',
        marginLeft: '2.9px',
        marginRight: '2.9px',
      };
    } else if (windowWidth >= 580 && windowWidth <= 1200) {
      return {
        width: '4.5vw',
        marginLeft: '0.5vw',
        marginRight: '0.5vw',
      };
    } else {
      return {
        width: '60px',
        marginLeft: '4px',
        marginRight: '4px',
      };
    }
  };
  
  for (let i = 0; i < 7; i++) {
    DivDates.push(
      <div className={styles.colDays} style={getStyles()}>
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
        return new Set([...prevState].filter(element => !not.has(element)));
      })
    }
    else {
      setSelectDate(prevState => new Set([...prevState, format(day, 'yyyy-MM-dd')]));
    }
  }

  return <div className={styles.entire} style={
    windowWidth < 580 
    ? {marginLeft:'10px', marginRight:'10px', width:'280px'}
    : (windowWidth >= 580 && windowWidth <= 1200)
    ? {marginLeft:'1.8vw', marginRight:'1.8vw', width:'43vw'}
    : {width:'580px'}
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
      <div className={styles.DaysOfWeek} style={
        windowWidth < 580 
        ? {marginLeft:'12px', marginRight:'12px'}
        : (windowWidth >= 580 && windowWidth <= 1200)
        ? {marginLeft:'2vw', marginRight:'2vw'}
        : {marginLeft:'40px', marginRight:'40px'}
      }>{DivDates}</div>
      <div className={styles.body} style={
        windowWidth < 580 
        ? {marginLeft:'12px', marginRight:'12px'}
        : (windowWidth >= 580 && windowWidth <= 1200)
        ? {marginLeft:'2vw', marginRight:'2vw'}
        : {marginLeft:'40px', marginRight:'40px'}
      }><Body selectWeek={selectWeek} selectDate={selectDate} onDateClick={onDateClick} /></div>
    </div>
    {/* <ConfirmedApmt />
    <CustomedSched /> */}
  </div>
};

export default CalendarMonthWithoutTime;