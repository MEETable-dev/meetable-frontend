// import ConfirmedApmt from './ConfirmedApmt';
// import CustomedSched from './CustomedSched';
import { useState } from 'react';
import styles from '../css/calendar.module.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parse } from 'date-fns'


const Calendar = (props) => {
  const Body = ({currentDate, selectDate, onDateClick}) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = addDays(startOfWeek(monthStart), 1);
    const endDate = addDays(endOfWeek(monthEnd), 1);
    
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        days.push(
          <div

            className={!isSameMonth(day, monthStart)
            ? `${styles.col} ${styles.disabled}`
            : isSameDay(day, selectDate)
            ? `${styles.col} ${styles.selected}`
            : format(currentDate, 'M') !== format(day, 'M')
            ? `${styles.col} ${styles['not-valid']}`
            : `${styles.col} ${styles.valid}`}
            key={day}
            onClick={() => onDateClick(parse(cloneDay))}
          >
            <span
              className={styles[format(currentDate, 'M') !== format(day, 'M')
              ? 'not-valid'
              : 'valid']}
            >
              {formattedDate}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div 
          className={styles.week}
          key={'Week'+day}
          >
          {days}
        </div>
      );
      days = [];
    }
    return <div className={styles.body}>{rows}</div>;
  }
  const dayX = props.dayX;
  const dayY = props.dayY;
  const size = props.size;
  const spaceX = props.spaceX;
  const spaceY = props.spaceY;
  const notBeforeToday = props.notBeforeToday;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Date());
  
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const DivDates = [];
  
  for (let i = 0; i < 7; i++) {
    DivDates.push(
      <div className={styles.colDays} style={{
        marginLeft:spaceX/2,
        marginRight:spaceY/2,
        backgroundColor:'white'
      }}>
        {days[i]}
      </div>
    )
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  const onDateClick = (day) => {
    setSelectDate(day);
  }

  return <div className={styles.entire}>
    <div className={styles.headerContainer}>
      <div className={styles.headerLeft}></div>
      <div className={styles.headerCenter}>
        <div className={styles.toAnotherMonth} onClick={prevMonth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.9883 16.2403L13.0527 15.1759L6.87677 8.99989L13.0527 2.82392L11.9883 1.75952L4.74796 8.99989L11.9883 16.2403Z" fill="#888888"/>
          </svg>
        </div>
        <div className={styles.headerText}>
          {format(currentDate, 'yy')}년 {format(currentDate, 'M')}월
        </div>
        <div className={styles.toAnotherMonth} onClick={nextMonth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.01167 16.2403L4.94727 15.1759L11.1232 8.99989L4.94727 2.82392L6.01167 1.75952L13.252 8.99989L6.01167 16.2403Z" fill="#888888"/>
          </svg>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.TodayBtn} style={{right:spaceX/2}} onClick={()=>setCurrentDate(new Date())}>오늘</div>
      </div>
    </div>
    <div className={styles.bodyContainer}>
      <div className={styles.DaysOfWeek}>{DivDates}</div>
      <div className={styles.body}><Body currentDate={currentDate} selectDate={selectDate} onDateClick={onDateClick} /></div>
    </div>
    {/* <ConfirmedApmt />
    <CustomedSched /> */}
  </div>
};

export default Calendar;