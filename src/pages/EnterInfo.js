import styles from 'css/EnterInfo.module.css';
import { Link } from "react-router-dom";
import SubmitBtn2 from "components/SubmitBtn2";
import { useSelector } from "react-redux";
import InputArea2 from 'components/InputArea2';
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import { SlEye } from "react-icons/sl";
import { BsEyeSlash } from "react-icons/bs";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import LockedInputArea from "components/LockedInputArea";




const EnterInfo = () => {
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const isPWSame = password === checkPassword &&password !=="" &&checkPassword !=="";
  const [errorMessage, setErrorMessage] = useState(true);
  const [isValidPW, setIsValidPW] = useState(false);
  const [signToken, setSignToken] = useState('');
  // const [emailToken, setEmailToken] = useState('');
  const [isValidSignToken, setIsValidSignToken] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [emailToken, setEmailToken] = useState('');
  const navigate = useNavigate();



  let isValid = email !== "" && password !== "" && checkPassword !== "" && username !== "" ;
  console.log(location);
  const [passwordType, setPasswordType] = useState({
      type: 'password',
      visible: false
  });
    const [checkPasswordType, setCheckPasswordType] = useState({
      type: 'password',
      visible: false
  });


  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email);
      setEmailToken(location.state.emailToken);
    }
  }, [location.state]);

  //password type 변경하는 함수
  const handlePasswordType = e => {
      setPasswordType(() => {
          if (!passwordType.visible) {
              return { type: 'text', visible: true };
          }
          return { type: 'password', visible: false };
      })
  };

  const handleCheckPasswordType = e => {
    setCheckPasswordType(() => {
        if (!checkPasswordType.visible) {
            return { type: 'text', visible: true };
        }
        return { type: 'password', visible: false };
    })
};

  // const onChangeEmail = e =>{
  //     setEmail(e.target.value);
  // };

  const onChangeUsername = e =>{
      setUsername(e.target.value);
  };

  const onChangePassword = e =>{
      setPassword(e.target.value);
      handleIsValidPW();
  };

  const onChangeCheckPassword = e =>{
      setCheckPassword(e.target.value);
      handleIsValidPW();
  };

  // const handleClearEmail = () =>{
  //   setEmail('');
  //   isValid = false;
  // };

  const handleIsValidPW = ()=>{
    if ( 1<= password.length  && password.length< 8){
      setIsValidPW(false);
      setErrorMessage(true);
    }
    else if (password.length>=8){
      setIsValidPW(true);
      setErrorMessage(false);
    }
  };
  
  const handleEmailEditClick = () =>{
    window.location.href = '/EmailAuth';
  };

  const getSignToken = async(e) =>{
    e.preventDefault();
    handleIsValidPW();
    try{
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signToken`, {
        name: username,
        emailToken: emailToken,
        pwd: password
      })
      setSignToken(response.data.data.signToken);
      setIsValidSignToken(true);
      console.log(response.data);
      navigate('/Policy', {state: {signToken: signToken}});
      //policy에서 사인토큰 받을때 useLocation을 이용해서 location.state.signToken 으로 받으면 됩니당!
    } catch(error){
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
      setIsValidSignToken(false);

    }
  };

  // const handleSubmitInfo = async(e)=>{
  //   e.preventDefault();
  //   getSignToken();
  //   if (isValidSignToken===true){
  //     try{
  //       const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
  //         sign
  //       })

  //     } catch(error){

  //     }
  //   }
  // }



return ( <div className={styles.loginBox}>
  <div className={styles.loginLogo}>
    <h2>MEETable</h2>
    <form className={styles.content}>
      <InputArea2 autocomplete="username" name="name" placeholder="이름" value={username} onChange = {onChangeUsername}>
      </InputArea2>
      <LockedInputArea autoComplete="email" name="email" type="id"  value = {email} 
      onClick={handleEmailEditClick}>{svgList.loginIcon.pencilBtn}
      </LockedInputArea> 
      <InputArea2 autoComplete="new-password" name="password" type={passwordType.type} placeholder="비밀번호" value={password} onChange = {onChangePassword}
      onClear ={handlePasswordType}>
      { passwordType.visible ?  <BsEyeSlash size="24px" color="#888888"></BsEyeSlash> :<SlEye size="24px" color="#888888"></SlEye>}
      </InputArea2>
      <InputArea2  autoComplete="new-password" name="Checkpassword" type={checkPasswordType.type} placeholder="비밀번호 확인"  value={checkPassword} onChange = {onChangeCheckPassword}
      onClear={handleCheckPasswordType}>{ checkPasswordType.visible ?  <BsEyeSlash size="24px" color="#888888"></BsEyeSlash> :<SlEye size="24px" color="#888888"></SlEye>}
      </InputArea2> 
      <div className={styles.alertZone}>
        <div className={`${styles.errorMsg} ${ isPWSame && !isValidPW && isValid ? '' : styles.hidden}`}>
          <div className = {styles.message}>비밀번호는 8자 이상이어야 해요.</div>
        </div>
        <div className={`${styles.errorMsg} ${ ! isPWSame && isValidPW && isValid ? '' : styles.hidden}`}>
          <div className = {styles.message}>비밀번호가 일치하지 않아요.</div>
        </div>
      </div>
      <SubmitBtn2 text="회원가입" isActive={isValid} onClick={getSignToken}></SubmitBtn2>

    </form>




  </div>
</div>);
};

export default EnterInfo;