import styles from 'css/AllApmt.module.css';
import { useMemo, useState, useEffect, useRef } from 'react';
import React from "react";
import ApmtItem from './ApmtItem';
import TrashCanIcon from './TrashCanIcon';

const ApmtList = ({ data, fav, isTrash = false, searchApmtVal, selectedItemList, changeName, modifyName, setModifyName, bookmark, unBookmark, openModal, handleShowTrash }) => {
  console.log("ApmtList rendered");
  // console.log("selectedItemList in ApmtList: ", selectedItemList);
  // console.log("data:", data);
  // 필터링된 약속 리스트를 얻기 위한 함수
  const getFilteredApmts = () => {
    let filteredData = data;

    if (searchApmtVal) {
      // 검색어가 있는 경우 검색어를 포함하는 약속만 필터링
      filteredData = filteredData.filter(item => item.promiseName.includes(searchApmtVal) && item.promiseName !== null);
    }

    if (!fav && !isTrash) {
      // fav가 false인 경우, isBookmark가 false인 항목만 필터링
      filteredData = filteredData.filter(item => item.isBookmark === 'F');
    }
    return filteredData;
  };
  // 필터링된 약속 리스트
  const filteredApmts = getFilteredApmts();
  // const parsedList = selectedItemList.map(code => code.split('-')[0]);

  return (
    <div className={styles.ApmtListContainer}>
      {!isTrash && !fav ? <TrashCanIcon onClick={handleShowTrash} openModal={openModal}></TrashCanIcon> : ''}
      {filteredApmts.map((item, index) => {
        // 각 항목의 ID가 selectedItemList에 있는지 확인하여 isSelected 설정
        // // console.log(parsedList);
        // console.log("!!!!!!promiseCode: ", item.promiseCode);
        // console.log("!!!!!!parsedList: ", parsedList);
        const isSelected = selectedItemList.includes(item.promiseCode);
        
        return (
          <ApmtItem
            isTrash={isTrash}
            key={item.promiseCode}
            name={item.promiseName}
            fav={item.isBookmark}
            id={item.promiseCode}
            isSelected={isSelected}
            selectedItemList={selectedItemList}
            modifyName={modifyName}
            setModifyName={setModifyName}
            bookmark={bookmark}
            unBookmark={unBookmark}
            openModal={openModal}
            changeName={changeName}
          />
        );
      })   }

    </div>
  );
};

export default React.memo(ApmtList);
