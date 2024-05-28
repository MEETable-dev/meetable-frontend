import CalendarMine from '../components/CalendarMine';
import HomeSchDetail from '../components/HomeSchDetail';
import { useState } from 'react';

const Home = () => {

  const [selectWeek, setSelectWeek] = useState(new Date());
  return (
    <div>
      홈
      <div style={{display:"flex", alignContent:"space-between"}}>
        <CalendarMine selectWeek={selectWeek} setSelectWeek={setSelectWeek} />
        <div style={{width:"10px"}}></div>
        <HomeSchDetail></HomeSchDetail>
      </div>
    </div>
  );
};

export default Home;