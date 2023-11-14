import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/Policy.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";

const Policy = () => {

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
              // onClick={}
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
              // onClick={}
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
              // onClick={}
              className={styles.policyArrow}>
              <div>
                {svgList.policyIcon.arrow}
              </div>
            </button>
          </div>
        </div>

        <button type="submit"
        className={`${styles.submitBtn} ${isChecked1 && isChecked2 ? styles.active : ''}`}>
              동의하기
        </button>
      </div>
    </div>
  );
};

export default Policy;