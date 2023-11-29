// import ConfirmedApmt from './ConfirmedApmt';
// import CustomedSched from './CustomedSched';
import { useState, useEffect } from 'react';
import styles from '../css/WeekWithTime.module.css';
import { format, addMonths, subMonths, addMinutes, endOfMonth, startOfWeek, endOfWeek, isSameWeek, subDays, addDays, parse, isBefore, startOfDay } from 'date-fns'
import { AiOutlineCalendar } from "react-icons/ai";

const not = '2023-11-25';

const WeekWithTime = (props) => {
  let selectWeek = props.selectWeek;
  let setSelectWeek = props.setSelectWeek;
  const Body = ({currentDate, selectDate}) => {
    const startDate = startOfWeek(selectWeek);
    const endDate = endOfWeek(selectWeek);
    
    const cols = [];
    let times = [];
    let days = [];
    let dayHeaders = [];
    let day = startOfDay(startDate);
    let formattedDate = '';

    times.push(
      <div style={{width:'30px', position:'relative'}}>
        <div className={styles.time}>
          0시<br />1시<br />2시<br />3시<br />4시<br />5시<br />6시<br />7시<br />8시<br />9시<br />10시<br />11시<br />12시<br />13시<br />14시<br />15시<br />16시<br />17시<br />18시<br />19시<br />20시<br />21시<br />22시<br />23시<br />24시
        </div>
      </div>
    );
    
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, 'd');
      if (format(day, 'yyyy-MM-dd') !== not) {
        for (let j = 0; j < 48; j++) {
          // const cloneDay = startOfDay(day);
          days.push(
            <div
            // 범위에 포함 안되면 disabled 추가
            // 일정 있으면
            // 확정된 약속 있으면
            className={
              selectDate.has(format(day, 'yyyy-MM-dd'))
              ? `${styles.col} ${styles.day} ${styles.selected}`
              : `${styles.col} ${styles.day} ${styles.valid}`
            }
            style={getStyles()}
            key={day}
            onClick={() => {
              // setSelectWeek(cloneDay);
            }}
            >
              <AiOutlineCalendar size={10} color='#FFFFFF'/>
              <div className={styles.howmany}>3</div>
              <div className={styles.emptycalendar}></div>
            </div>
          );
          day = addMinutes(day, 30);
        }
      }
      else {
        days.push(<div className={`${styles.col} ${styles.wholeday} ${styles.disabled}`} style={getStyles()}>
          <svg width="60" height="719" viewBox="0 0 60 719" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M59 0.993042L1 718.007" stroke="#A8A8A8" stroke-linecap="round"/>
            <path d="M1 0.993042L59 718.007" stroke="#A8A8A8" stroke-linecap="round"/>
          </svg>
        </div>);
        day = addDays(day, 1);  
      }
      times.push(
        <div style={{flexDirection:'row'}}>
          <div>{days}</div>
        </div>
      );
      dayHeaders.push(
        <div className={styles.col} style={getStyles()}>
          <div className={styles[format(subDays(day,1), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'dateHeaderToday' : 'dateHeader']}>{formattedDate}</div>
        </div>  
      );
      days = [];
    }
    times.push(
      <div style={{width:'30px', position:'relative'}}>
        <div className={styles.time}>
          0시<br />1시<br />2시<br />3시<br />4시<br />5시<br />6시<br />7시<br />8시<br />9시<br />10시<br />11시<br />12시<br />13시<br />14시<br />15시<br />16시<br />17시<br />18시<br />19시<br />20시<br />21시<br />22시<br />23시<br />24시
        </div>
      </div>
    );
    cols.push(
      <div
        style={{marginBottom:'7px', justifyContent:'center', alignItems:'center'}}
        key={'Week'+day}
        >
          <div style={{display:'flex', flexDirection:'row', margin:'0 30px'}}>{dayHeaders}</div>
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
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectDate, setSelectDate] = useState(new Set());
  
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
  }

  return <div className={styles.entire} style={
    windowWidth < 580 
    ? {marginLeft:'10px', marginRight:'10px', width:'300px'}
    : (windowWidth >= 580 && windowWidth <= 1200)
    ? {marginLeft:'1.8vw', marginRight:'1.8vw', width:'48vw'}
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
          {format(currentDate, 'yy')}년 {format(currentDate, 'M')}월
        </div>
        <div className={styles.toAnotherMonth} onClick={nextMonth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.01167 16.2403L4.94727 15.1759L11.1232 8.99989L4.94727 2.82392L6.01167 1.75952L13.252 8.99989L6.01167 16.2403Z" fill="#888888"/>
          </svg>
        </div>
      </div>
      <div className={styles.headerRight}>
        <div className={styles.TodayBtn} onClick={()=>{setCurrentDate(new Date()); setSelectWeek(new Date());}}>오늘</div>
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
      }><Body currentDate={currentDate} selectDate={selectDate} onDateClick={onDateClick} /></div>
    </div>
    {/* <ConfirmedApmt />
    <CustomedSched /> */}
  </div>
};

export default WeekWithTime;