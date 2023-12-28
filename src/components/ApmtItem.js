import styles from 'css/AllApmt.module.css';
import React from 'react';
import { useCallback , useState, useEffect, useRef} from 'react';
import { svgList } from 'assets/svg';
import {AiFillStar , AiOutlineStar} from "react-icons/ai";

const ApmtItem = ({ name, fav, id , isTrash= false, selectedItemID, modifyName,setModifyName, changeName, bookmark, unBookmark, openModal}) => {
  const [value, setValue]= useState('');
  const inputRef = useRef();
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleOnBlur = useCallback((e)=>{
    
    changeName(selectedItemID, value);
    setModifyName(false);
    setValue('')
    
  },[selectedItemID, changeName, value, setModifyName]);

  useEffect(() => {
    if (selectedItemID===id) {
      setValue(name);
    }
  }, [name, selectedItemID, id]);

  useEffect(() => {
    if (selectedItemID === id && modifyName) {
      inputRef.current.focus();
    }
  }, [id, selectedItemID, modifyName]);

  const truncatedName = name.length > 12 ? name.slice(0, 12) + "..." : name;
  return (
    <div className={selectedItemID===id ? styles.ApmtBoxFocused : styles.ApmtBox} onContextMenu={(event)=>{ event.preventDefault(); openModal(id, event, 'p', name)}}>
      <div className={styles.ApmtIcon}>
      {svgList.folder.Apmt}
      </div>
      <div className={styles.ApmtName}>
        {(fav === 'T')&& !isTrash &&<AiFillStar color="#FFBB0D" size={22} className={styles.favoritesIcon}  onClick={()=>{unBookmark(id)}}/>}
        {!(fav === 'T') && !isTrash && <AiOutlineStar color="#888888" size={22} className={styles.favoritesIcon} onClick={()=>{bookmark(id)}}/>}
        {isTrash && ''}
        <div className={styles.favoritesText}>
              {(selectedItemID === id && modifyName) ? <input value={value} name="writeName" className={styles.renameInput}
              onChange ={onChange}  onBlur={handleOnBlur} ref={inputRef}
               /> : truncatedName}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ApmtItem);