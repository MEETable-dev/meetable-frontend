import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import styles from '../css/MyInfoModal.module.css';
import { svgList } from "../assets/svg";
import { Link } from "react-router-dom";
import axios from "axios";

import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";

const MyInfoModal = ({ title, onClose, children }, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);

    const [userNameLocked, setUserNameLocked] = useState(true);

    // 얘도 마이페이지 홈(?)에 기본 변수로 추가하기
    const [userName, setUserName] = useState('주다윤');  // 백에서 토큰 가져와서 디폴트값 설정
    const [email, setEmail] = useState('ellyjoo0707@naver.com');  // 백에서 토큰 가져와서 디폴트값 설정

    // 이 함수를 내 정보 버튼 눌렀을 때 모달 뜸과 함께 실행되게 하기
    const getUserInfo = async () => {
        // header
        const config = {
            headers: {
            accessToken: accessToken
            }
        };

        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/info`, {
          }, config);
          console.log(response.data);

          setUserName(response.data.userName); // userName 받아서 기본값으로 설정하기
          setEmail(response.data.Email);

        } catch (error) {
          const errorResponse = error.response;
          console.log(errorResponse.data.statusCode);
        }
    };

    const saveUserName = async () => {
        // header
        const config = {
            headers: {
            accessToken: accessToken
            }
        };
        // 백앤드로 바뀐 유저네임 넘기기
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/member/resetname`, {
                name: userName
            }, config);
            console.log(response.data);
        } catch (error) {
            const errorResponse = error.response;
            console.log(errorResponse.data.statusCode);
        }
        setUserNameLocked(true);
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