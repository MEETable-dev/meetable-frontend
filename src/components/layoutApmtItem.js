import { useNavigate } from "react-router-dom";
import styles from '../css/Layout.module.css';
import { useCallback,  useState, useEffect, useRef } from "react";
import { svgList } from "../assets/svg";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";

const LayoutApmtItem = ({ name, fav, id, isSelected, selectedItemList, isTrash = false, modifyName, setModifyName, changeName, bookmark, unBookmark, openModal }) => {
    // console.log("selectedItemList: ", selectedItemList);
    // console.log("modifyName, isSelected: ", modifyName, isSelected);
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
      <div className={isSelected ? styles.listItemsContainerFocused : styles.listItemsContainer} onContextMenu={(event) => { event.preventDefault(); openModal(id, event, 'p', selectedItemList) }} >
        <div className={styles.listItems}>
          {(fav === 'T') && !isTrash && <AiFillStar color="#FFBB0D" size={22} className={styles.favoritesIcon} onClick={() => { unBookmark(id) }} />}
          {!(fav === 'T') && !isTrash && <AiOutlineStar color="#888888" size={22} className={styles.favoritesIcon} onClick={() => { bookmark(id) }} />}
          {isTrash && ''}
          <div className={styles.listIcon} onClick={()=>{handleClickPromise()}}>
            {isSelected && modifyName && !isTrash ?
              <input value={value} name="writeName" className={styles.renameInput}
                onChange={onChange} onBlur={handleOnBlur} onKeyDown= {handleKeyDown} ref={inputRef} spellCheck={false} /> :
              truncatedName}
          </div>
        </div>
        <div className={styles.btnArea} onClick={(event) => {openModal(id, event, 'p', name);}}>{svgList.folder.more}</div>
      </div>
    );
  };
  
  export default React.memo(LayoutApmtItem);