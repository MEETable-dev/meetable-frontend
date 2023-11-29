import styles from 'css/login.module.css';
import { Link } from "react-router-dom";
import SubmitBtn2 from "components/SubmitBtn2";
import { useSelector } from "react-redux";
import InputArea from 'components/InputArea';
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import { setToken } from 'store/modules/user';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLogin, setKeepLogin] = useState(false);
  const ExistInput = email !=="" && password !=="";
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [pwSubmitted, setPwSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();
  // 쿼리 파라미터 받아오기
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  

  const onChangeEmail = e =>{
      setEmail(e.target.value);
  };

  const onChangePassword = e =>{
      setPassword(e.target.value);
  };

  const onChangeKeepLogin = e =>{
    setKeepLogin(true);
    console.log("로그인 유지");
  };
  const handleClearEmail = () => {
    setEmail('');
  };

  const handleClearPw = () => {
    setPassword('');
  };

  //로그인하기 버튼을 누른경우
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    //이메일 아이디 제출을 true로 바꾸기
    setEmailSubmitted(true);
    setPwSubmitted(true);

    try{
      //로그인 하는 데에 post 하고 토큰 받아오기
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email: email ,
        pwd: password})

        setErrorMessage(false);
        //토큰 발행에 성공한경우 토큰을 받아오기
        setIsUser(true);
        dispatch(setToken(response.jwt));

        //이전에 있던 url 링크 받아오기
        const redirectUrl = searchParams.get("redirectUrl");
        console.log(response.data);

        //특정 시간이 지나면 redirected url로 돌아가기
        setTimeout(()=> {
          if (redirectUrl) {
            navigate(redirectUrl);
          } else {
            navigate("/");
          }
        }, 2000);

    } catch(error){

      //유저가 아닌경우
      const errorResponse = error.response;
      setErrorMessage(true);
      setIsUser(false);
      console.log(errorResponse.data.statusCode);


    }
  };

  

return ( <div className={styles.loginBox}>
  <div className={styles.loginLogo}>
    <h2>MEETable</h2>
    <form className={styles.content}>
      <InputArea autoComplete="email" name="email" type="id" placeholder="meetable2@meetable.com" value = {email} onChange = {onChangeEmail}
      onClear ={handleClearEmail}>
      {emailSubmitted && pwSubmitted && !errorMessage ? svgList.loginIcon.delBtn : ''}
      </InputArea>
      <InputArea autoComplete="password" name="password" type="password" placeholder="비밀번호" value = {password} onChange = {onChangePassword}
      onClear={handleClearPw}>
      {emailSubmitted && pwSubmitted && !errorMessage ? svgList.loginIcon.delBtn: ''}
      </InputArea>         

      <div className={styles.alertZone}>
        <div className={`${styles.errorMsg} ${pwSubmitted && emailSubmitted & !isUser ? '' : styles.hidden}`}>
          <div className = {styles.message}>이메일이나 비밀번호가 잘못되었어요.</div>
        </div>
      </div>
      <div className={styles.inputBlock}>
        <input className={styles.CheckBox} type="checkbox" value={keepLogin} onChange = {onChangeKeepLogin} ></input>
        <label>
          <span >로그인유지</span>
        </label>
      </div>
      <SubmitBtn2 text="로그인" isActive={ExistInput} onClick={handleLoginSubmit}></SubmitBtn2>
      <div className ={styles.footerBlock}>
        <Link to="/FindEmail" className={styles.footerLink}>이메일 찾기</Link>
        <span className={styles.footerLink}>|</span>
        <Link to="/ResetPass"className={styles.footerLink}>비밀번호 찾기</Link>
        <span className={styles.footerLink}>|</span>
        <Link to="/EmailAuth"className={styles.footerLink}>가입하기</Link>
      </div>
    </form>


  </div>

</div>);
};

export default Login;