import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/NewAmpt.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import PolicyModal from "../components/PolicyModal"
import SubmitBtn from "../components/SubmitBtn";
import CalendarNewApmt from "../components/CalendarNewApmt";
import InputArea from '../components/InputArea';


const NewApmt = () => {

  const createAmpt = async () => {
    try {
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);

      // selectDate Set을 배열로 변환하고, 각 날짜를 'yyyy-MM-dd' 포맷으로 변환
      const formattedDates = Array.from(selectDate).map(date => format(date, 'yyyy-MM-dd'));
      console.log(formattedDates)
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/promise/create`, {
        promise_name: amptName,
        weekvsdate: selectedElement1,
        ampmvstime: "F", // 2차때 수정
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        date: formattedDates,
        canallconfirm: selectedElement3
      });
      console.log(response.data);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data.statusCode);
    }
  };

  const [selectDate, setSelectDate] = useState(new Set());

  const handleDateChange = (newDate) => {
    // selectDate 업데이트 로직
    setSelectDate(prevSelectDate => {
      const updatedSelectDate = new Set(prevSelectDate);
      if (updatedSelectDate.has(newDate)) {
        updatedSelectDate.delete(newDate);
      } else {
        updatedSelectDate.add(newDate);
      }
      return updatedSelectDate;
    });
    // console.log(selectDate);
  }

  // 시간 선택 상태 추가
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24);

  // 시간 옵션 생성
  const timeOptions = Array.from({ length: 25 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ));

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00:00`;
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


  const [selectedElement1, setSelectedElement1] = useState('W'); // 요일 vs 날짜
  const [selectedElement2, setSelectedElement2] = useState('T'); // 날짜만 vs 시간
  const [selectedElement3, setSelectedElement3] = useState('T'); // 나만 vs 누구든

  const [isMember, setIsMember] = useState(false);  // 멤버 여부 api 받아와서 판별로 바꾸기


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
          <div className={`${styles.contentInput} ${styles.inputPadding}`}>
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
              <div style={{margin: "0px 0px 0px 7px"}}>
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
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {timeOptions}
                </select>
                <span>시부터 </span>
                <select
                  className={styles.timeSelect}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {timeOptions}
                </select>
                <span>시까지</span>
              </div>
            </div>
            
          </div>
        </div>

        {/* 확정하기 권한 new */}
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
            <div className={`${styles.contentInput} ${styles.inputPadding}`}>
              <InputArea
                placeholder="미터블" // 회원가입명으로 디폴트 처리
                value={nickname}
                onChange={handleNicknameChange}
                onClear={handleClearNickname}
              >
                {svgList.loginIcon.delBtn}
              </InputArea>
            </div>
          </div> :
          null
        }

        <SubmitBtn
          text="만들기"
          onClick={createAmpt} // 누르면 정보 백엔드에 발송도 추가
          isActive={amptName && nickname}
          className={`${styles.createBtn}`}
          margin="35px 0px 0px"
        />

      </div>

      {/* 다음으로 넘어가게 만들기 */}

    </div>
  );
};

export default NewApmt;