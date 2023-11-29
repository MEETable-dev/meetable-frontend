import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/Policy.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import PolicyModal from "../components/PolicyModal"
import SubmitBtn from "../components/SubmitBtn2";

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

  //여기서 signtoken을 받습니다!!
  useEffect(() => {
    if (location.state) {
      setSignToken(location.state.signToken);
    }
  }, [location.state]);

  // 모든 체크박스의 상태를 감시하여 전체 선택 체크박스 상태 업데이트
  useEffect(() => {
    setCheckedAll(isChecked1 && isChecked2 && isChecked3);
  }, [isChecked1, isChecked2, isChecked3]);

  return (
    <div className={styles.loginBox}>
      <div className={styles.loginLogo}>
        <h2>MEETable</h2>
      </div>
      {/* <h4>이용약관</h4> */}
      <h4></h4>
      <div className={styles.content}>
        <div className={styles.policyZone}>
          <label>
            <input className={styles.checkBox}
              type="checkbox"
              checked={isCheckedAll}
              onChange={handleCheckboxChangeAll}/>
            모두 동의합니다.
          </label>

          <div className={styles.lineArea}>
            <div className={styles.underLine}></div>
          </div>

          <div className={styles.inputBlock}>
            <label className={styles.detailPolicy}>
              <div>
                <input className={styles.checkBox}
                  type="checkbox"
                  checked={isChecked1}
                  onChange={handleCheckboxChange1}/>
                [필수] 서비스 이용약관
              </div>
            </label>
            <button type="button" 
            onClick={() => toggleModal('serviceTerms')} 
            className={styles.policyArrow}>
              <div>
                {svgList.policyIcon.arrow}
              </div>
            </button>
          </div>

          <div className={styles.inputBlock}>
            <label className={styles.detailPolicy}>
              <div>
                <input className={styles.checkBox}
                  type="checkbox"
                  checked={isChecked2}
                  onChange={handleCheckboxChange2}/>
                [필수] 개인정보처리방침
              </div>
            </label>
            <button type="button" 
              onClick={() => toggleModal('individualInfo')} 
              className={styles.policyArrow}>
                <div>
                  {svgList.policyIcon.arrow}
                </div>
            </button>
          </div>

          <div className={styles.inputBlock}>
            <label className={styles.detailPolicy}>
              <div>
                <input className={styles.checkBox}
                  type="checkbox"
                  checked={isChecked3}
                  onChange={handleCheckboxChange3}/>
                [선택] 마케팅 활용 동의
              </div>
            </label>
            <button type="button" 
              onClick={() => toggleModal('marketing')} 
              className={styles.policyArrow}>
                <div>
                  {svgList.policyIcon.arrow}
                </div>
            </button>
          </div>
        </div>
        <Link to={isChecked1 && isChecked2 ? "/login" : ''} className={styles.link}>
          <SubmitBtn
            text="동의하기"
            isActive={isChecked1 && isChecked2}
            className={''}
          />
        </Link>
      </div>

      {/* Modals */}
      {openModal === 'serviceTerms' && <PolicyModal title="서비스 이용약관" onClose={() => toggleModal(null)}>
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