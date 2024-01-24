import styles from 'css/AllApmt.module.css';
import { IoSyncOutline, IoCheckboxOutline } from "react-icons/io5";
import { AiOutlineFileAdd , AiFillStar , AiOutlineStar} from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";
import { svgList } from 'assets/svg';
import {useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from "react-redux";
import React from "react";
import { GoChevronUp , GoChevronDown } from "react-icons/go";
import { useAppDispatch } from "store";
import  axios  from 'axios';
import { TiDelete } from "react-icons/ti";
import ApmtList from 'components/ApmtList';
import NotionModal from 'components/NotionModal';
import { useNavigate } from 'react-router-dom';



const AllApmt = () => {
  const dispatch = useAppDispatch();
  const [searchApmtVal, setSearchApmtVal] = useState('');
  const [showModal, setShowModal] = useState('');
  const [showHeaderModal, setShowHeaderModal] = useState('');
  const [modalPosition, setModalPosition] = useState({x:0, y:0});
  const [showNotionModal, setShowNotionModal] = useState('');

  //BookMark + Selected + Apmt
  const [bookmarkData, setBookmarkData] = useState([]);
  const [ApmtData, setApmtData] = useState([]);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [favoritesDown, setFavoritesDownClick] = useState(true);

  //Trash Area
  const [TrashData, setTrashData] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  //Name Modification + Modals
  const [selectAll, setSelectAll] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [modifyName, setModifyName] = useState(false);

  const modalRef = useRef();
  const modalHeaderRef = useRef();
  const notionModalRef = useRef();

  // 입력값을 가져와서 소문자로변경

  const handleFavoritesDownClick = () =>{
    if (favoritesDown===true){
      setFavoritesDownClick(false);}
    else{
      setFavoritesDownClick(true);
    }
  };
  const handleShowTrash = useCallback ((e)=>{
    setShowTrash(!showTrash);
  },[showTrash]);

  const handleSelectAll = ()=>{
    if (selectAll===true){
      setSelectAll(false);
      setSelectedList([]);
    }
    else{
      setSelectAll(true);
      setSelectedList(ApmtData);
      //selectedList에 모든 object추가하기
    }};

  const closeNotionModal = (e) =>{
    setShowNotionModal('');
    setSelectedItemID(null);
  };

  const restoreApmt = async (promiseCode) =>{
    console.log('restore',promiseCode);
    console.log('ApmtData', ApmtData);
    try{
      const response = await axios.patch( `${process.env.REACT_APP_API_URL}/home/restore`, 
        {promiseId: promiseCode.split('-')[1].split('_')[0]});
      await getData();
      await getTrashData();
      console.log(response);
    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }};
  //Notion Modal Zone
  //약속 삭제(휴지통으로 이동)
  const moveApmtToTrash = async (promiseCode)=>{
    try{
      const response = await axios.patch( `${process.env.REACT_APP_API_URL}/home/deletepromise`, 
        {promiseId: promiseCode.split('-')[1].split('_')[0]});
      await getData();
      await getTrashData();
      console.log(response);
    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }};

  //약속에서 빠지기
  const backoutApmt = async (promiseCode) =>{
    console.log(ApmtData);
    try{
      const response = await axios.delete( `${process.env.REACT_APP_API_URL}/home/backoutpromise`,
        {promiseId: promiseCode.split('-')[1].split('_')[0]});
      console.log(response.data);
      await getData();
      await getTrashData();
      console.log(promiseCode);

    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }};

    //휴지통 비우기(모든 약속에서 빠지기)

    const backoutAll = async (TrashData) =>{
      console.log(TrashData);
      try{
        const response = await axios.delete( `${process.env.REACT_APP_API_URL}/home/backoutall`,)
        console.log(response.data);
        await getData();
        await getTrashData();
        console.log(TrashData)
  
      } catch(error){
        const errorResponse= error.response;
        console.log(errorResponse.data);
      }};
  
  const openModal = useCallback ((itemID, event, type) => {
    if (type === 'p'){
      event.preventDefault();
      setModalPosition({x:event.pageX, y:event.pageY});
      setSelectedItemID(itemID);
      setModifyName(false);
      //이부분 list 를 모달이랑 어떻게 같이 할지 ㅁㄹ겠네... 동시에 이름변경이 안되니까 막는게 맞는건지..
      setShowModal(type);}
    else{
      event.preventDefault();
      setModalPosition({x:event.pageX, y:event.pageY});
      setShowModal(type);
    }
    // setSelectedList([...selectedList, itemID]);
  },[]);

  const closeModal = (itemID) => {
    setShowModal('');
    setSelectedItemID(null);
    setModifyName(false);
    //이부분 list 를 모달이랑 어떻게 같이 할지 ㅁㄹ겠네... 동시에 이름변경이 안되니까 막는게 맞는건지..
    // selectedList.splice(selectedList.indexOf(itemID), 1);
    // setSelectedList([...selectedList]);
  };

  const modalStyle = {
    position: 'absolute',
    top:`${modalPosition.y}px`,
    left:`${modalPosition.x}px`,
  };

  const ContextMenuModal = ({  onClose, style, type , showTrash, selectedItemID}) => {
    console.log("ContextMenuModal rendered");
    return  (
      (!showTrash && type === 'p' && (
        <div style={style}>
          <div className={styles.modalBtn} onClick={() => { setModifyName(true); setShowModal(''); }}>이름 변경하기</div>
          <div className={styles.modalBtn} onClick={() => { setShowNotionModal('B'); setShowModal(''); }}>약속에서 빠지기</div>
          <div className={styles.modalBtn} onClick={() => { setShowNotionModal('T'); setShowModal(''); }}>약속 삭제하기</div>
        </div>
      ))
      ||
      (showTrash && type === 'p' && (
        <div style={style}>
          <div className={styles.modalBtn} onClick={() => { restoreApmt(selectedItemID); setShowModal(''); }}>복원하기</div>
          <div className={styles.modalBtn} onClick={() => { setShowNotionModal('B'); setShowModal(''); }}>약속에서 빠지기</div>
        </div>
      ))
      ||
      (type === 't' && (
        <div style={style}>
          <div className={styles.modalBtn} onClick={() => { setShowNotionModal('BA'); setShowModal(''); }}>휴지통 비우기</div>
        </div>
      ))
    );
  };

    //Bookmark Zone
  const bookmark = useCallback (async (promiseCode) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/bookmark`, {
        isBookmark: 'T',
        promiseId: promiseCode.split('-')[1].split('_')[0]},
      );
      console.log(response.data);
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크: ', promiseCode.split('-')[1].split('_')[0])
  },[]);

  const unBookmark = useCallback( async (promiseCode) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/bookmark`, {
        isBookmark: 'F',
        promiseId: promiseCode.split('-')[1].split('_')[0]},
      );
      console.log(response.data);
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크해제: ', promiseCode.split('-')[1].split('_')[0])
  },[]);

  const changeName = useCallback ( async(promiseCode, changeNameVal)=>{
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/promisename`, {
        promiseName: changeNameVal,
        promiseId: promiseCode.split('-')[1].split('_')[0]},
      );
      console.log(response.data);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    await getData();
  },[]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
      closeNotionModal();
    }
    if (modalHeaderRef.current && !modalHeaderRef.current.contains(event.target)) {
      setShowHeaderModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  //getData Zone
  const getData = async () => {
    console.log("getData (Not in useEffect) called");
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, 
      );
      // console.log(response.data)
      setBookmarkData(response.data.bookmark);
      setApmtData(response.data.promise);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
  };

  useEffect(()=>{
    const getData = async () => {
      console.log("getData called");
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, 
        );
        // console.log(response.data);
        setBookmarkData(response.data.bookmark);
        setApmtData(response.data.promise);
      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data)
      }
    }
    getData();
  }, []);

  useEffect(()=>{
    const getTrashData = async () =>{
      console.log("getTrashData called");
      try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/trash?sortBy=name`, 
        );
        // console.log(response.data);
        setTrashData(response.data.trash);
      }catch (error){
      const errorResponse = error.response;
      console.log(errorResponse.data);}
    }
    getTrashData();
  }, []);

  const getTrashData = async () =>{
    try{
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/trash?sortBy=name`, 
      );
      // console.log(response.data);
      setTrashData(response.data.trash);
    }catch (error){
    const errorResponse = error.response;
    console.log(errorResponse.data);}
  }

  const getFilteredApmts = async (searchApmtVal, data) => {
    if (searchApmtVal) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/search?searchTerm=${searchApmtVal}`, 
        );
        console.log(response.data.promise);

      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data)
      }
      return data;
    }
  }


  return ( <div>
    <div className={styles.container}>
    <div className={styles.innerContainer}>
      <div className={styles.headBtnContainer}>
        <button onClick={()=>
              window.location.href = '/:username/newapmt'
            } className={styles.newApmt}>{<AiOutlineFileAdd size={24} />}<div className={styles.btnText}>새 약속 잡기</div></button>
        <button className={styles.syncApmt}>{<IoSyncOutline size={24} />}<div className={styles.btnText}>비회원으로 참여한 약속 불러오기</div></button>
      </div>
      <div className={styles.searchContent}>{<RiSearchLine size="18px" color='#888' className={styles.icon} style={{ marginLeft: '5px' }}></RiSearchLine>}<input value={searchApmtVal} className={styles.searchContentInput} placeholder='찾기' 
      onChange={(e) => {setSearchApmtVal(e.target.value)}}></input>
      {searchApmtVal && <TiDelete size={20} color="#D9D9D9" className={styles.x} onClick={()=>{setSearchApmtVal('')}}/>}</div>
      {!showTrash ? (<><div className={styles.folderContainer}>
        <div className={styles.folderHeader}>즐겨찾기<div className={styles.icon} onClick={handleFavoritesDownClick}>{favoritesDown ? <GoChevronDown size={24}></GoChevronDown> : <GoChevronUp size={24}></GoChevronUp>}</div>
        </div>
        <div className={favoritesDown ? styles.folderInnerContainer : styles.hidden} >
          {favoritesDown && <ApmtList data={bookmarkData} fav={true} searchApmtVal={searchApmtVal} isTrash={false} selectedItemID={selectedItemID} changeName={changeName}  modifyName={modifyName} setModifyName={setModifyName} bookmark={bookmark} unBookmark={unBookmark} openModal={openModal} handleShowTrash={handleShowTrash} />}
        </div>
      </div>
      <div className={styles.folderContainer}>
        <div className={styles.folderHeader}>내 약속<div><div className={styles.selectAllContainer}>
          { selectAll ? <div className={styles.selectAll} onClick={()=> {handleSelectAll()}}>{svgList.folder.checkFilled}</div> 
        :<div className={styles.selectAll} onClick={()=>{handleSelectAll(true)}}>{svgList.folder.check}</div>}전체선택</div></div></div>
        <div className={styles.folderInnerContainer}>
        <ApmtList data={ApmtData} fav={false} searchApmtVal={searchApmtVal} isTrash={false} selectedItemID={selectedItemID} changeName={changeName} modifyName={modifyName} setModifyName={setModifyName} bookmark={bookmark} unBookmark={unBookmark} openModal={openModal} handleShowTrash={handleShowTrash} />
        </div>
      </div></>)

      :(<div className={styles.folderContainer}>
      <div className={styles.folderHeader}><div className={styles.TrashOutIcon} onClick={()=>{setShowTrash(false)}}>{svgList.folder.outofTrashBtn}</div><div className={styles.emptyTrashCanContainer} onClick ={()=>setShowNotionModal('BA')}>{svgList.smallTrashIcon} 휴지통 비우기</div>
      </div>
      <ApmtList data={TrashData} fav={false} isTrash ={true} selectedItemID={selectedItemID} changeName={changeName} modifyName={modifyName} setModifyName={setModifyName} bookmark={bookmark} unBookmark={unBookmark} openModal={openModal} handleShowTrash={handleShowTrash}  />
      </div>
      )}
      {showModal && <div ref={modalRef} style={modalStyle} className={styles.modal}>
        <ContextMenuModal onClose={closeModal} type={showModal} showTrash={showTrash} selectedItemID={selectedItemID}/>
      </div>}
      {showNotionModal !=='' && <div ref={notionModalRef}>
        <NotionModal onClose={closeNotionModal} type={showNotionModal} selectedItemID={selectedItemID} setShowNotionModal={setShowNotionModal} backoutApmt={backoutApmt} moveApmtToTrash={moveApmtToTrash} backoutAll={backoutAll} />
      </div>}
    </div>
    </div>


  </div>
  );
};

export default AllApmt;