import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import styles from '../css/PWChangeModal.module.css';
import { svgList } from "../assets/svg";
import { Link } from "react-router-dom";
import axios from "axios";

import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";

const PWChangeModal = ({ onClose }, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);

    const [PWD1, setPWD1] = useState('');
    const [PWD2, setPWD2] = useState('');
    const [PWD3, setPWD3] = useState('');
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [currentPWDSubmitted, setCurrentPWDSubmitted] = useState(false);
    const [newPWDSubmitted, setNewPWDSubmitted] = useState(false);
    const [isValidCurrentPWD, setIsValidCurrentPWD] = useState(false);
    const [isValidNewPWD, setIsValidNewPWD] = useState(false);
    const [isLongPWD, setIsLongPWD] = useState(true);
    const [isSamePWD, setIsSamePWD] = useState(true);

    useEffect(() => {
        if (PWD2 && PWD3) {
            if (PWD2 === PWD3) {
                setIsSamePWD(true);
            } else {
                setIsSamePWD(false);
            }
        }
    }, [PWD2, PWD3]); // PWD2 또는 PWD3가 변경될 때마다 이 효과를 실행

    const handlePWD1Change = (e) => {
        setPWD1(e.target.value);
    };
    const handlePWD2Change = (e) => {
        setPWD2(e.target.value);

        // PWD2의 값 길이가 8자 이상인지 확인
        if (e.target.value.length >= 8) {
            setIsLongPWD(true);
        } else {
            setIsLongPWD(false);
        }
    };
    const handlePWD3Change = (e) => {
        setPWD3(e.target.value);
    };

    const handleIsVisible1 = () => {
        setIsVisible1(!isVisible1);
    };
    const handleIsVisible2 = () => {
        setIsVisible2(!isVisible2);
    };
    const handleIsVisible3 = () => {
        setIsVisible3(!isVisible3);
    };

    const handleIsValidCurrentPWD = () => {
        // 백앤드로 넘겨서 기존 비밀번호와 일치하는지 확인
        // 맞으면 true로 바꾸기
        setIsValidCurrentPWD(true);

        // 틀리면 경고문구 띄우기
        // currentPWDSubmitted -> true
    }

    const handleChangePWDInfo = () => {
        // 백앤드로 넘겨서 비밀번호 업데이트
        setNewPWDSubmitted(true);
        if (isSamePWD) {
            // 정보 넘기기
        } else {
            // 경고 나오게
        }
    }

    return (
    <div ref={ref}>
        <div className={styles.modalOverlay}>
            <div className={styles.modalContentLong}>
                <button className={styles.closeButton} onClick={onClose}>
                    <div className={styles.closeX}>
                        {svgList.policyIcon.closeBtn}
                    </div>
                </button>
                <h2>비밀번호 바꾸기</h2>
                <div className={styles.modalBody}>
                    <div className={styles.inputBox}>
                        { !isValidCurrentPWD ?
                            <div className={styles.inputHeight}>
                                <InputArea
                                    className={`${isVisible1 ? styles.visible : styles.invisible}`}
                                    placeholder="현재 비밀번호"
                                    value={PWD1}
                                    type={isVisible1 ? "text" : "password"}
                                    onChange={handlePWD1Change}
                                    onClear={handleIsVisible1}
                                >
                                    {isVisible1 ? svgList.ModalIcon.eyeSlash : svgList.ModalIcon.eyeOpen}
                                </InputArea>
                                {/* alertzone 추가 */}
                                <div className={styles.alertZone}>
                                    <div className={`${isValidCurrentPWD && currentPWDSubmitted ? '' : styles.hidden}`}>
                                        <div className={styles.message}>인증 코드가 틀려요.</div>
                                    </div>
                                </div>
                            </div> :
                            <div className={styles.inputHeight}>
                                <InputArea
                                    className={`${isVisible2 ? styles.visible : styles.invisible}`}
                                    placeholder="새 비밀번호"
                                    value={PWD2}
                                    type={isVisible2 ? "text" : "password"}
                                    onChange={handlePWD2Change}
                                    onClear={handleIsVisible2}
                                >
                                    {isVisible2 ? svgList.ModalIcon.eyeSlash : svgList.ModalIcon.eyeOpen}
                                </InputArea>
                                <div className={styles.spaceBetween}></div>
                                <InputArea
                                    className={`${isVisible3 ? styles.visible : styles.invisible}`}
                                    placeholder="새 비밀번호 확인"
                                    value={PWD3}
                                    type={isVisible3 ? "text" : "password"}
                                    onChange={handlePWD3Change}
                                    onClear={handleIsVisible3}
                                >
                                    {isVisible3 ? svgList.ModalIcon.eyeSlash : svgList.ModalIcon.eyeOpen}
                                </InputArea>
                                {/* alertzone 추가 */}
                                { !isLongPWD ?
                                <div className={styles.alertZone}>
                                    <div className={``}>
                                        <div className={styles.message}>비밀번호는 8자 이상이어야 해요.</div>
                                    </div>
                                </div> : null
                                }
                                { isLongPWD && !isSamePWD ?
                                <div className={styles.alertZone}>
                                    <div className={``}>
                                        <div className={styles.message}>비밀번호가 서로 일치하지 않아요.</div>
                                    </div>
                                </div> : null
                                }
                            </div>
                        }
                    </div>

                    { !isValidCurrentPWD ?
                        <SubmitBtn
                        text="다음"
                        onClick={handleIsValidCurrentPWD}
                        isActive={PWD1}
                        // className={`${''}`}
                        margin={`10px 0px 0px`}
                        /> :
                        <SubmitBtn
                        text="완료하기"
                        onClick={handleChangePWDInfo}
                        isActive={PWD2 && PWD3 && isLongPWD && isSamePWD}
                        // className={`${''}`}
                        margin={`10px 0px 0px`}
                        />
                    }

                </div>
            </div>
        </div>
    </div>
  );
};

export default React.forwardRef(PWChangeModal);