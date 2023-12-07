import CalendarMine from '../components/CalendarMine';
import { useState } from 'react';

const Home = () => {

  const [selectWeek, setSelectWeek] = useState(new Date());
  return (
    <div>
      홈
      <CalendarMine selectWeek={selectWeek} setSelectWeek={setSelectWeek} />
    </div>
  );
};

export default Home;