import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/EmailAuth.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";
import { useNavigate } from "react-router-dom";




const EmailAuth = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [authCode, setAuthCode] = useState('');
  const [isVaildAuthCode, setIsVaildAuthCode] = useState(false);
  const [authCodeSubmitted, setAuthCodeSubmitted] = useState(false);
  const [emailToken, setEmailToken] = useState('');
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef();
  const navigate = useNavigate();

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

  // alertZone이 hidden 상태가 아닌지 확인하는 함수
  const isAlertZoneVisible = () => {
    return emailSubmitted && (errorMessage || !isValidEmail || authCodeSubmitted);
  };

  // SubmitBtn에 적용할 마진 값 계산
  const submitButtonMargin = isAlertZoneVisible() ? '20.5px' : '45px';

  const handleAuthSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/confirmVerifyCode`, {
        email: email,
        verifyCode: authCode})
      const emailToken = response.data.emailToken;
      setIsVaildAuthCode(true);
      setAuthCodeSubmitted(true); // 언젠가 쓰겠지...? -> 다음 페이지로 넘길 때 토큰 보내주기?
      navigate("/EnterInfo", { state: { emailToken: emailToken, email: email} });

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
    setErrorMessage(false);
    setAuthCode(''); // Clear the authCode when editing the email
    setIsVaildAuthCode(false); // Reset the auth code validation state
    setAuthCodeSubmitted(false);
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <p>MEETable</p>
        </div>
        <p className={styles.signup}>가입하기</p>
        <form className={styles.content} onSubmit={handleEmailSubmit}>
          <InputArea
            className={`${emailSubmitted && !errorMessage ? styles.lockEmail : ''}`}
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
            onClear={emailSubmitted && !errorMessage ? handleToggleEmailEdit : handleClearEmail}
          >
            {emailSubmitted && !errorMessage ? svgList.loginIcon.pencilBtn : svgList.loginIcon.delBtn}
          </InputArea>
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
              <div className={`${styles.errorMsg} ${authCodeSubmitted && emailSubmitted ? '' : styles.hidden}`}>
              {timerExpired && (
                <div className={styles.message}>인증 시간이 만료되었어요.</div>
              )}
              </div>
              <div className={`${styles.errorMsg} ${authCodeSubmitted && emailSubmitted ? '' : styles.hidden} ${isVaildAuthCode ? styles.hidden : ''} ${timerExpired ? styles.hidden : ''}`}>
                <div className={styles.message}>인증 코드가 틀려요.</div>
              </div>
            </div>

          </div>

          <SubmitBtn
            text="인증 메일 보내기"
            onClick={sendVerifyCode}
            isActive={email}
            className={`${emailSubmitted && !errorMessage ? styles.hidden : ''}`}
            margin={`${submitButtonMargin} 0px 0px`}
          />
          <SubmitBtn
            text="인증 메일 다시 보내기"
            onClick={sendVerifyCode}
            isActive={authCode}
            className={`${authCode ? styles.hidden : ''} ${emailSubmitted && !errorMessage ? '' : styles.hidden} ${timerExpired ? styles.hidden : ''}`}
            margin={`${submitButtonMargin} 0px 0px`}
          />
          <SubmitBtn
            text="인증하기"
            onClick={handleAuthSubmit}
            isActive={authCode}
            className={`${authCode ? '' : styles.hidden} ${emailSubmitted && !errorMessage ? '' : styles.hidden} ${timerExpired ? styles.hidden : ''}`}
            margin={`${submitButtonMargin} 0px 0px`}
          />
          <SubmitBtn
            text="인증 메일 다시 보내기"
            onClick={sendVerifyCode}
            isActive={authCode}
            className={`${emailSubmitted && !errorMessage ? '' : styles.hidden} ${timerExpired ? '' : styles.hidden}`}
            margin={`${submitButtonMargin} 0px 0px`}
          />
        </form>
        <div className={styles.linkLine}>
          <Link to="/Login" className={styles.loginLink}>
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailAuth;