import ColorBar from '../components/ColorBar';
import Filter from '../components/Filter';
import TimeAMPM from '../components/TimeAMPM';
import TimeNO from '../components/TimeNO';
import TimeYES from '../components/TimeYES';

const ApmtDetail = () => {
  return <div>
    약속 세부
    <ColorBar />
    <Filter />
    <TimeAMPM />
    <TimeNO />
    <TimeYES />
  </div>
};

export default ApmtDetail;