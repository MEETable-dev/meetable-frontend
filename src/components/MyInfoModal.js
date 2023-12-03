import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '../css/MyInfoModal.module.css';
import { svgList } from "../assets/svg";
import { Link } from "react-router-dom";

import InputArea from '../components/InputArea';

const MyInfoModal = ({ title, onClose, children }, ref) => {
    const [userName, setUserName] = useState('주다윤');  // 현 state에서 토큰 가져와서 디폴트값 설정
    const [userNameLocked, setUserNameLocked] = useState(true);
    const [email, setEmail] = useState('ellyjoo0707@naver.com');  // 현 state에서 토큰 가져와서 디폴트값 설정

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
      };

    const handleToggleUserNameEdit = () => {
        // 사용자 이름 변경
        setUserNameLocked(false);
        };

    const handleClearUserName = () => {
        setUserName('');
        };

    return (
    <div ref={ref}>
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <div className={styles.closeX}>
                    {svgList.policyIcon.closeBtn}
                    </div>
                </button>
                <h2>내 정보</h2>
                <div className={styles.modalBody}>
                    <div className={styles.inputBox}>
                        <InputArea
                            className={`${userNameLocked ? styles.lockEmail : ''}`}
                            placeholder="이름"
                            value={userName}
                            onChange={handleUserNameChange}
                            onClear={userNameLocked ? handleToggleUserNameEdit : handleClearUserName}
                        >
                            {userNameLocked ? svgList.loginIcon.pencilBtn : svgList.loginIcon.delBtn}
                        </InputArea>
                        {/* delBtn 대신 이름 수정 후 저장하는 체크 아이콘? 있으면 좋을듯! */}
                    </div>

                    <div className={styles.inputBox}>
                        <InputArea
                            className={styles.lockEmail}
                            value={email}
                        >
                        </InputArea>
                    </div>

                    {/* 링크 알맞게 달아주기 */}
                    <div className={styles.links}>
                        <div className={styles.linkLine}>
                            <Link to="/Login" className={styles.loginLink}>
                                비밀번호 바꾸기
                            </Link>
                            <span> | </span>
                            <Link to="/Login" className={styles.loginLink}>
                                탈퇴하기
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

// export default PolicyModal;
export default React.forwardRef(MyInfoModal);