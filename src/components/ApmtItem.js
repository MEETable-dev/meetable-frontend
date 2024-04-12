import styles from 'css/AllApmt.module.css';
import React from 'react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { svgList } from 'assets/svg';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';



const ApmtItem = ({ name, fav, id, isSelected, selectedItemList, isTrash = false, modifyName, setModifyName, changeName, bookmark, unBookmark, openModal }) => {
  console.log("selectedItemList: ", selectedItemList);
  console.log("modifyName, isSelected: ", modifyName, isSelected);
  const [value, setValue] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      
      if (value) {
        changeName(id, value);
        setModifyName(false);
        setValue('');
      }
    }
  }, [id, changeName, value, setModifyName]);

  const handleOnBlur = useCallback((e) => {
    if (value){
      changeName(id, value);
      setModifyName(false);
      setValue('')
    };
  }, [id, changeName, value, setModifyName]);

  const handleClickPromise = useCallback(() => {

    const username = "username";  // 이 부분을 동적으로 대체할 필요가 있을수도
    console.log("clicked Promise Id: ", id);
    navigate(`/ApmtDetail/:${id}`);
  }, [id, navigate]);

  useEffect(() => {
    if (isSelected) {
      setValue(name);
    }
  }, [name, isSelected]);

  useEffect(() => {
    if (isSelected && modifyName) {
      inputRef.current.focus();
    }
  }, [isSelected, modifyName]);

  let truncatedName = name;

  if (name){
    truncatedName = name.length > 12 ? name.slice(0, 12) + "..." : name;
  }


  return (
    <div className={isSelected ? styles.ApmtBoxFocused : styles.ApmtBox} onContextMenu={(event) => { event.preventDefault(); openModal(id, event, 'p', selectedItemList) }} onClick={()=>{handleClickPromise()}}>
      <div className={styles.ApmtIcon}>
        {svgList.folder.Apmt}
      </div>
      <div className={styles.ApmtName}>
        {(fav === 'T') && !isTrash && <AiFillStar color="#FFBB0D" size={22} className={styles.favoritesIcon} onClick={() => { unBookmark(id) }} />}
        {!(fav === 'T') && !isTrash && <AiOutlineStar color="#888888" size={22} className={styles.favoritesIcon} onClick={() => { bookmark(id) }} />}
        {isTrash && ''}
        <div className={styles.favoritesText}>
          {isSelected && modifyName && !isTrash ?
            <input value={value} name="writeName" className={styles.renameInput}
              onChange={onChange} onBlur={handleOnBlur} onKeyDown= {handleKeyDown} ref={inputRef} spellCheck={false} /> :
            truncatedName}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ApmtItem);
