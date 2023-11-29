import styles from 'css/InputArea2.module.css';
import React from "react";

const InputArea2 = ({ className, placeholder, value, onChange, onClear, children , type}) => {
  return (
    // 전체 크기는 기본 가로 260px
    // 화면 크기 작아질 땐 가로줄은 그냥 줄어들고 기본적으로 입력 input의 크기가 줄어듦
    // 이메일 기준으로 작성한 것이기에 isSubmitted가 되면 lock이 걸림
    // -> 이메일 lock 된 상태에서는 true, 아닌 상태(기본 다른 요소)일 땐 항상 false로 꺼두면 될듯
    // errorMessage는 여부에 따라 lock 걸리는거 조절하는 거기 때문에 is_Submitted랑 맞춰 대충 조절하면 될듯
    // children은 버튼으로 들어가는 svg 요소
    <div className={styles.infoArea}> {/* 전체 요소 (아래 라인 포함) 감싸는 박스*/}
      <div className={styles.inputBlock}>
        <input
          // 이메일 lock 상태로 바꾸려면 css에 input.lockEmail를 페이지 css에 복붙해서 아래 방식과 비슷하게 활용하면 됨
          // className={`${styles.inputEmail} ${isSubmitted && !errorMessage ? styles.lockEmail : ''}`}
          className={`${styles.StyledInput}`}
          placeholder={placeholder}
          autoComplete="email"
          value={value}
          onChange={onChange}
          type = {type}
        />
        <span className={styles.btnRegion}>
          {value && (
            <button
              className={styles.del}
              type="button"
              onClick={onClear}
            >
              <div>{children}</div>
            </button>
          )}
        </span>
      </div>
      <div className={styles.underLine}></div>
    </div>
  );
};

export default InputArea2;