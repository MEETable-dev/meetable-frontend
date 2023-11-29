import React from 'react';
import styles from 'css/SubmitBtn2.module.css';


const SubmitBtn2 = ({ text, onClick, isActive, className, disabled }) => {
    // text는 버튼에 쓰일 내용
    // onClick는 눌렀을 때 실행되는 함수
    // isActive는 보라색/회색 및 클릭 가능 여부
    // className은 추가하고자 하는 class
    // disabled는 버튼의 사용 가능/불가능 여부
  return (
    <button
      className={`${styles.submitBtn} ${isActive ? styles.active : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SubmitBtn2;
