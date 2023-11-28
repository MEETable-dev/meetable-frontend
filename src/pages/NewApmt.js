import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/NewAmpt.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import { svgList } from "../assets/svg";
import React from "react";
import { Link } from 'react-router-dom';

import PolicyModal from "../components/PolicyModal"
import SubmitBtn from "../components/SubmitBtn";
import CalendarNewApmt from "../components/CalendarNewApmt";
import InputArea from '../components/InputArea';


const NewApmt = () => {

  // 시간 선택 상태 추가
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24);

  // 시간 옵션 생성
  const timeOptions = Array.from({ length: 25 }, (_, i) => (
    <option key={i} value={i}>{i}</option>
  ));

  const [openModal, setOpenModal] = useState(null);

  const toggleModal = (modalId) => {
    setOpenModal(openModal === modalId ? null : modalId);
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


  const elements1 = ['요일 기준', '날짜 기준'];
  const [selectedElement1, setSelectedElement1] = useState('요일 기준');
  // const elements2 = ['날짜만 정하기', '시간 정하기'];
  const [selectedElement2, setSelectedElement2] = useState('날짜만 정하기');
  const elements3 = ['약속에 참여하는 누구나', '나만'];
  const [selectedElement3, setSelectedElement3] = useState('약속에 참여하는 누구나');
  const elements4 = ['약속에 참여하는 누구나'];
  const [selectedElement4, setSelectedElement4] = useState('약속에 참여하는 누구나');


  const handleSelect1 = (element1) => {
    setSelectedElement1(element1);
  };
  const handleSelect2 = (element2) => {
    setSelectedElement2(element2);
  };
  const handleSelect3 = (element3) => {
    setSelectedElement3(element3);
  };
  const handleSelect4 = (element4) => {
    setSelectedElement4(element4);
  };

  const [isMember, setIsMember] = useState(false);  // 멤버 여부 api 받아와서 판별로 바꾸기


  return (
    <div className={`${styles.loginBox} ${
      selectedElement1 === '날짜 기준' 
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
            {elements1.map((element1, index) => (
              <div key={index} className={styles.items}>
                <button className={styles.selectBtn} onClick={() => handleSelect1(element1)}>
                  {selectedElement1 === element1 ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
                </button>
                <div className={styles.selectTxt}>{element1}</div>
              </div>
            ))}
            {selectedElement1 === '날짜 기준' ? (
              <div style={{margin: "0px 0px 0px 7px"}}>
                <CalendarNewApmt spaceX={4} spaceY={4}/>
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
              <button className={styles.selectBtn} onClick={() => setSelectedElement2('날짜만 정하기')}>
                {selectedElement2 === '날짜만 정하기' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
              </button>
              <div>날짜만 정하기</div>
            </div>

            <div className={styles.timeCollectInput}>
              <button className={styles.selectBtn} onClick={() => setSelectedElement2('시간 정하기')}>
                {selectedElement2 === '시간 정하기' ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
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

        {/* 확정하기 권한 */}
        <div className={styles.contentArea}>
          <div className={styles.contentName}>
            <p>확정하기 권한</p>
          </div>
          { isMember ? 
            <div className={styles.contentInput}>
              {elements3.map((element3, index) => (
                <div key={index} className={styles.items}>
                  <button className={styles.selectBtn} onClick={() => handleSelect3(element3)}>
                    {selectedElement3 === element3 ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
                  </button>
                  <div className={styles.selectTxt}>{element3}</div>
                </div>
              ))}
            </div> :
            <div className={styles.contentInput}>
              {elements4.map((element4, index) => (
                <div key={index} className={styles.items}>
                  <button className={styles.selectBtn} onClick={() => handleSelect4(element4)}>
                    {selectedElement4 === element4 ? <div>{svgList.newAmpt.btnSelected}</div> : <div>{svgList.newAmpt.btnNone}</div>}
                  </button>
                  <div className={styles.selectTxt}>{element4}</div>
                </div>
              ))}
            </div>
          }
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
          onClick={() => toggleModal('showCode')} // 누르면 정보 백엔드에 발송도 추가
          isActive={amptName}
          className={`${styles.createBtn}`}
          margin="35px 0px 0px"
        />

      </div>

      {/* modal 띄우기 */}
      {/* policymodal 말고 새로 디자인하기 */}
      {openModal === 'showCode' && <PolicyModal title="약속 공유 링크" onClose={() => toggleModal(null)}>
        여긴 약속 링크 보여주는 창입니당~~~
      </PolicyModal>}

    </div>
  );
};

export default NewApmt;