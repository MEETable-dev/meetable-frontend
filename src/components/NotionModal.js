import styles from 'css/NotionModal.module.css';
import React from 'react';

const NotionModal = ({ selectedItemID, onClose, type, setShowNotionModal, backoutApmt, moveApmtToTrash , backoutAll}) => {
    console.log(selectedItemID);
  return (
    (type === 'B' && (
      <div className={styles.notionModalBox}>
        <div className={styles.notionModal}>
          <div className={styles.notionModalT1}>약속에서 빠지시겠어요?</div>
          <div className={styles.notionModalT2}>내가 이 약속에 남아있는 마지막 사람이에요.<br />내가 빠지면 약속 파일이 영구 삭제됩니다.</div>
          <div className={styles.notionModalBtnBox}>
            <div className={styles.notionModalNo} onClick={() => { setShowNotionModal(''); }}>아니요.</div>
            <div className={styles.notionModalYes} onClick={() => { backoutApmt(selectedItemID); setShowNotionModal(''); }}>네,빠질게요.</div>
          </div>
        </div>
      </div>
    ))
    ||
    ( type ==='T' && (
      <div className={styles.notionModalBox}>
        <div className={styles.notionModal} style={{ width: 320, height: 198 }}>
          <div className={styles.notionModalT1} style={{ width: 141, height: 23, marginBottom: 8 }}>휴지통을 비우시겠어요?</div>
          <div className={styles.notionModalT2} style={{ width: 287, height: 23, marginBottom: 1, marginTop:8 }}>휴지통에 있는 모든 약속에서 내가 빠지게 됩니다.</div>
          <div className={styles.notionModalBtnBox}>
            <div className={styles.notionModalNo} onClick={() => { setShowNotionModal(''); }}>아니요.</div>
            <div className={styles.notionModalYes} onClick={() => { moveApmtToTrash(selectedItemID); setShowNotionModal(''); }}>네,비울게요.</div>
          </div>
        </div>
      </div>
    ))
    ||
    (type==='BA' &&(
        <div className={styles.notionModalBox}>
          <div className={styles.notionModal} style={{ width: 320, height: 240 }}>
            <div className={styles.notionModalT1} style={{ width: 141, height: 23, marginBottom: 8 }}>휴지통을 비우시겠어요?</div>
            <div className={styles.notionModalT2} style={{ width: 287, height: 67, marginBottom: 1}}>휴지통에 있는 모든 약속에서 내가 빠지게 됩니다. 만약 약속에 남아있는 마지막 사람이 나일 경우
해당 약속 파일이 영구 삭제됩니다.</div>
            <div className={styles.notionModalBtnBox}>
              <div className={styles.notionModalNo} onClick={() => { setShowNotionModal(''); }}>아니요.</div>
              <div className={styles.notionModalYes} onClick={() => { backoutAll(); setShowNotionModal(''); }}>네,비울게요.</div>
            </div>
          </div>
        </div>
      ))
  
  );
};


// onClick ={()=>} 이 형태로 호출하는 것이 콜백 형태로 함수를 호출하는것이고,
// 이렇게 호출해야지 렌더링 중에 호출되는 것이 아니라 클릭이벤트가 발생했을 때 호출이되는거임..
export default NotionModal;
