import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/EmailAuth.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [authCode, setAuthCode] = useState('');
  const [isVaildAuthCode, setIsVaildAuthCode] = useState(false);

  // 타이머 상태 설정
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef();

  // 타이머 시작 함수
  const startTimer = () => {
    setTimerExpired(false);
    setTimer(180);
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(timerRef.current);
          setTimerExpired(true); // 타이머 만료
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // 타이머 초기화 함수
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerExpired(false);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handleClearEmail = () => {
    setEmail('');
    setIsValidEmail(false);
  };

  const handleClearAuthCode = () => {
    setAuthCode('');
    setIsVaildAuthCode(false);
  };

  const handleAuthCodeChange = (e) => {
    setAuthCode(e.target.value);
    setIsVaildAuthCode(false) // 수정 : 백앤드 정보랑 일치하면 true로 바꾸기
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailSubmitted(true);

    if (!isValidEmail) {
      setErrorMessage(true);
      resetTimer(); // 타이머 초기화
    } else {
      setErrorMessage(false);
      startTimer(); // 타이머 시작
    }
  };

  const handleToggleEmailEdit = () => {
    setEmailSubmitted(false);
    setErrorMessage(true);
    setAuthCode(''); // Clear the authCode when editing the email
    setIsVaildAuthCode(false); // Reset the auth code validation state
  };


  return (
    <div className={styles.loginBox}>
      <div className={styles.loginLogo}>
        <h2>MEETable</h2>
      </div>
      <h4>가입하기</h4>
      <div className={styles.content}>
        <form onSubmit={handleEmailSubmit}>
          <div className={styles.infoArea}>
            <div className={styles.inputBlock}>
              <input
                className={`${styles.inputEmail} ${emailSubmitted && !errorMessage ? styles.lockEmail : ''}`}
                placeholder="이메일"
                autoComplete="off"
                value={email}
                onChange={handleEmailChange}
              />
              <span className={styles.btnRegion}>
                {email && (
                  <button
                    className={styles.del}
                    type="button"
                    onClick={emailSubmitted && !errorMessage ? handleToggleEmailEdit : handleClearEmail}
                  >
                    <div>
                      {emailSubmitted && !errorMessage ? svgList.loginIcon.pencilBtn : svgList.loginIcon.delBtn}
                    </div>
                  </button>
                )}
              </span>
            </div>
            <div className={styles.underLine}></div>
          </div>
          <div className={styles.alertZone}>
            <div className={`${styles.errorMsg} ${emailSubmitted ? '' : styles.hidden}`}>
              { emailSubmitted && ( !errorMessage ?
                <div className={styles.infoArea}>
                  <div className={styles.inputBlock}>
                    <input
                      className={styles.inputAuthCode}
                      placeholder="인증코드"
                      autoComplete="off"
                      value={authCode}
                      onChange={handleAuthCodeChange}
                    />
                    <span className={styles.timeCounter}>
                      {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                    </span>
                    <span className={styles.btnRegion}>
                      {authCode && (
                        <button className={styles.del} type="button" onClick={handleClearAuthCode}>
                          <div>{svgList.loginIcon.delBtn}</div>
                        </button>
                      )}
                    </span>
                  </div>
                  <div className={styles.underLine}></div>
                </div>

                 : // 앞부분 메일 db에 전송 & 인증번호 입력창 띄우기 & 버튼 문구 인증하기로 바꾸기
                <div className={styles.message}>올바른 이메일 주소가 아니에요.</div> )}                
            </div>
          </div>
          <button className={`${styles.submitBtn} ${email ? styles.active : ''} ${emailSubmitted && !errorMessage ? styles.hidden : ''}`}
          type="submit">
            인증 메일 보내기
          </button>
          <button className={`${styles.submitBtn} ${authCode ? styles.active : ''} ${emailSubmitted && !errorMessage ? '' : styles.hidden} ${styles.authBtn}`}
          type="submit">
            인증하기
          </button>

          {timerExpired && (
            <div className={styles.message}>인증 시간이 만료되었어요.</div>
          )}
        </form>
      </div>
      <div>
        <p className={styles.loginLink}>로그인하기</p>
      </div>
    </div>
  );
};

export default EmailAuth;