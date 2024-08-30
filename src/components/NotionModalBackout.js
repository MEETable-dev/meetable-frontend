import styles from 'css/NotionModal.module.css';
import React from 'react';

const NotionModal = ({ selectedItemID, type='B', setShowNotionModal, backoutApmt, total}) => {
    console.log(selectedItemID);
    const isLastPerson = total <= 1;
  return (
    (type === 'B' && (
      <div className={styles.notionModalBox}>
        <div className={styles.notionModal}>
          <div className={styles.notionModalT1}>약속에서 빠지시겠어요?</div>
          {isLastPerson&&<div className={styles.notionModalT2}>내가 이 약속에 남아있는 마지막 사람이에요.<br />내가 빠지면 약속 파일이 영구 삭제됩니다.</div>}
          <div className={styles.notionModalBtnBox}>
            <div className={styles.notionModalNo} onClick={() => { setShowNotionModal(''); }}>아니요.</div>
            <div className={styles.notionModalYes} onClick={() => { backoutApmt(selectedItemID); setShowNotionModal(''); }}>네,빠질게요.</div>
          </div>
        </div>
      </div>
    )))};

    export default NotionModal;

