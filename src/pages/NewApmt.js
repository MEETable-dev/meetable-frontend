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

      <div className={styles.content}>
        {/* 약속 이름 */}
        <div className={styles.contentArea}>
          <div className={styles.contentName}>
            <p>약속 이름</p>
          </div>
          <div className={styles.contentInput}>
            <div className={`${styles.timeCollectInput} ${styles.inputPadding}`}>
              <InputArea
                placeholder="약속"
                value={amptName}
                onChange={handleAmptNameChange}
                onClear={handleClearAmptName}
              >
                {svgList.loginIcon.delBtn}
              </InputArea>
            </div>
          </div>
        </div>

        {/* 약속 유형 */}
        <div className={styles.contentArea}>
          <div className={styles.contentName}>
            <p>약속 유형</p>
          </div>
          <div className={styles.contentInput}>
            <div className={styles.timeCollectInput}>
              <button className={styles.selectBtn} onClick={() => setSelectedElement1('W')}>
                {selectedElement1 === 'W' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
              </button>
              <div>요일 기준</div>
            </div>

            <div className={styles.timeCollectInput}>
              <button className={styles.selectBtn} onClick={() => setSelectedElement1('D')}>
                {selectedElement1 === 'D' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
              </button>
              <div>날짜 기준</div>
            </div>
            {selectedElement1 === 'D' ? (
              <div className={styles.calendar}>
                <CalendarNewApmt spaceX={4} spaceY={4} selectedDates={selectDate} onDateChange={handleDateChange}/>
              </div>
            ) : null}
          </div>
        </div>

        {/* 시간 선택 */}
        <div className={styles.contentArea}>
          <div className={styles.contentName}>
            <p>시간 선택</p>
          </div>
          <div className={styles.contentInput}>
            {/* '날짜만 정하기' 라디오 버튼 */}
            <div className={styles.timeCollectInput}>
              <button className={styles.selectBtn} onClick={() => setSelectedElement2('T')}>
                {selectedElement2 === 'T' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
              </button>
              <div>날짜만 정하기</div>
            </div>

            <div className={styles.timeCollectInput}>
              <button className={styles.selectBtn} onClick={() => setSelectedElement2('F')}>
                {selectedElement2 === 'F' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
              </button>
              {/* 시간 선택 드롭다운 */}
              <div className={styles.timeSelectContainer}>
                <select
                  className={styles.timeSelect}
                  value={startTime}
                  onChange={handleStartTimeChange}
                >
                  {startTimeOptions}
                </select>
                <span>시부터 </span>
                <select
                  className={styles.timeSelect}
                  value={endTime}
                  onChange={handleEndTimeChange}
                >
                  {endTimeOptions}
                </select>
                <span>시까지</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* 확정하기 권한 */}
        <div className={styles.contentArea}>
          <div className={styles.contentName}>
            <p>약속 유형</p>
          </div>
          <div className={styles.contentInput}>
            <div className={styles.timeCollectInput}>
              <button className={styles.selectBtn} onClick={() => setSelectedElement3('T')}>
                {selectedElement3 === 'T' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
              </button>
              <div>약속에 참여하는 누구나</div>
            </div>

            {isMember ?
              <div className={styles.timeCollectInput}>
                <button className={styles.selectBtn} onClick={() => setSelectedElement3('F')}>
                  {selectedElement3 === 'F' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
                </button>
                <div>나만</div>
              </div> :
              null
            }
          </div>
        </div>

        {/* 멤버 - 내 별명 */}
        {isMember ?
          <div className={styles.contentArea}>
            <div className={styles.contentName}>
              <p>내 별명</p>
            </div>
            <div className={styles.contentInput}>
              <div className={`${styles.timeCollectInput} ${styles.inputPadding}`}>
                <InputArea tArea
                  placeholder="미터블" // 회원가입명으로 디폴트 처리
                  value={nickname}
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
              <p>내 정보 / 비밀번호 변경</p>
            </div>
            <div className={styles.contentInput}>
              <button type="button" 
                onClick={() => toggleModal('serviceTerms')} 
                className={styles.policyArrow}>
                  <div>
                    {svgList.policyIcon.arrow}
                  </div>
              </button>

              <button type="button" 
                onClick={() => toggleModal('marketing')} 
                className={styles.policyArrow}>
                  <div>
                    {svgList.policyIcon.arrow}
                  </div>
              </button>
            </div>
          </div>
          {/* Modals */}
          {openModal === 'serviceTerms' && <MyInfoModal title="" onClose={() => toggleModal(null)}>
            여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!! 여긴 서비스 이용약관 관련 세부 조항 입니다!!!
          </MyInfoModal>}
          {openModal === 'marketing' && <PWChangeModal title="" onClose={() => toggleModal(null)}>
            여긴 마케팅 활용동의 관련 세부 조항 입니당~!~!~!
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