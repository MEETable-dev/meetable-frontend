import styles from 'css/AllApmt.module.css';
import { IoSyncOutline, IoCheckboxOutline } from "react-icons/io5";
import { AiOutlineFileAdd , AiFillStar , AiOutlineStar} from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";
import { svgList } from 'assets/svg';
import {useState, useEffect, useRef} from 'react';
import { useSelector } from "react-redux";
import React from "react";
import { GoChevronUp , GoChevronDown } from "react-icons/go";
import { useAppDispatch } from "store";
import { MdCheckBox , MdCheckBoxOutlineBlank } from "react-icons/md";
import  axios  from 'axios';
import { TiDelete } from "react-icons/ti";

const AllApmt = () => {
  const dispatch = useAppDispatch();
  const [searchApmtVal, setSearchApmtVal] = useState('');
  const [writeNameVal, setWriteNameVal] = useState('');
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
  const inputRef = useRef();
  const notionModalRef = useRef();

  // 입력값을 가져와서 소문자로변경

  const handleFavoritesDownClick = () =>{
    if (favoritesDown===true){
      setFavoritesDownClick(false);
    }
    else{
      setFavoritesDownClick(true);
    }

  };

  
  const handleSelectAll = ()=>{
    if (selectAll===true){
      setSelectAll(false);
      setSelectedList([]);
    }
    else{
      setSelectAll(true);
      setSelectedList(ApmtData);
      //selectedList에 모든 object추가하기

    }
  }

  // const openNotionModal = ( type) =>{

  //   setShowNotionModal(type);
  //   console.log(showNotionModal, "what");
  // };

  const closeNotionModal = (e) =>{
    // e.preventDefault();
    setShowNotionModal('');
    setSelectedItemID(null);
  };

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
    }

  };

  //약속에서 빠지기

  const backoutApmt = async (promiseCode) =>{
    try{
      const response = await axios.patch( `${process.env.REACT_APP_API_URL}/home/backoutpromise`,
      // {
      //   headers : {Authorization: ACCESSTOKEN}},
        {promiseId: promiseCode.split('-')[1].split('_')[0]});
      console.log(response.data);
      await getData();
      await getTrashData();
      console.log(promiseCode);

    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }

  };
  
  const NotionModal = (onClose, type)=>{

    return (

      type=== 'B'
      ? <div className={styles.notionModalBox}>
          <div className={styles.notionModal}>
            <div className={styles.notionModalT1}>약속에서 빠지시겠어요?</div>
            <div className={styles.notionModalT2}>내가 이 약속에 남아있는 마지막 사람이에요.<br></br>내가 빠지면 약속 파일이 영구 삭제됩니다.</div>
            <div className ={styles.notionModalBtnBox}>
              <div className={styles.notionModalNo} onClick={()=>{setShowNotionModal('')}}>아니요.</div>
              <div className={styles.notionModalYes} onClick={()=>{backoutApmt(selectedItemID); setShowNotionModal('');}} >네,빠질게요.</div>
            </div>
          </div>
      </div>

      :<div className={styles.notionModalBox} >
        <div className={styles.notionModal} style={{width:320, height: 198}}>
          <div className={styles.notionModalT1} style={{width:141, height: 23 , marginBottom:8}}>휴지통을 비우시겠어요?</div>
          <div className={styles.notionModalT2} style={{width:286, height: 23, marginBottom:16 }} >휴지통에 있는 모든 약속에서 내가 빠지게 됩니다.</div>
          <div className ={styles.notionModalBtnBox}>
            <div className={styles.notionModalNo} onClick={setShowNotionModal('')} >아니요.</div>
            <div className={styles.notionModalYes} onClick={()=>{moveApmtToTrash(selectedItemID); setShowNotionModal('');}}>네,비울게요.</div>
          </div>
        </div>
    </div>

    )

  };

  const openModal = (itemID, event, type, name) => {
    event.preventDefault();

    setModalPosition({x:event.pageX, y:event.pageY});
    setSelectedItemID(itemID);

    setWriteNameVal(name);
    setModifyName(false);
    //이부분 list 를 모달이랑 어떻게 같이 할지 ㅁㄹ겠네... 동시에 이름변경이 안되니까 막는게 맞는건지..
    setShowModal(type);
    // setSelectedList([...selectedList, itemID]);
  };

  const closeModal = (itemID) => {
    setShowModal('');
    setSelectedItemID(null);
    setModifyName(false);
    setWriteNameVal('');
    //이부분 list 를 모달이랑 어떻게 같이 할지 ㅁㄹ겠네... 동시에 이름변경이 안되니까 막는게 맞는건지..
    // selectedList.splice(selectedList.indexOf(itemID), 1);
    // setSelectedList([...selectedList]);
  };

  const handleChangeName = (e) =>{
    if(e.key==='Enter'){
      setWriteNameVal(e.target.value);

    }
    else{
      setWriteNameVal(e.target.value);
    }
  }

  const modalStyle = {
    position: 'absolute',
    top:`${modalPosition.y}px`,
    left:`${modalPosition.x}px`,
  };

  const ContextMenuModal = ({  onClose, style, type}) => {
    console.log(type);
    return (
      type === 'p'
      ? <div style={style}>
        <div className={styles.modalBtn} onClick={()=>{setModifyName(true); setShowModal(''); }}>이름 변경하기</div>  
        <div className={styles.modalBtn} onClick = {()=>{ setShowNotionModal('B') ; setShowModal('');   }} >약속에서 빠지기</div>  
        <div className={styles.modalBtn} onClick = {()=>{ setShowNotionModal('T'); setShowModal(''); }}>약속 삭제하기</div>  

      </div>
      : <div style={style}>
        <div className={styles.modalBtn} onClick={()=>{setModifyName(true); setShowModal('');}}>이름 변경하기</div>  
        <div className={styles.modalBtn}>폴더 삭제하기</div>
      </div>
    );
  };



    //Bookmark Zone
  const bookmark = async (promiseCode) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/bookmark`, {
        isBookmark: 'T',
        promiseId: promiseCode.split('-')[1].split('_')[0]},
      //   {headers : {Authorization:ACCESSTOKEN}
      // }
      );
      console.log(response.data);
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크: ', promiseCode.split('-')[1].split('_')[0])

  };

  const unBookmark = async (promiseCode) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/bookmark`, {
        isBookmark: 'F',
        promiseId: promiseCode.split('-')[1].split('_')[0]},
      //   {headers : {Authorization:ACCESSTOKEN}
      // }
      );
      console.log(response.data);
      await getData();
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크해제: ', promiseCode.split('-')[1].split('_')[0])
  };


  //Apmt Component Zone

  const ApmtItem = ({ name, fav, id , isTrash= false}) => {

    const truncatedName = name.length > 12 ? name.slice(0, 12) + "..." : name;
    return (
      <div className={selectedItemID===id ? styles.ApmtBoxFocused : styles.ApmtBox} onContextMenu={(event)=>{openModal(id, event, 'p', name)}}>
        <div className={styles.ApmtIcon}>
        {svgList.folder.Apmt}
        </div>
        <div className={styles.ApmtName}>
          {(fav === 'T')&& !isTrash &&<AiFillStar color="#FFBB0D" size={22} className={styles.favoritesIcon}  onClick={()=>{unBookmark(id)}}/>}
          {!(fav === 'T') && !isTrash && <AiOutlineStar color="#888888" size={22} className={styles.favoritesIcon} onClick={()=>{bookmark(id)}}/>}
          {isTrash && ''}
          <div className={styles.favoritesText}>
                {(selectedItemID === id && modifyName) ? <input value={writeNameVal} ref={inputRef} name="writeName" className={styles.renameInput}
                onChange ={(e)=>{setWriteNameVal(e.target.value)}}
                 /> : truncatedName}
          </div>
        </div>
      </div>
    );
  };

  const ApmtList = ({ data, fav, isTrash = false, searchApmtVal }) => {
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
        {!isTrash && !fav ? <TrashCanIcon></TrashCanIcon> : ''}
        {filteredApmts.map((item, index) => (
          <ApmtItem
            isTrash={isTrash}
            key={item.promiseCode}
            name={item.promiseName}
            fav={item.isBookmark}
            id={fav ? 'fav-' + item.promiseCode : 'my-' + item.promiseCode}
          />
        ))}
      </div>
    );
  };
  

  //Trash Component

  const TrashCanIcon = () =>{
    return (
      <div className={styles.TrashBox} onClick ={()=>{setShowTrash(true)}}>
        <div className={styles.TrashIcon} >
          {svgList.folder.trash}
        </div>
        <div className={styles.TrashName}>휴지통</div>
      </div>
    );
  };

  const changeName = async(promiseCode)=>{
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/promisename`, {
        promiseName: writeNameVal,
        promiseId: promiseCode.split('-')[1].split('_')[0]},
      );
      console.log(response.data);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    await getData();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
      closeNotionModal();
    }
    if (modalHeaderRef.current && !modalHeaderRef.current.contains(event.target)) {
      setShowHeaderModal(false);
    }
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      console.log(writeNameVal);
      console.log(selectedItemID);
      setModifyName(false);
      changeName(selectedItemID);

      setWriteNameVal('');
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
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, 
      );
      console.log(response.data)
      setBookmarkData(response.data.bookmark);
      setApmtData(response.data.promise);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
  };

  useEffect(()=>{
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, 
        );
        console.log(response.data);
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
      try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/trash?sortBy=name`, 
        );
        console.log(response.data);
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
      console.log(response.data);
      setTrashData(response.data.trash);
    }catch (error){
    const errorResponse = error.response;
    console.log(errorResponse.data);}
  }

  
  return ( <div>
    <div className={styles.container}>
    <div className={styles.innerContainer}>
      <div className={styles.headBtnContainer}>
        <button className={styles.newApmt}>{<AiOutlineFileAdd size={24} />}<div className={styles.btnText}>새 약속 잡기</div></button>
        <button className={styles.syncApmt}>{<IoSyncOutline size={24} />}<div className={styles.btnText}>비회원으로 참여한 약속 불러오기</div></button>
      </div>
      <div className={styles.searchContent}>{<RiSearchLine size="18px" color='#888' className={styles.icon} style={{ marginLeft: '5px' }}></RiSearchLine>}<input value={searchApmtVal} className={styles.searchContentInput} placeholder='찾기' 
      onChange={(e) => {setSearchApmtVal(e.target.value)}}></input>
      {searchApmtVal && <TiDelete size={20} color="#D9D9D9" className={styles.x} onClick={()=>{setSearchApmtVal('')}}/>}</div>
      {!showTrash ? (<><div className={styles.folderContainer}>
        <div className={styles.folderHeader}>즐겨찾기<div className={styles.icon} onClick={handleFavoritesDownClick}>{favoritesDown ? <GoChevronDown size={24}></GoChevronDown> : <GoChevronUp size={24}></GoChevronUp>}</div>
        </div>
        <div className={favoritesDown ? styles.folderInnerContainer : styles.hidden} >
          {favoritesDown && <ApmtList data={bookmarkData} fav={true} searchApmtVal={searchApmtVal} />}
        </div>
      </div>
      <div className={styles.folderContainer}>
        <div className={styles.folderHeader}>내 약속<div><div className={styles.selectAllContainer}>{ selectAll ? <div className={styles.selectAll} onClick={()=> {handleSelectAll()}}>{svgList.folder.checkFilled}</div> 
        :<div className={styles.selectAll} onClick={()=>{handleSelectAll(true)}}>{svgList.folder.check}</div>}전체선택</div></div></div>
        <div className={styles.folderInnerContainer}>
        <ApmtList data={ApmtData} fav={false} searchApmtVal={searchApmtVal}/>
        </div>
      </div></>)

      :(<div className={styles.folderContainer}>
      <div className={styles.folderHeader}><div className={styles.TrashOutIcon} onClick={()=>{setShowTrash(false)}}>{svgList.folder.outofTrashBtn}</div><div className={styles.TrashText}>휴지통</div>
      </div>
      <ApmtList data={TrashData} fav={false} isTrash ={true} />
      </div>
      )}
      {showModal && <div ref={modalRef} style={modalStyle} className={styles.modal}>
        <ContextMenuModal onClose={closeModal} type={showModal} />
      </div>}
      {showNotionModal !=='' && <div ref={notionModalRef}>
        <NotionModal onClose={closeNotionModal} type={showNotionModal}/>
      </div>}
    </div>
    </div>


  </div>
  );
};

export default AllApmt;