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

    const [userName, setUserName] = useState('주다윤');  // 현 state에서 토큰 가져와서 디폴트값 설정
    const [userNameLocked, setUserNameLocked] = useState(true);
    const [email, setEmail] = useState('ellyjoo0707@naver.com');  // 현 state에서 토큰 가져와서 디폴트값 설정

    useEffect(() => {
        // IIFE (즉시 실행 함수 표현) 사용
        (async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/promise/username`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                console.log(response.data);
                setUserName(response.data.userName); // 여기서 userName을 업데이트
            } catch (error) {
                const errorResponse = error.response;
                console.log(errorResponse.data.statusCode);
            }
        })();
    }, []); // 빈 의존성 배열을 사용해 컴포넌트 마운트 시 한 번만 실행되도록 함


    // const getUserName = async () => {
    //     try {
    //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/promise/username`, {
    //         accessToken: accessToken
    //       });
    //       console.log(response.data);

    //       setUserName(response.data.userName); // userName 받아서 기본값으로 설정하기    
    //     } catch (error) {
    //       const errorResponse = error.response;
    //       console.log(errorResponse.data.statusCode);
    //     }
    //   };





    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
      };

    const handleToggleUserNameEdit = () => {
        setUserNameLocked(false);
        };

    const handleClearUserName = () => {
        setUserName('');
        };

    const saveUserName = () => {
        // 백앤드로 바뀐 유저네임 넘기기
        setUserNameLocked(true);
    }

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