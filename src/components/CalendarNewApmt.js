import { useState } from 'react';
import styles from '../css/CalendarNewApmt.module.css';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, subDays, addDays, parse, isBefore } from 'date-fns'


const CalendarNewApmt = ({ spaceX, spaceY, selectedDates, onDateChange }) => {
  const Body = ({currentDate, selectDate, onDateClick}) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = addDays(startOfWeek(monthStart), 0);
    const endDate = addDays(endOfWeek(monthEnd), 0);
    
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
            className={
              isBefore(day, subDays(new Date(), 1))
              ? `${styles.col} ${styles.disabled}`
              : selectDate.has(format(day, 'yyyy-MM-dd'))
              ? `${styles.col} ${styles.selected}`
              : `${styles.col} ${styles.valid}`
            }
            key={day}
            onClick={() => {
              if (!isBefore(cloneDay, subDays(new Date(), 1))) {
                onDateClick(cloneDay)
                console.log(format(cloneDay, 'yyyy-MM-dd'))
              }
            }}
          >
            {/* <div
              className={styles[selectDate.has(format(day, 'yyyy-MM-dd'))
              ? 'txtSelectedDate'
              : 'txtDate']}
            >
              {formattedDate}
            </div> */}
            
            <div className={styles.dateBlock}>
              <div
                className={styles[selectDate.has(format(day, 'yyyy-MM-dd'))
                ? 'txtSelectedDate'
                : 'txtDate']}
              >
                {formattedDate}
              </div>
            </div>
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
  const spaceX_new = spaceX;
  const spaceY_new = spaceY;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Set());
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const DivDates = [];
  
  for (let i = 0; i < 7; i++) {
    DivDates.push(
      <div className={styles.colDays} style={{
        marginLeft:spaceX_new/2,
        marginRight:spaceY_new/2,
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
    if (selectDate.has(format(day, 'yyyy-MM-dd'))) {
      setSelectDate(prevState => {
        prevState.delete(format(day, 'yyyy-MM-dd'));
        return new Set(prevState);
      })
    }
    else {
      setSelectDate(prevState => new Set([...prevState, format(day, 'yyyy-MM-dd')]));
    }
    onDateChange(day);
  }

  return (
    <div className={styles.entire}>
      <div className={styles.content}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}></div>
          <div className={styles.headerCenter}>
            <div className={styles.toAnotherMonth} onClick={prevMonth}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9883 16.2403L13.0527 15.1759L6.87677 8.99989L13.0527 2.82392L11.9883 1.75952L4.74796 8.99989L11.9883 16.2403Z" fill="#888888"/>
              </svg>
            </div>
            <div className={styles.headerText}>
              {format(currentDate, 'yy')}년 {format(currentDate, 'M')}월
            </div>
            <div className={styles.toAnotherMonth} onClick={nextMonth}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.01167 16.2403L4.94727 15.1759L11.1232 8.99989L4.94727 2.82392L6.01167 1.75952L13.252 8.99989L6.01167 16.2403Z" fill="#888888"/>
              </svg>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.TodayBtn} style={{right:spaceX_new/2}} onClick={()=>setCurrentDate(new Date())}>오늘</div>
          </div>
        </div>
        
        <div className={styles.bodyContainer}>
          <div className={styles.DaysOfWeek}>{DivDates}</div>
          <div className={styles.body}><Body currentDate={currentDate} selectDate={selectDate} onDateClick={onDateClick} /></div>
        </div>
        {/* <ConfirmedApmt />
        <CustomedSched /> */}
      </div>
    </div>
  );
};

export default CalendarNewApmt;