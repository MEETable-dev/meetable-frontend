import ApmtBlock from '../components/ApmtBlock';
import styles from 'css/AllApmt.module.css';
import { AiOutlineStar } from "react-icons/ai";
import { IoSyncOutline } from "react-icons/io5";
import { AiOutlineFileAdd } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";

const AllApmt = () => {
  return <div>
    전체 약속 목록
    {/* <ApmtBlock /> */}
    <div className={styles.container}>
    <div className={styles.innerContainer}>
      <div className={styles.headBtnContainer}>
        <button className={styles.newApmt}>{<AiOutlineFileAdd size={24} />}<div className={styles.btnText}>새 약속 잡기</div></button>
        <button className={styles.syncApmt}>{<IoSyncOutline size={24} />}<div className={styles.btnText}>비회원으로 참여한 약속 불러오기</div></button>
      </div>
      <div className={styles.searchContent}>{<RiSearchLine size="18px" color='#888' className={styles.icon}></RiSearchLine>}<input className={styles.searchContentInput} placeholder='찾기'></input></div>
    </div>
    </div>


  </div>
};

export default AllApmt;