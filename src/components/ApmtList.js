import styles from 'css/AllApmt.module.css';
import {useMemo, useState, useEffect, useRef} from 'react';
import React from "react";
import ApmtItem from './ApmtItem';
import TrashCanIcon from './TrashCanIcon';


const ApmtList = ({ data, fav, isTrash = false, searchApmtVal ,selectedItemID, changeName,modifyName,setModifyName, bookmark, unBookmark, openModal ,handleShowTrash}) => {
  console.log("ApmtList rendered");
  // 필터링된 약속 리스트를 얻기 위한 함수
  const getFilteredApmts = () => {
    if (searchApmtVal) {
      // 검색어가 있는 경우 검색어를 포함하는 약속만 필터링
      return data.filter(item => item.promiseName.includes(searchApmtVal));
    }
    // 검색어가 없는 경우 전체 약속 반환
    return data;
  };
  // 필터링된 약속 리스트
  const filteredApmts = getFilteredApmts();

  return (
    <div className={styles.ApmtListContainer}>
      {!isTrash && !fav ? <TrashCanIcon onClick={handleShowTrash}></TrashCanIcon> : ''}
      {filteredApmts.map((item, index) => (
        <ApmtItem
          isTrash={isTrash}
          key={item.promiseCode}
          name={item.promiseName}
          fav={item.isBookmark}
          id={fav ? 'fav-' + item.promiseCode : 'my-' + item.promiseCode}
          selectedItemID={selectedItemID}
          modifyName={modifyName}
          setModifyName={setModifyName}
          bookmark={bookmark}
          unBookmark={unBookmark}
          openModal={openModal}
          changeName={changeName}
        />
      ))}
    </div>
  );
};

  export default React.memo(ApmtList);