import styles from '../css/ApmtDetail.module.css';
import { useState, useEffect } from 'react';
import Calendar from 'components/Calendar';
import ColorBar from '../components/ColorBar';
import Filter from '../components/Filter';
import TimeNO from '../components/TimeNO';
import TimeYES from '../components/TimeYES';

const ApmtDetail = () => {
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
  return <div>
    약속 세부
    <div className={styles.calendar} style={windowWidth > 1200 ? {justifyContent:'space-evenly'} : {justifyContent:'space-between', marginLeft:'20px', marginRight:'20px'}}>
      <div>
        <Calendar />
        <Filter />
        <ColorBar />
      </div>
      <Calendar />
    </div>
    <TimeNO />
    <TimeYES />
  </div>
};

export default ApmtDetail;