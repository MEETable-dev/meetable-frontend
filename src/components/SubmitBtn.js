import React from 'react';
import styles from '../css/SubmitBtn.module.css';

const SubmitBtn = ({ text, onClick, isActive, className, disabled, margin }) => {
    // text는 버튼에 쓰일 내용
    // onClick는 눌렀을 때 실행되는 함수
    // isActive는 보라색/회색 및 클릭 가능 여부
    // className은 추가하고자 하는 class
    // disabled는 버튼의 사용 가능/불가능 여부
    // margin은 버튼의 마진을 설정
  return (
    <button
      className={`${styles.submitBtn} ${isActive ? styles.active : styles.disabled} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ margin }} // 여기서 margin prop을 사용하여 스타일 적용 e.g. margin="10px" 입력
    >
      {text}
    </button>
  );
};

export default SubmitBtn;
