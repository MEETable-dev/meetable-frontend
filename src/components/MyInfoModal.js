import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import styles from '../css/MyInfoModal.module.css';
import { svgList } from "../assets/svg";
import { Link } from "react-router-dom";
import axios from "axios";

import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";

const MyInfoModal = ({ onClose }, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);

    const [userNameLocked, setUserNameLocked] = useState(true);

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');

    const getUserInfo = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/info`, {
          });
          console.log(response.data);
          setUserName(response.data.name);
          setEmail(response.data.email);
          
        } catch (error) {
          const errorResponse = error.response;
          console.log(errorResponse.data.statusCode);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    const saveUserName = async () => {
        // 백앤드로 바뀐 유저네임 넘기기 -> 오류. 왜...?ㅠㅠㅠㅠ
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/member/resetname`, {
                name: userName
            });
            console.log(response.data);
            setUserNameLocked(true);
        } catch (error) {
            const errorResponse = error.response;
            console.log(errorResponse.data.statusCode);
        }
    }

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
      };

    const handleToggleUserNameEdit = () => {
        setUserNameLocked(false);
        };

    const handleClearUserName = () => {
        setUserName('');
        };

    return (
    <div ref={ref}>
        <div className={styles.modalOverlay}>
            <div className={userNameLocked ? styles.modalContent : styles.modalContentLong}>
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
                    </div>

                    <div className={styles.inputBox}>
                        <InputArea
                            className={styles.lockEmail}
                            value={email}
                        >
                        </InputArea>
                    </div>

                    {userNameLocked ?
                    null :
                    <SubmitBtn
                    text="저장하기"
                    onClick={saveUserName}
                    isActive={userName}
                    className={`${userNameLocked ? styles.hidden : ''}`}
                    margin={`30px 0px 0px`}
                    />}

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