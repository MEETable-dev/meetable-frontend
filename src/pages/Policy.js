import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/Policy.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios";
import PolicyModal from "../components/PolicyModal"
import SubmitBtn from "../components/SubmitBtn";

const Policy = () => {
  const [openModal, setOpenModal] = useState(null); // New state for tracking open modal
  const location = useLocation();
  const [signToken, setSignToken] = useState('');

  const toggleModal = (modalId) => {
    setOpenModal(openModal === modalId ? null : modalId);
  };

  const [isCheckedAll, setCheckedAll] = useState(false);
  const [isChecked1, setChecked1] = useState(false);
  const [isChecked2, setChecked2] = useState(false);
  const [isChecked3, setChecked3] = useState(false);

  const handleCheckboxChangeAll = () => {
    setCheckedAll(!isCheckedAll);
    setChecked1(!isCheckedAll);
    setChecked2(!isCheckedAll);
    setChecked3(!isCheckedAll);
  };
  const handleCheckboxChange1 = () => {
    setChecked1(!isChecked1);
  };
  const handleCheckboxChange2 = () => {
    setChecked2(!isChecked2);
  };
  const handleCheckboxChange3 = () => {
    setChecked3(!isChecked3);
  };

  const signup = async () => {
    var policyval = 'T';
    if (!isChecked3) {policyval = 'F';}
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        signToken:signToken,
        marketingPolicy:policyval,
      });
      console.log(response.data)
      window.location.href = '/login';
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data);
    }
  }

  //여기서 signtoken을 받습니다!!
  useEffect(() => {
    if (location.state) {
      setSignToken(location.state.signToken);
      console.log(location.state.signToken)
    }
  }, [location.state]);

  // 모든 체크박스의 상태를 감시하여 전체 선택 체크박스 상태 업데이트
  useEffect(() => {
    setCheckedAll(isChecked1 && isChecked2 && isChecked3);
  }, [isChecked1, isChecked2, isChecked3]);

  return (
    <div className={styles.loginBox}>
      <div className={styles.loginLogo}>
        {/* <p>MEETable</p> */}
        <Link to="/">
          {svgList.logoIcon.logo}
        </Link>
      </div>
      {/* <h4>이용약관</h4> */}
      <h4></h4>
      <div className={styles.content}>
        <div className={styles.policyZone}>

          {/* 모두 동의 */}
          <div className={styles.inputBlock}>
            <div className={styles.detailArea}>
              <button type="button"
                onClick={handleCheckboxChangeAll} 
                className={styles.policyCheckBox}>
                <div>
                  {isCheckedAll ? svgList.policyIcon.checkBoxChcked : svgList.policyIcon.checkBoxNotChecked}
                </div>
              </button>
              <div className={""}>
                모두 동의합니다.
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className={styles.lineArea}>
            <div className={styles.underLine}></div>
          </div>

          {/* 서비스 이용약관 */}
          <div className={styles.inputBlock}>
            <div className={styles.detailArea}>
              <button type="button"
                onClick={handleCheckboxChange1} 
                className={styles.policyCheckBox}>
                <div>
                  {isChecked1 ? svgList.policyIcon.checkBoxChcked : svgList.policyIcon.checkBoxNotChecked}
                </div>
              </button>
              <div className={""}>
                [필수] 서비스 이용약관
              </div>
            </div>

            <button type="button" 
            onClick={() => toggleModal('serviceTerms')} 
            className={styles.policyArrow}>
              <div>
                {svgList.policyIcon.arrow}
              </div>
            </button>
          </div>


          {/* 개인정보처리방침 */}
          <div className={styles.inputBlock}>
            <div className={styles.detailArea}>
              <button type="button"
                onClick={handleCheckboxChange2} 
                className={styles.policyCheckBox}>
                <div>
                  {isChecked2 ? svgList.policyIcon.checkBoxChcked : svgList.policyIcon.checkBoxNotChecked}
                </div>
              </button>
              <div className={""}>
                [필수] 개인정보처리방침
              </div>
            </div>

            <button type="button" 
              onClick={() => toggleModal('serviceTerms')} 
              className={styles.policyArrow}>
              <div>
                {svgList.policyIcon.arrow}
              </div>
            </button>
          </div>

          {/* 마케팅 활용 동의 */}
          <div className={styles.inputBlock}>
            <div className={styles.detailArea}>
              <button type="button"
                onClick={handleCheckboxChange3} 
                className={styles.policyCheckBox}>
                <div>
                  {isChecked3 ? svgList.policyIcon.checkBoxChcked : svgList.policyIcon.checkBoxNotChecked}
                </div>
              </button>
              <div className={""}>
                [선택] 마케팅 활용 동의
              </div>
            </div>
            <button type="button" 
              onClick={() => toggleModal('marketing')} 
              className={styles.policyArrow}>
                <div>
                  {svgList.policyIcon.arrow}
                </div>
            </button>
          </div>
        </div>
        {/* <Link to={isChecked1 && isChecked2 ? "/login" : ''} className={styles.link}> */}
        <div className={styles.link} 
            onClick={()=>{signup();}}>
          <SubmitBtn
            text="동의하기"
            isActive={isChecked1 && isChecked2}
            className={styles.submitBtn}
            margin={"20px 0px 0px"}
          />
        </div>
        {/* </Link> */}
      </div>

      {/* Modals */}
      {openModal === 'serviceTerms' && <PolicyModal title="서비스 이용약관" onClose={() => toggleModal(null)}>
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
        여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
      </PolicyModal>}
      {openModal === 'individualInfo' && <PolicyModal title="개인정보처리방침(필수)" onClose={() => toggleModal(null)}>
        여긴 개인정보처리방침 관련 세부 조항 입니당~~~
      </PolicyModal>}
      {openModal === 'marketing' && <PolicyModal title="마케팅 활용 동의" onClose={() => toggleModal(null)}>
        여긴 마케팅 활용동의 관련 세부 조항 입니당~!~!~!
      </PolicyModal>}

    </div>
  );
};

export default Policy;