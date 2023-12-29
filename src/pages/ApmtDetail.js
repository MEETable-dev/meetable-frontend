import styles from '../css/ApmtDetail.module.css';
import { useState, useEffect } from 'react';
import CalendarWeekWithTime from 'components/CalendarWeekWithTime';
import CalendarWeekWithoutTime from 'components/CalendarWeekWithoutTime';
import CalendarMonthWithTime from 'components/CalendarMonthWithTime';
import CalendarMonthWithoutTime from 'components/CalendarMonthWithoutTime';
import ColorBar from '../components/ColorBar';
import Filter from '../components/Filter';
import TimeNO from '../components/TimeNO';
import TimeYES from '../components/TimeYES';

const ApmtDetail = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectWeek, setSelectWeek] = useState(new Date());
  const [time, setTime] = useState(true);
  const [week, setWeek] = useState(true);

  useEffect(()=>{
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <div style={{height:'auto'}}>
    약속 세부
    <div style={{display:'table'}}>
      <div className={styles.calendar}>
        <div>약속이름 공유</div>
          {!week && time && <CalendarMonthWithTime selectWeek={selectWeek} setSelectWeek={setSelectWeek} />}
        {/* {!week && time && <div>달력에서 주 선택</div>} */}

      </div>
      <div className={styles.empty} style={windowWidth > 1200 ? {padding:'0.5vw'} : {padding:0}}></div>
      <div className={styles.calendar} style={windowWidth > 1200 ? {justifyContent:'center'} : {justifyContent:'center', marginLeft:'20px', marginRight:'20px'}}>
        {time && <CalendarWeekWithTime selectWeek={selectWeek} setSelectWeek={setSelectWeek} />}
        {/* {time && <div>주에서 시간 선택</div>} */}
        {week && !time && <CalendarWeekWithoutTime selectWeek={selectWeek} setSelectWeek={setSelectWeek} />}
        {/* {week && !time && <div>주에서 날짜 선택</div>} */}
        {!week && !time && <CalendarMonthWithoutTime selectWeek={selectWeek} setSelectWeek={setSelectWeek} />}
        {/* {!week && !time && <div>달력에서 날짜 선택</div>} */}

      </div>
      <div className={styles.empty} style={{padding:'0.5vw'}}></div>
      <div className={styles.participants}>
        <div className={styles.partiHead}>참가자</div>
        <div className={styles.partiBody}>김영dsdfdsf<br />sdfs</div>
      </div>
    </div>
    <Filter />
    <ColorBar />
    
  </div>
};

export default ApmtDetail;