import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/NewAmpt.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

import SubmitBtn from "../components/SubmitBtn";
import CalendarNewApmt from "../components/CalendarNewApmt";
import InputArea from '../components/InputArea';
import MyInfoModal from "../components/MyInfoModal"
import PWChangeModal from "../components/PWChangeModal"


const NewApmt = () => {
  // 모달 실험용 코드. NewAmpt.js에 붙여넣고 버튼 눌러서 Modal들이 잘 작동하는지 확인하기 위한 것.
  // 내가(주다윤) 만든 것 중 회원가입 후 사용할 수 있는 페이지가 NewAmpt 뿐이라서... 사용...
  // 머지 시 Modal 뜨게 연결하는 것만 여기서 Onclick 시 Modal 뜨는 거 활용해서 갖다 붙이면 될 듯 합니당

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const getUserInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/member/info`, {
        });
        console.log(response.data);

        setUserName(response.data.name);
        setEmail(response.data.email);

        console.log(email)
        console.log(userName)

      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data.statusCode);
      }
  };


  // 모달 실험용
  const [openModal, setOpenModal] = useState(null); // New state for tracking open modal
  const toggleModal = (modalId) => {
    setOpenModal(openModal === modalId ? null : modalId);
  };

  const accessToken = useSelector((state) => state.user.accessToken);
  const navigate = useNavigate();

  const [selectedElement1, setSelectedElement1] = useState('W'); // 요일 vs 날짜
  const [selectedElement2, setSelectedElement2] = useState('T'); // 날짜만 vs 시간
  const [selectedElement3, setSelectedElement3] = useState('T'); // 나만 vs 누구든
  const [isMember, setIsMember] = useState(accessToken);  // 멤버 여부 api 받아와서 판별로 바꾸기 -> ok

  const createAmpt = async () => {
    try {
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);
      const formattedDates = Array.from(selectDate).map(date => format(date, 'yyyy-MM-dd'));
      console.log(formattedDates);
  
      // header
      const config = {
        headers: {
          'Authorization': '@'
        }
      };
      if (isMember) {
        const config = null;
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/promise/create`, {
        promise_name: amptName,
        weekvsdate: selectedElement1,
        ampmvstime: selectedElement2,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        date: formattedDates,
        canallconfirm: selectedElement3
      }, config); // config 객체를 요청과 함께 전달
      console.log(response.data);

      // 여기에서 새로운 링크로 리디렉션하는 로직을 추가합니다.
      const promiseCode = response.data.promiseCode;
      navigate(`/AmptDetail/:${promiseCode}`, {state: {promiseCode: promiseCode}}); // 링크 맞나 확인 필요

    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
    }
  };

  const [selectDate, setSelectDate] = useState(new Set());

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setSelectDate(prevSelectDate => {
      const dateString = format(newDate, 'yyyy-MM-dd');
      const updatedSelectDate = new Set(prevSelectDate);
  
      // 이미 선택된 날짜들을 문자열로 변환하여 비교
      const formattedDates = Array.from(updatedSelectDate).map(date => format(date, 'yyyy-MM-dd'));
  
      if (formattedDates.includes(dateString)) { // 이미 선택된 날짜면 삭제
        updatedSelectDate.forEach(date => {
          if (format(date, 'yyyy-MM-dd') === dateString) {
            updatedSelectDate.delete(date);
          }
        });
      } else { // 새로운 날짜면 추가
        updatedSelectDate.add(newDate);
      }
      return updatedSelectDate;
    });
  }
  
  // 시간 선택 상태 추가
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24);

  const handleStartTimeChange = (e) => {
    setStartTime(parseInt(e.target.value, 10));
  };
  const handleEndTimeChange = (e) => {
    setEndTime(parseInt(e.target.value, 10));
  };

  // 시간 옵션 제한
  const startTimeOptions = Array.from({ length: 25 }, (_, i) => (
    <option key={i} value={i} disabled={i >= endTime}>{i}</option>
  ));
  const endTimeOptions = Array.from({ length: 25 }, (_, i) => (
    <option key={i} value={i} disabled={i <= startTime}>{i}</option>
  ));

  const formatTime = (hour) => {
    if (hour === 24) {
      return '23:59:59';
    } else {
      return `${hour.toString().padStart(2, '0')}:00:00`;
    }
  };
  
  const [amptName, setAmptName] = useState('약속');
  const [nickname, setNickname] = useState('미터블'); // 회원가입명으로 바꾸기

  const handleAmptNameChange = (e) => {
    setAmptName(e.target.value);
  };
  const handleClearAmptName = () => {
    setAmptName('');
  };
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };
  const handleClearNickname = () => {
    setNickname('');
  };

  // selectedElement1 값이 변경될 때 selectDate를 초기화
  useEffect(() => {
    if (selectedElement1 === 'W') {
      setSelectDate(new Set());
    }
  }, [selectedElement1]);

  return (
    <div className={`${styles.loginBox} ${
      selectedElement1 === 'D' 
        ? isMember ? styles.memberDate : styles.nonmemberDate 
        : isMember ? styles.memberWeek : styles.nonmemberWeek
    }`}>
      <div className={styles.loginLogo}>
        <p><b>새 약속 잡기</b></p>
      </div>

      <button onClick={getUserInfo}>유저 정보 얻기</button>

      <div className={styles.content}>

        {/* 멤버 - 내 별명 */}
        {isMember ?
          <div className={styles.contentArea}>
            <div className={styles.contentName}>
              <p>내 별명</p>
            </div>
            <div className={styles.contentInput}>
              <div className={`${styles.timeCollectInput} ${styles.inputPadding}`}>
                <InputArea tArea
                  placeholder="멤버입니다" // 회원가입명으로 디폴트 처리
                  value={userName}
                  onChange={handleNicknameChange}
                  onClear={handleClearNickname}
                >
                  {svgList.loginIcon.delBtn}
                </InputArea>
              </div>
            </div>
          </div> :
          null
        }


        {/* 모달 실험용 */}
        <div className={styles.contentArea}>
            <div className={styles.contentName}>
              <p>모달 실험</p>
            </div>
            <div className={styles.contentInput}>
              <button type="button" 
                onClick={() => toggleModal('serviceTerms')} 
                className={styles.policyArrow}>
                  내 정보
              </button>

              <button type="button" 
                onClick={() => toggleModal('marketing')} 
                className={styles.policyArrow}>
                비밀번호 변경
              </button>
            </div>
          </div>
          {/* Modals */}
          {openModal === 'serviceTerms' && <MyInfoModal onClose={() => toggleModal(null)}>
            내 정보 모달
          </MyInfoModal>}
          {openModal === 'marketing' && <PWChangeModal onClose={() => toggleModal(null)}>
            비밀번호 변경 모달
          </PWChangeModal>}

        <SubmitBtn
          text="만들기"
          onClick={createAmpt} // 누르면 정보 백엔드에 발송도 추가
          isActive={amptName && nickname}
          className={`${styles.createBtn}`}
        />

      </div>

    </div>
  );
};

export default NewApmt;