import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/EmailAuth.module.css';
import { useSelector } from "react-redux";
import { useState } from "react";
import { svgList } from "../assets/svg";
import React from "react";

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handleClearInput = () => {
    setEmail('');
    setIsValidEmail(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);
  };

  return (
    <div className={styles.loginBox}>
      <div className={styles.loginLogo}>
        <h2>MEETable</h2>
      </div>
      <h4>가입하기</h4>
      <div className={styles.content}>
        <form onSubmit={handleSubmit}>
          <div className={styles.infoArea}>
            <div className={styles.inputBlock}>
              <input
                className={styles.email}
                placeholder="이메일"
                autoComplete="off"
                value={email}
                onChange={handleInputChange}
              />
              <span className={styles.btnRegion}>
                {email && (
                  <button className={styles.del} type="button" onClick={handleClearInput}>
                    <div>{svgList.loginIcon.delBtn}</div>
                  </button>
                )}
              </span>
            </div>
            <div className={styles.underLine}></div>
          </div>
          <div className={styles.alertZone}>
            <div className={`${styles.errorMsg} ${emailSubmitted ? '' : styles.hidden}`}>
              {emailSubmitted && ( isValidEmail ?
                <div></div> : // 메일 db에 전송하기
                <div className={styles.message}>올바른 이메일 주소가 아니에요.</div> )}
            </div>
          </div>
          <button
            className={`${styles.submitBtn} ${email ? styles.active : ''}`}
            type="submit"
          >
            인증 메일 보내기
          </button>
        </form>
      </div>
      <div>
        <p className={styles.loginLink}>로그인하기</p>
      </div>
    </div>
  );
};

export default EmailAuth;

