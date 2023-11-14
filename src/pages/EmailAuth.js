import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/EmailAuth.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";

const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [authCode, setAuthCode] = useState('');
  const [isVaildAuthCode, setIsVaildAuthCode] = useState(false);
  const [authCodeSubmitted, setAuthCodeSubmitted] = useState(false);

  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef();

  const sendVerifyCode = async () => {
    resetTimer();
    startTimer();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sendVerifyCode`, {
        email: email})
      console.log(response.data)
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/confirmVerifyCode`, {
        email: email,
        verifyCode: authCode})
      console.log(response.data)
      const emailToken = response.data.emailToken; // 언젠가 쓰겠지...? -> 다음 페이지로 넘길 때 토큰 보내주기?
      setIsVaildAuthCode(true);
      setAuthCodeSubmitted(true);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
      setIsVaildAuthCode(false);
      setAuthCodeSubmitted(true);
    }
  };

  const startTimer = () => {
    // 타이머가 이미 실행 중인지 확인
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  
    setTimerExpired(false);
    setTimer(180);
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(timerRef.current);
          setTimerExpired(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerExpired(false);
  };

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
    setIsVaildAuthCode(false);
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
                 :
                <div className={styles.message}>올바른 이메일 주소가 아니에요.</div> )}                
            </div>
            <div className={styles.alertZone}>
              <div className={`${styles.errorMsg} ${emailSubmitted && emailSubmitted ? '' : styles.hidden}`}>
              {timerExpired && (
                <div className={styles.message}>인증 시간이 만료되었어요.</div>
              )}
              </div>
              <div className={`${styles.errorMsg} ${authCodeSubmitted && emailSubmitted ? '' : styles.hidden} ${isVaildAuthCode ? styles.hidden : ''} ${timerExpired ? styles.hidden : ''}`}>
                <div className={styles.message}>인증 코드가 틀려요.</div>
              </div>
            </div>

          </div>
          <button className={`${styles.submitBtn} ${email ? styles.active : ''} ${emailSubmitted && !errorMessage ? styles.hidden : ''}`}
          type="submit"
          onClick={sendVerifyCode}>
            인증 메일 보내기
          </button>
          <button className={`${styles.submitBtn} ${authCode ? styles.hidden : styles.active} ${emailSubmitted && !errorMessage ? '' : styles.hidden} ${timerExpired ? styles.hidden : ''} ${styles.authBtn}`}
          type="submit"
          onClick={sendVerifyCode}>
            인증 메일 다시 보내기
          </button>
          <button className={`${styles.submitBtn} ${authCode ? styles.active : styles.hidden} ${emailSubmitted && !errorMessage ? '' : styles.hidden} ${timerExpired ? styles.hidden : ''} ${styles.authBtn}`}
          type="submit"
          onClick={handleAuthSubmit}>
          인증하기
          </button>
          <button className={`${styles.submitBtn} ${authCode ? styles.active : ''} ${emailSubmitted && !errorMessage ? '' : styles.hidden} ${timerExpired ? '' : styles.hidden} ${styles.authBtn}`}
          type="submit"
          onClick={sendVerifyCode}>
            인증 메일 다시 보내기
          </button>
        </form>
      </div>
      <div>
        {/* 무슨 react-router-dom을 써서 링크를 연결하라는데 일단 미래로 넘기기... */}
        <p className={styles.loginLink}>로그인하기</p>
      </div>
    </div>
  );
};

export default EmailAuth;