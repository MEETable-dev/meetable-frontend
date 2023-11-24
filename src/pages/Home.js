import Calendar from '../components/Calendar';
const Home = () => {
  return (
    <div>
      홈
      <Calendar dayX={28} dayY={22} size={'small'} spaceX={4} spaceY={4} notBeforeToday={false}/>
    </div>
  );
};

export default Home;