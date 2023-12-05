import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import styles from '../css/PWChangeModal.module.css';
import { svgList } from "../assets/svg";
import { Link } from "react-router-dom";
import axios from "axios";

import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";
import { isVisible } from '@testing-library/user-event/dist/utils';

const PWChangeModal = ({ title, onClose, children }, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);

    const [PWD1, setPWD1] = useState('');
    const [isVisible1, setIsVisible1] = useState(false);

    const handlePWD1Change = (e) => {
        setPWD1(e.target.value);
    };

    const handleIsVisible1 = () => {
        setIsVisible1(!isVisible1); // isVisible1의 현재 값을 반전시켜 업데이트
    };

    return (
    <div ref={ref}>
        <div className={styles.modalOverlay}>
            <div className={styles.modalContentLong}>
                <button className={styles.closeButton} onClick={onClose}>
                    <div className={styles.closeX}>
                        {svgList.policyIcon.closeBtn}
                    </div>
                </button>
                <h2>내 정보</h2>
                <div className={styles.modalBody}>
                    <div className={styles.inputBox}>
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
                    </div>

                    {isVisible1 ?
                    null :
                    <SubmitBtn
                        text="저장하기"
                        className={`${isVisible1 ? styles.hidden : ''}`}
                        margin={`30px 0px 0px`}
                    />}

                </div>
            </div>
        </div>
    </div>
  );
};

export default React.forwardRef(PWChangeModal);