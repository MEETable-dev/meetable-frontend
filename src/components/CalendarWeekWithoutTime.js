// import ConfirmedApmt from './ConfirmedApmt';
// import CustomedSched from './CustomedSched';
import { useState, useEffect } from 'react';
import styles from '../css/CalendarWeekWithoutTime.module.css';
import { format, addWeeks, subWeeks, addMinutes, endOfMonth, startOfWeek, endOfWeek, isSameWeek, subDays, addDays, parse, isBefore, startOfDay } from 'date-fns'
import { AiOutlineCalendar } from "react-icons/ai";

const not = '2023-12-27';

const CalendarWeekWithoutTime = (props) => {
  let selectWeek = props.selectWeek;
  let setSelectWeek = props.setSelectWeek;
  const Body = ({selectDate, onTimeClick}) => {
    const startDate = startOfWeek(selectWeek);
    const endDate = endOfWeek(selectWeek);
    
    const cols = [];
    let times = [];
    let days = [];
    let dayHeaders = [];
    let day = startOfDay(startDate);
    let formattedDate = '';
    
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      if (format(day, 'yyyy-MM-dd') !== not) {
        // for (let j = 0; j < 48; j++) {
          const cloneDay = day;
          days.push(
            <div
            // 범위에 포함 안되면 disabled 추가
            // 일정 있으면
            // 확정된 약속 있으면
            className={
              selectDate.has(format(day, 'yyyy-MM-dd-HH-mm-ss'))
              ? `${styles.col} ${styles.day} ${styles.selected}`
              : `${styles.col} ${styles.day} ${styles.valid}`
            }
            style={getStyles()}
            key={day}
            onClick={() => {
              // setSelectWeek(cloneDay);
              console.log(format(cloneDay, 'yyyy-MM-dd-HH-mm-ss'))
              onTimeClick(cloneDay)
            }}
            >
              <AiOutlineCalendar size={23} color='#FFFFFF' style={{position:'absolute', top:'2px', left:2}}/>
              <div className={styles.howmany}>3</div>
            </div>
          );
          day = addDays(day, 1);
        // }
      }
      else {
        days.push(<div className={`${styles.col} ${styles.day} ${styles.disabled}`} style={getStyles()}>
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M59 1L1 119" stroke="#A8A8A8" stroke-linecap="round"/>
            <path d="M1 1L59 119" stroke="#A8A8A8" stroke-linecap="round"/>
          </svg>

        </div>);
        day = addDays(day, 1);  
      }
      times.push(
        <div style={{flexDirection:'row'}}>
          <div>{days}</div>
        </div>
      );
      days = [];
    }
    cols.push(
      <div
        style={{marginBottom:'7px', justifyContent:'center', alignItems:'center'}}
        key={'Week'+day}
        >
          <div style={{display:'flex', flexDirection:'row',}}>{dayHeaders}</div>
          <div className={styles.week} style={{display:'flex', flexDirection:'row'}}>{times}</div>
      </div>
    );
    return <div className={styles.body}>{cols}</div>;
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
  
  const [selectDate, setSelectDate] = useState(new Set());
  
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const DivDates = [];

  const getStyles = () => {
    if (windowWidth < 580) {
      return {
        position:'relative',
        width: '27px',
        marginLeft: '2.9px',
        marginRight: '2.9px',
      };
    } else if (windowWidth >= 580 && windowWidth <= 1200) {
      return {
        position:'relative',
        width: '4.5vw',
        marginLeft: '0.5vw',
        marginRight: '0.5vw',
      };
    } else {
      return {
        position:'relative',
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

  const onTimeClick = (day) => {
    if (selectDate.has(format(day, 'yyyy-MM-dd-HH-mm-00'))) {
      setSelectDate(prevState => {
        prevState.delete(format(day, 'yyyy-MM-dd-HH-mm-00'));
        return new Set(prevState);
      })
    }
    else {
      setSelectDate(prevState => new Set([...prevState, format(day, 'yyyy-MM-dd-HH-mm-ss')]));
    }
  }

  return <div className={styles.entire} style={
    windowWidth < 580 
    ? {marginLeft:'10px', marginRight:'10px', width:'300px'}
    : (windowWidth >= 580 && windowWidth <= 1200)
    ? {marginLeft:'1.8vw', marginRight:'1.8vw', width:'48vw'}
    : {width:'580px'}
  }>
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
      }><Body selectDate={selectDate} onTimeClick={onTimeClick} /></div>
    </div>
  </div>
};

export default CalendarWeekWithoutTime;