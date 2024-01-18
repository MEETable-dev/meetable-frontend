import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/ResetPass.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";
import { useNavigate } from "react-router-dom";

const ResetPass = () => {
  const [authCode, setAuthCode] = useState('');
  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState(''); // 인증코드 보낸 이메일 저장
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authCodeSubmitted, setAuthCodeSubmitted] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [emailToken, setEmailToken] = useState('');

  const [isAuthEmail, setIsAuthEmail] = useState(false);
  const [isValidPWD, setIsValidPWD] = useState(false);

  const [PWD2, setPWD2] = useState('');
  const [PWD3, setPWD3] = useState('');
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isLongPWD, setIsLongPWD] = useState(true);
  const [isSamePWD, setIsSamePWD] = useState(true);
  const [changeSamePWD, setChageSamePWD] = useState(false);

  const [timer, setTimer] = useState(180); // 3분 = 180초
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef();
  const navigate = useNavigate();

  // header
  const config = {headers: { 'Authorization': '@'}};

  const sendAuthCode = async () => {
    resetTimer();
    startTimer();
    setSubmitted(true);
    if (isValidEmail) {
      setIsMember(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sendVerifyCode`, {
          email: email,
          findPwdOrSignup: "P"})
        console.log(response.data)
        setSavedEmail(email);
        // setSubmitted(true);
        // setIsMember(true);
      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data.statusCode);
        setIsMember(false);
        // setSubmitted(true);
      }
    }
    // else {
    //   setSubmitted(true);
    // }
  };

  const confirmAuthCode = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/confirmVerifyCode`, {
        email: email,
        verifyCode: authCode})
      console.log(response.data);
      setEmailToken(response.data.emailToken);
      setIsAuthEmail(true);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
      setAuthCodeSubmitted(true);
    }
  };

  const handleChangePWDInfo = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/auth/resetpwd`, {
          emailToken: emailToken,
          newPwd: PWD2
      }, config);
      console.log(response.data);
      setIsValidPWD(true);
    }
    catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
      setChageSamePWD(true); // 기존 비번과 달라야 한다는 문구 띄우기
    }  
  };

  const handleAuthCodeChange = (e) => {
    setAuthCodeSubmitted(false);
    setAuthCode(e.target.value);
  };

  const handleEmailChange = (e) => {
    setSubmitted(false);
    setEmail(e.target.value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handleClearAuthCode = () => {
    setAuthCode('');
    setAuthCodeSubmitted(false);
  };

  const handleClearEmail = () => {
    setEmail('');
    setIsValidEmail(false);
    setSubmitted(false);
  };

  const handleToggleEmailEdit = () => {
    // 이메일 빼고 모든 변수 초기화
    setAuthCode('');
    setSubmitted(false);
    setIsAuthEmail(false);
    setEmail(savedEmail);
    setAuthCodeSubmitted(false);
    setIsMember(false);
    setEmailToken('');
    setPWD2('');
    setPWD3('');
    setIsVisible2(false);
    setIsVisible3(false);
    setIsLongPWD(true);
    setIsSamePWD(true);
    setChageSamePWD(false);
  };

  const handlePWD2Change = (e) => {
    setPWD2(e.target.value);
    setChageSamePWD(false);

    // PWD2의 값 길이가 8자 이상인지 확인
    if (e.target.value.length >= 8) {
      setIsLongPWD(true);
    } else {
      setIsLongPWD(false);
    }
  };
  const handlePWD3Change = (e) => {
    setPWD3(e.target.value);
    setChageSamePWD(false);
  };

  const handleIsVisible2 = () => {
    setIsVisible2(!isVisible2);
  };
  const handleIsVisible3 = () => {
    setIsVisible3(!isVisible3);
  };

  useEffect(() => {
    if (PWD2 && PWD3) {
        if (PWD2 === PWD3) {
            setIsSamePWD(true);
        } else {
            setIsSamePWD(false);
        }
    }
  }, [PWD2, PWD3]); // PWD2 또는 PWD3가 변경될 때마다 이 효과를 실행


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

  return (
    <div className={styles.mainBox}>
      {/* 이메일 인증 전 인증 메일 발송 창 */}
      { !isAuthEmail ?
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          {/* <p>MEETable</p> */}
          {svgList.logoIcon.logo}
        </div>
        <p className={styles.signup}>비밀번호 바꾸기</p>
        <div className={styles.content}>
          <div className={styles.inputHeight}>
            <InputArea
              // className={`${}`}
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
              onClear={handleClearEmail}
            >
              {email ? svgList.loginIcon.delBtn : null}
            </InputArea>

            { isMember ?
              <div className={styles.spaceBetween}></div> : null }

            {/* 이메일 발송 누르면 뜨게 수정 */}
            {/* authCode 입력창 */}
            { isMember && submitted ? // submitted 추가 할말
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
              </div> : null }

            {/* alertzone */}
            { submitted && !isValidEmail ?
              <div className={styles.alertZone}>
                  <div className={``}>
                      <div className={styles.message}>올바른 이메일 주소가 아니에요.</div>
                  </div>
              </div> : null
            }
            { submitted && isValidEmail && !isMember ?
              <div className={styles.alertZone}>
                  <div className={``}>
                      <div className={styles.message}>회원으로 가입되지 않은 이메일이에요.</div>
                  </div>
              </div> : null
            }
            { submitted && isValidEmail && isMember && timerExpired ?
              <div className={styles.alertZone}>
                  <div className={``}>
                      <div className={styles.message}>인증 시간이 만료되었어요.</div>
                  </div>
              </div> : null
            }
            { submitted && isValidEmail && isMember && !timerExpired && authCodeSubmitted ?
              <div className={styles.alertZone}>
                  <div className={``}>
                      <div className={styles.message}>인증코드가 틀려요.</div>
                  </div>
              </div> : null
            }
          </div>

          { !isMember ?
            <SubmitBtn
              text="인증 메일 보내기"
              onClick={sendAuthCode}
              isActive={email}
              className={`${styles.btnWidth}`}
              margin={`0px 0px 0px`}
            /> : null
          }
          { isMember && !authCode ?
            <SubmitBtn
              text="인증 메일 다시 보내기"
              onClick={sendAuthCode}
              isActive={email}
              className={`${styles.btnWidth}`}
              margin={`40px 0px 0px`}
            /> : null
          }
          { isMember && authCode && timerExpired ?
            <SubmitBtn
              text="인증 메일 다시 보내기"
              onClick={sendAuthCode}
              isActive={email}
              className={`${styles.btnWidth}`}
              margin={`40px 0px 0px`}
            /> : null
          }
          { isMember && authCode && !timerExpired ?
            <SubmitBtn
              text="인증하기"
              onClick={confirmAuthCode}
              isActive={authCode && email}
              className={`${styles.btnWidth}`}
              margin={`40px 0px 0px`}
            /> : null
          }
        </div>

        <div className={styles.linkLine}>
          <Link to="/Login" className={styles.loginLink}>
            로그인하기
          </Link>
          <Link className={styles.loginLink}>
            |
          </Link>
          <Link to="/FindEmail" className={styles.loginLink}>
            이메일 찾기
          </Link>
          <Link className={styles.loginLink}>
            |
          </Link>
          <Link to="/EmailAuth" className={styles.loginLink}>
            가입하기
          </Link>
        </div>
      </div> : null }

      {/* 이메일 인증 후 다음 변경 창 */}
      { isAuthEmail && !isValidPWD ?
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          {/* <p>MEETable</p> */}
          {svgList.logoIcon.logo}
        </div>
        <p className={styles.signup}>비밀번호 바꾸기</p>
        <div className={styles.content}>
          <div className={styles.inputHeight2}>
            <InputArea
              className={`${styles.lockEmail}`}
              placeholder="이메일"
              value={savedEmail}
              onClear={handleToggleEmailEdit}
            >
              {svgList.loginIcon.pencilBtn}
            </InputArea>

            <div className={styles.spaceBetween}></div>

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

            {/* alertzone */}
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
            { changeSamePWD ?
              <div className={styles.alertZone}>
                  <div className={``}>
                      <div className={styles.message}>새 비밀번호는 기존 비밀번호와 달라야 해요.</div>
                  </div>
              </div> : null
            }
          </div>

          <SubmitBtn
            text="완료하기"
            onClick={handleChangePWDInfo}
            isActive={PWD2 && PWD3 && isLongPWD && isSamePWD}
            className={`${styles.btnWidth}`}
            margin={`10px 0px 0px`}
          />
        </div>
      </div> : null
      }

      {/* 비밀번호 변경 완료 알림 창 */}
      { isAuthEmail && isValidPWD ? 
      <div className={styles.loginBox2}>
        <p className={styles.pwChanged}>비밀번호가 변경되었어요.</p>
        <div className={styles.content}>
          <SubmitBtn
            text="로그인하기"
            onClick={()=>{window.location.href = '/login'}}
            isActive={isValidPWD}
            className={`${styles.btnWidth}`}
            margin={`-5px 0px 0px`}
          />
        </div>
      </div> : null
      }
    </div>
  );
};

export default ResetPass;