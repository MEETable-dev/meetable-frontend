// import ApmtBox from '../components/ApmtBox';
import styles from 'css/AllApmt.module.css';
import { IoSyncOutline, IoCheckboxOutline } from "react-icons/io5";
import { AiOutlineFileAdd , AiFillStar , AiOutlineStar} from "react-icons/ai";
import { RiSearchLine } from "react-icons/ri";
import { svgList } from 'assets/svg';
import {useState, useEffect, useRef} from 'react';
// import ApmtTrash from '../components/ApmtTrash';
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
  // const [showBackoutModal, setBackoutModal] = useState('');
  // const [backoutModalPosition, setbackoutModalPosition] = useState({x:0, y:0});

  // const [isTrash, setIsTrash] = useState(false);
  // const [isBackout, setIsBackout] = useState(false);

  const [bookmarkData, setBookmarkData] = useState([]);
  const [ApmtData, setApmtData] = useState([]);
  const [selectedItemID, setSelectedItemID] = useState(null);

  const [selectedList, setSelectedList] = useState([]);
  const [modifyName, setModifyName] = useState(false);

  const modalRef = useRef();
  const modalHeaderRef = useRef();
  const inputRef = useRef();
  const notionModalRef = useRef();

  const [favoritesDown, setFavoritesDownClick] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const accessToken = useSelector((state) => state.user.accessToken);
  const ACCESSTOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJtZW1iZXJfaWQiOjEsIm1lbWJlcl9uYW1lIjoiQ2xhaXJlIiwibWVtYmVyX2VtYWlsIjoianVldW5raW0xMTFAZ21haWwuY29tIiwibWVtYmVyX3B3ZCI6IiQyYiQxMCRQZGhZS3dTSzhUTG9wVmxlcGhBQ0plemxwYks2V002RWk1YTVkZUI2ZVRqa2U3R2FVRjZqMiIsImlzX2FjY2VwdF9tYXJrZXRpbmciOiJGIn0sImlhdCI6MTcwMTE5ODM4MywiZXhwIjoxNzAxMjAxOTgzfQ.ZLv_p8ClryZI6u02aVpkX5idaHRc1JLATGpb0GKIG7U";

  const handleFavoritesDownClick = () =>{
    if (favoritesDown===true){
      setFavoritesDownClick(false);
    }
    else{
      setFavoritesDownClick(true);
    }

  };
  
  //약속 삭제(휴지통으로 이동)
  const moveApmtToTrash = async (promiseCode)=>{
    try{
      const response = await axios.patch( `${process.env.REACT_APP_API_URL}/home/deletepromise`, 
      // {
        // headers : {Authorization: ACCESSTOKEN}},
        {promiseId: promiseCode.split('-')[1].split('_')[0]});
      await getData();
      console.log(promiseCode);

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
      console.log(promiseCode);

    } catch(error){
      const errorResponse= error.response;
      console.log(errorResponse.data);
    }

  };

  const handleSelectAll = ()=>{
    if (checkAll===true){
      setCheckAll(false);
      setSelectedList([]);
    }
    else{
      setCheckAll(true);
      //selectedList에 모든 object추가하기

    }
  }

  const openNotionModal = ( type) =>{
    setShowNotionModal(type);
    console.log(showNotionModal, "what");
  };

  const closeNotionModal = (e) =>{
    // e.preventDefault();
    setShowNotionModal('');
    setSelectedItemID(null);
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
  }

  const modalStyle = {
    position: 'absolute',
    top:`${modalPosition.y}px`,
    left:`${modalPosition.x}px`,
  };

  const ContextMenuModal = ({ onClose, style, type }) => {
    return (
      type === 'p'
      ? <div style={style}>
        <div className={styles.modalBtn} onClick={()=>{setModifyName(true); setShowModal(''); }}>이름 변경하기</div>  
        <div className={styles.modalBtn} onClick = {()=>{setShowModal('');  openNotionModal("B") ; }} >약속에서 빠지기</div>  
        <div className={styles.modalBtn} onClick = {()=>{setShowModal('');  openNotionModal("T"); }}>약속 삭제하기</div>  

      </div>
      : <div style={style}>
        <div className={styles.modalBtn} onClick={()=>{setModifyName(true); setShowModal('');}}>이름 변경하기</div>  
        <div className={styles.modalBtn}>폴더 삭제하기</div>
      </div>
    );
  };
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


  const ApmtItem = ({ name, fav, id }) => {

    return (
      <div className={selectedItemID === id ? styles.ApmtBoxFocused : styles.ApmtBox} onContextMenu={(event)=>{openModal(id, event, 'p', name)}}>
        <div className={styles.ApmtIcon}>
        {svgList.folder.Apmt}
        </div>
        <div className={styles.ApmtName}>
          {(fav === 'T')&& <AiFillStar color="#FFBB0D" size={24} className={styles.listIcon} onClick={()=>{unBookmark(id)}}/>}
          {!(fav === 'T') && <AiOutlineStar color="#888888" size={24} className={styles.listIcon} onClick={()=>{bookmark(id)}}/>}
          <div className={styles.favoritesText}>
                {(selectedItemID === id && modifyName) ? <input value={writeNameVal} ref={inputRef} name="writeName" className={styles.renameInput}
                onKeyDown={handleChangeName}
                 /> : name}
          </div>
        </div>
      </div>
    );
  };

  const ApmtList = ({ data, fav }) => {
    return (
      <div className={styles.folderInnerContainer}>
        
        {data.map((item, index) => (

          <ApmtItem key={item.promiseCode} name={item.promiseName} fav={item.isBookmark} id={fav ? 'fav-'+item.promiseCode : 'my-'+item.promiseCode} />
        ))}
      </div>
    );
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
    if (modalHeaderRef.current && !modalHeaderRef.current.contains(event.target)) {
      setShowHeaderModal(false);
    }
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setModifyName(false);
      const changeName = async(promiseCode)=>{
        try {
          const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/promisename`, {
            promiseName: writeNameVal,
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

        await getData();


      };

      //이런식의 참조가 될지 모르겠네
      
      changeName(inputRef.current.promiseCode);

      setWriteNameVal('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const getData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, 
      // {headers : {Authorization: ACCESSTOKEN}}
      );
      console.log(response.data)
      setBookmarkData(response.data.bookmark);
      setApmtData(response.data.promise)
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
  };

  useEffect(()=>{
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, 
        // {headers : {Authorization: ACCESSTOKEN}}
        );
        console.log(response.data)
        setBookmarkData(response.data.bookmark);
        setApmtData(response.data.promise)
      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data)
      }
    }
    getData();
  }, []);

  
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
      <div className={styles.folderContainer}>
        <div className={styles.folderHeader}>즐겨찾기<div className={styles.icon} onClick={handleFavoritesDownClick}>{favoritesDown ? <GoChevronDown size={24}></GoChevronDown> : <GoChevronUp size={24}></GoChevronUp>}</div>
        {/* {checkAll &&<MdCheckBox size={24} color='#8E66EE' className={styles.icon} onClick= {handleSelectAll} ></MdCheckBox>}
        {! checkAll &&<MdCheckBoxOutlineBlank size={24} className={styles.icon} onClick= {handleSelectAll}></MdCheckBoxOutlineBlank>} */}
        </div>
        <div className={favoritesDown ? styles.folderInnerContainer : styles.hidden} >
          {favoritesDown && <ApmtList data={bookmarkData} fav={true}/>}
        </div>
      </div>
      <div className={styles.folderContainer}>
        <div className={styles.folderHeader}>내 약속</div>
        <ApmtList data={ApmtData} fav={false}/>
      </div>
      {showModal && <div ref={modalRef} style={modalStyle} className={styles.modal}>
        <ContextMenuModal onClose={closeModal} type={showModal} />
      </div>}
      {showNotionModal && <div ref={notionModalRef}>
        <NotionModal onClose={closeNotionModal} type={showNotionModal}/>
      </div>}
    </div>
    </div>


  </div>
  );
};

export default AllApmt;