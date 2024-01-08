import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/FindEmail.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InputArea from '../components/InputArea';
import SubmitBtn from "../components/SubmitBtn";
import { useNavigate } from "react-router-dom";

// 이메일 맞나 백앤드 보내는 과정 수정 필요할듯

const FindEmail = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  const checkMember = async () => {
    setSubmitted(true);
    if (isValidEmail) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/findEmail`, {
          params: {
            name: name,
            email: email
          }
        })
        console.log(response.data)
        setIsMember(true);
      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data.statusCode);
        setIsMember(false);
      }
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setSubmitted(false);
    setEmail(e.target.value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  };

  const handleClearName = () => {
    setName('');
  };

  const handleClearEmail = () => {
    setEmail('');
    setIsValidEmail(false);
    setSubmitted(false);
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <p>MEETable</p>
        </div>
        <p className={styles.signup}>이메일 찾기</p>
        <div className={styles.content}>
          <div className={styles.inputHeight}>
            <InputArea
              // className={`${}`}
              placeholder="이름"
              value={name}
              onChange={handleNameChange}
              onClear={handleClearName}
            >
              {name ? svgList.loginIcon.delBtn : null}
            </InputArea>

            <div className={styles.spaceBetween}></div>

            <InputArea
              // className={`${}`}
              placeholder="이메일"
              value={email}
              onChange={handleEmailChange}
              onClear={handleClearEmail}
            >
              {email ? svgList.loginIcon.delBtn : null}
            </InputArea>

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
                      <div className={styles.message}>가입되지 않은 이메일이에요.</div>
                  </div>
              </div> : null
            }
            {/* 파란 글씨로 스타일 바꾸기 */}
            { submitted && isValidEmail && isMember ?
              <div className={styles.alertZone}>
                  <div className={``}>
                      <div className={styles.messageBlue}>가입된 이메일이에요.</div>
                  </div>
              </div> : null
            }
          </div>

          <SubmitBtn
            text="가입 여부 확인"
            onClick={checkMember}
            isActive={name && email}
            className={`${styles.btnWidth}`}
            margin={`40px 0px 0px`}
          />
        </div>

        <div className={styles.linkLine}>
          <Link to="/Login" className={styles.loginLink}>
            로그인하기
          </Link>
          <Link className={styles.loginLink}>
            |
          </Link>
          <Link to="/ResetPass" className={styles.loginLink}>
            비밀번호 찾기
          </Link>
          <Link className={styles.loginLink}>
            |
          </Link>
          <Link to="/EmailAuth" className={styles.loginLink}>
            가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindEmail;