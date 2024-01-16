import React from 'react';
import styles from '../css/Logo.module.css';

const Logo = ({ text, onClick, isActive, className, disabled, margin }) => {
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

export default Logo;
