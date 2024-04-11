import styles from 'css/AllApmt.module.css';
import React from 'react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { svgList } from 'assets/svg';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ApmtItem = ({ name, fav, id, isSelected, selectedItemList, isTrash = false, modifyName, setModifyName, changeName, bookmark, unBookmark, openModal }) => {
  console.log("selectedItemList: ", selectedItemList);
  console.log("modifyName, isSelected: ", modifyName, isSelected);
  const [value, setValue] = useState('');
  const inputRef = useRef();
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleOnBlur = useCallback((e) => {
    if (value){
      changeName(id, value);
      setModifyName(false);
      setValue('')
    };
  }, [id, changeName, value, setModifyName]);

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
    <div className={isSelected ? styles.ApmtBoxFocused : styles.ApmtBox} onContextMenu={(event) => { event.preventDefault(); openModal(id, event, 'p', selectedItemList) }}>
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
              onChange={onChange} onBlur={handleOnBlur} ref={inputRef} spellCheck={false} /> :
            truncatedName}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ApmtItem);
