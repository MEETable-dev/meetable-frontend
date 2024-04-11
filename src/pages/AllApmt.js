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
  const navigate = useNavigate();
  const [searchApmtVal, setSearchApmtVal] = useState('');
  const [showModal, setShowModal] = useState('');
  const [showHeaderModal, setShowHeaderModal] = useState('');
  const [modalPosition, setModalPosition] = useState({x:0, y:0});
  const [showNotionModal, setShowNotionModal] = useState('');

  //BookMark + Selected + Apmt
  const [bookmarkData, setBookmarkData] = useState([]);
  const [ApmtData, setApmtData] = useState([]);

  //selectedItemID는 그냥 아예 없는걸로. ? ㄴㄴ 그냥 ItemID랑 SelectedItemList랑..둘다
  // const [selectedItemID, setSelectedItemID] = useState(null);
  const [favoritesDown, setFavoritesDownClick] = useState(true);

  //Trash Area
  const [TrashData, setTrashData] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  //Name Modification + Modals
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItemList, setSelectedItemList] = useState([]);
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

  const handleSelectAll = () => {
    if (!selectAll) {
      // 전체 선택 상태일 때
      setSelectAll(true);
      // 모든 약속의 promiseCode에서 앞에 있는 숫자만 추출하여 선택된 목록에 추가
      setSelectedItemList(ApmtData.map(apmt => apmt.promiseCode));
      // console.log("ApmtData:",ApmtData)
      // console.log("handleSelectAll, selectedItemList: ", selectedItemList);

    } else {
      // 선택 해제 상태일 때
      setSelectAll(false);
      setSelectedItemList([]); // 모든 항목 선택 해제
    }
  };

  const closeNotionModal = (e) =>{

    setShowNotionModal('');
    // setSelectedItemID(null);

    setSelectedItemList([]);
  };

  const restoreApmt = async (promiseCodes) =>{
    console.log('restore',promiseCodes);
    console.log('ApmtData', ApmtData);
    try{
      const promiseIds = promiseCodes.map(code => parseInt(code.split('_')[0]));
      const response = await axios.patch( `${process.env.REACT_APP_API_URL}/home/restore`, 
        {promiseId: promiseIds});
      await getData();
      await getTrashData();
      await closeModal();
      console.log(response);
    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }};
  //Notion Modal Zone
  //약속 삭제(휴지통으로 이동)
  const moveApmtToTrash = async (promiseCodes)=>{
    const promiseIds = promiseCodes.map(code => parseInt(code.split('_')[0]));
    console.log("promiseIds: ",promiseIds);
    console.log("promiseIds[0]: ", promiseIds[0]);
    try{
      const promiseIds = promiseCodes.map(code => parseInt(code.split('_')[0]));
      const response = await axios.patch( `${process.env.REACT_APP_API_URL}/home/deletepromise`, 
        { promiseId: promiseIds });
      await getData();
      await getTrashData();
      await closeModal();
      console.log(response);
    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }};

  //약속에서 빠지기
  const backoutApmt = async (promiseCodes) => {
    const promiseIds = promiseCodes.map(code => parseInt(code.split('_')[0]));
    console.log("promiseIds: ",promiseIds);
    try {
      const promiseIds = promiseCodes.map(code => parseInt(code.split('_')[0]));
      console.log("promiseIds: ",promiseIds); // promiseCodes를 파싱하여 promiseIds 배열로 변환
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/home/backoutpromise`, {
        data: { promiseId: promiseIds } // promiseIds를 배열로 전달
      });
      console.log(response.data);
      await getData();
      await getTrashData();
      await closeModal();
      console.log(promiseCodes);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data);
    }
  };

    //휴지통 비우기(모든 약속에서 빠지기)

    const backoutAll = async (TrashData) =>{
      console.log(TrashData);
      try{
        const response = await axios.delete( `${process.env.REACT_APP_API_URL}/home/backoutall`,)
        console.log(response.data);
        await getData();
        await getTrashData();
        await closeModal();
        console.log(TrashData)
  
      } catch(error){
        const errorResponse= error.response;
        console.log(errorResponse.data);
      }};
  
  const openModal = useCallback ((itemID, event, type, selectedItemList) => {
    if (type === 'p'){
      event.preventDefault();
      setModalPosition({x:event.pageX, y:event.pageY});
      // console.log("selectedItemList: ",selectedItemList);
      console.log('showModal: ', showModal);
      if (selectedItemList && selectedItemList.length > 0){
        //이미 아이템이 있는 경우에는 놔둔다.
        if (selectedItemList.length >1){
          console.log("multiple objects!!!!!");
          setModifyName(false);
           //multiple objects
          setShowModal('m');
        }
        else{
          // setSelectedItemID(itemID);
          setSelectedItemList([itemID]);
          setShowModal(type);
        }
      }
      else{
          // setSelectedItemID(itemID);
          setSelectedItemList([itemID]);
          setShowModal(type);
        }
      //아이템이 없는 경우에는 해당 모달이 켜진 것에대해서 modal 을 만든다.

}
    else{
      event.preventDefault();
      setModalPosition({x:event.pageX, y:event.pageY});
      setShowModal(type);
    }
  },[]);

  const closeModal = (itemID) => {
    console.log("modal closed");
    setShowModal('');
    // selectAll(false);
    // closeNotionModal();
    // setSelectedItemID(null);
    setModifyName(false);
    setSelectedItemList([]);
    //이부분 list 를 모달이랑 어떻게 같이 할지 ㅁㄹ겠네... 동시에 이름변경이 안되니까 막는게 맞는건지..
    // selectedList.splice(selectedList.indexOf(itemID), 1);
    // setSelectedList([...selectedList]);
  };

  const modalStyle = {
    position: 'absolute',
    top:`${modalPosition.y}px`,
    left:`${modalPosition.x}px`,
  };

  const ContextMenuModal = ({  onClose, style, type , showTrash, selectedItemList}) => {
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
      (!showTrash && type === 'm' && (
        <div style={style}>
          <div className={styles.modalBtn} onClick={() => { setShowNotionModal('B'); setShowModal(''); }}>약속에서 빠지기</div>
          <div className={styles.modalBtn} onClick={() => { setShowNotionModal('T'); setShowModal(''); }}>약속 삭제하기</div>
        </div>
      ))
      ||
      (showTrash && type === 'p' && (
        <div style={style}>
          <div className={styles.modalBtn} onClick={() => { restoreApmt(selectedItemList); setShowModal(''); }}>복원하기</div>
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
        promiseId: promiseCode.split('_')[0]},
      );
      console.log(response.data);
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크: ', promiseCode.split('_')[0])
  },[]);

  const unBookmark = useCallback( async (promiseCode) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/bookmark`, {
        isBookmark: 'F',
        promiseId: promiseCode.split('_')[0]},
      );
      console.log(response.data);
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크해제: ', promiseCode.split('_')[0])
  },[]);

  const changeName = useCallback ( async(promiseCode, changeNameVal)=>{
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/promisename`, {
        promiseName: changeNameVal,
        promiseId: promiseCode.split('_')[0]},
      );
      console.log(response.data);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    await getData();
    await closeModal();
  },[]);

  const handleClickOutside = (event) => {
    console.log(modalRef);
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
      closeNotionModal();
    }
    if (modalHeaderRef.current && !modalHeaderRef.current.contains(event.target)) {
      setShowHeaderModal(false);
    }

    // if (!modalRef.current&& showModal){
    //   closeModal();
    // }
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

  
  return ( <div style={{height:'100%'}}>
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
          {favoritesDown && <ApmtList data={bookmarkData} fav={true} searchApmtVal={searchApmtVal} isTrash={false} selectedItemList={selectedItemList} changeName={changeName}  modifyName={modifyName} setModifyName={setModifyName} bookmark={bookmark} unBookmark={unBookmark} openModal={openModal} handleShowTrash={handleShowTrash} />}
        </div>
      </div>
      <div className={styles.folderContainer}>
        <div className={styles.folderHeader}>내 약속<div><div className={styles.selectAllContainer}>
          { selectAll ? <div className={styles.selectAll} onClick={()=> {handleSelectAll()}}>{svgList.folder.checkFilled}</div> 
        :<div className={styles.selectAll} onClick={()=>{handleSelectAll(true)}}>{svgList.folder.check}</div>}전체선택</div></div></div>
        <div className={styles.folderInnerContainer}>
        <ApmtList data={ApmtData} fav={false} searchApmtVal={searchApmtVal} isTrash={false} selectedItemList={selectedItemList} changeName={changeName} modifyName={modifyName} setModifyName={setModifyName} bookmark={bookmark} unBookmark={unBookmark} openModal={openModal} handleShowTrash={handleShowTrash} />
        </div>
      </div></>)

      :(<div className={styles.folderContainer}>
      <div className={styles.folderHeader}><div className={styles.TrashOutIcon} onClick={()=>{setShowTrash(false)}}>{svgList.folder.outofTrashBtn}</div><div className={styles.emptyTrashCanContainer} onClick ={()=>setShowNotionModal('BA')}>{svgList.smallTrashIcon} 휴지통 비우기</div>
      </div>
      <ApmtList data={TrashData} fav={false} isTrash ={true} selectedItemList={selectedItemList} changeName={changeName} modifyName={modifyName} setModifyName={setModifyName} bookmark={bookmark} unBookmark={unBookmark} openModal={openModal} handleShowTrash={handleShowTrash}  />
      </div>
      )}
      {showModal && <div ref={modalRef} style={modalStyle} className={styles.modal}>
        <ContextMenuModal onClose={closeModal} type={showModal} showTrash={showTrash} selectedItemList={selectedItemList}/>
      </div>}
      {showNotionModal !=='' && <div ref={notionModalRef}>
        <NotionModal onClose={closeNotionModal} contextClose={closeModal} type={showNotionModal} selectedItemList={selectedItemList} setShowNotionModal={setShowNotionModal} backoutApmt={backoutApmt} moveApmtToTrash={moveApmtToTrash} backoutAll={backoutAll} />
      </div>}
    </div>
    </div>


  </div>
  );
};

export default AllApmt;