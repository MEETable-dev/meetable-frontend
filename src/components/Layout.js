import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/Layout.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { svgList } from "../assets/svg";
import React from "react";
import { BsGrid } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { AiOutlineFileAdd } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { IoSyncOutline } from "react-icons/io5";
import { RiSearchLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { setToken } from "../store/modules/user";
import { useAppDispatch } from "store";
import axios from "axios";

const Layout = () => {
  const dispatch = useAppDispatch();
  const sidebarInitialSize = 300;
  const sidebarMinWidth = 100;
  const sidebarMaxWidth = 500;
  const { resizing, size, startResizing, stopResizing, updateSize, reset } = 
    useResizeSidebar(sidebarInitialSize, sidebarMinWidth, sidebarMaxWidth);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [sidebarShown, setsidebarShown] = useState(false);

  const [searchApmtVal, setSearchApmtVal] = useState('');
  const [writeNameVal, setWriteNameVal] = useState('');
  const [showModal, setShowModal] = useState('');
  const [showHeaderModal, setShowHeaderModal] = useState('');
  const [modalPosition, setModalPosition] = useState({x:0, y:0});
  const [modifyName, setModifyName] = useState(false);

  const [bookmarkData, setBookmarkData] = useState([]);
  const [promiseData, setPromiseData] = useState([]);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [openBookmark, setOpenBookmark] = useState(true);
  // const [openFolders, setOpenFolders] = useState({});

  const modalRef = useRef();
  const modalHeaderRef = useRef();
  const inputRef = useRef();

  const openModal = (itemID, event, type, name) => {
    event.preventDefault();
    setModalPosition({x:event.pageX, y:event.pageY});
    setSelectedItemID(itemID);
    setWriteNameVal(name);
    setModifyName(false);
    setShowModal(type);
  };

  const closeModal = () => {
    setShowModal('');
    setSelectedItemID(null);
    setModifyName(false);
    setWriteNameVal('');
  };

  const modalStyle = {
    position: 'absolute',
    top:`${modalPosition.y}px`,
    left:`${modalPosition.x}px`,
  };

  const ContextMenuModal = ({ onClose, style, type }) => {
    return (
      type === 'p'
      ? <div style={style}>
        <div className={styles.modalBtn} onClick={()=>{setModifyName(true); setShowModal('');}}>이름 변경하기</div>  
        <div className={styles.modalBtn}>약속에서 빠지기</div>  
        <div className={styles.modalBtn}>약속 삭제하기</div>  
      </div>
      : <div style={style}>
        <div className={styles.modalBtn} onClick={()=>{setModifyName(true); setShowModal('');}}>이름 변경하기</div>  
        <div className={styles.modalBtn}>폴더 삭제하기</div>
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
      // 이름 바꾸기 api 호출
      setWriteNameVal('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  useEffect(()=>{
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/home/totalpromise?sortBy=id`, {headers : {Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJtZW1iZXJfaWQiOjEsIm1lbWJlcl9uYW1lIjoiMHhzZW8iLCJtZW1iZXJfZW1haWwiOiIweHNlb0B5b25zZWkuYWMua3IiLCJtZW1iZXJfcHdkIjoiJDJiJDEwJGF3VWNRUS5MM085RjZIcm9jNHZXeXVxZ1laZEVBY040cVJpNUszSUNyRFhxcm1TMzFRUnBDIiwiaXNfYWNjZXB0X21hcmtldGluZyI6IlQifSwiaWF0IjoxNzAxMDY2MDc2LCJleHAiOjE3MDEwNjk2NzZ9.-KplfsANJ5XGZVi3XmGtJvjO3rtCXW4eFSlole9o5yo'}})
        console.log(response.data)
        setBookmarkData(response.data.bookmark);
        setPromiseData(response.data.promise)
      } catch (error) {
        const errorResponse = error.response;
        console.log(errorResponse.data)
      }
    }
    getData();
  }, []);

  // 폴더 토글 함수
  // const toggleFolder = (folderName) => {
  //   setOpenFolders(prevState => ({
  //     ...prevState,
  //     [folderName]: !prevState[folderName]
  //   }));
  // };

  const bookmark = async (promiseCode) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/home/bookmark`, {
        isBookmark: 'T',
        promiseId: promiseCode.split('-')[1].split('_')[0],
        headers : {Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJtZW1iZXJfaWQiOjEsIm1lbWJlcl9uYW1lIjoiMHhzZW8iLCJtZW1iZXJfZW1haWwiOiIweHNlb0B5b25zZWkuYWMua3IiLCJtZW1iZXJfcHdkIjoiJDJiJDEwJGF3VWNRUS5MM085RjZIcm9jNHZXeXVxZ1laZEVBY040cVJpNUszSUNyRFhxcm1TMzFRUnBDIiwiaXNfYWNjZXB0X21hcmtldGluZyI6IlQifSwiaWF0IjoxNzAxMDY2MDc2LCJleHAiOjE3MDEwNjk2NzZ9.-KplfsANJ5XGZVi3XmGtJvjO3rtCXW4eFSlole9o5yo'}
      });
      console.log(response.data);
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
        promiseId: promiseCode.split('-')[1].split('_')[0],
        headers : {Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6eyJtZW1iZXJfaWQiOjEsIm1lbWJlcl9uYW1lIjoiMHhzZW8iLCJtZW1iZXJfZW1haWwiOiIweHNlb0B5b25zZWkuYWMua3IiLCJtZW1iZXJfcHdkIjoiJDJiJDEwJGF3VWNRUS5MM085RjZIcm9jNHZXeXVxZ1laZEVBY040cVJpNUszSUNyRFhxcm1TMzFRUnBDIiwiaXNfYWNjZXB0X21hcmtldGluZyI6IlQifSwiaWF0IjoxNzAxMDY2MDc2LCJleHAiOjE3MDEwNjk2NzZ9.-KplfsANJ5XGZVi3XmGtJvjO3rtCXW4eFSlole9o5yo'}
      });
      console.log(response.data);
    } catch (error) {
      const errorResponse = error.response;
      console.log(errorResponse.data)
    }
    console.log('북마크해제: ', promiseCode.split('-')[1].split('_')[0])
  };

  const PromiseList = ({ data, fav }) => {
    return (
      <div>
        {data.map((item, index) => (
          <PromiseItem key={item.promiseCode} name={item.promiseName} fav={item.isBookmark} id={fav ? 'fav-'+item.promiseCode : 'my-'+item.promiseCode} />
        ))}
      </div>
    );
  };

  // const FolderList = ({data, name, id}) => {
  //   return (
  //     <div>
  //       <div className={selectedItemID === id ? styles.listItemsContainerFocused : styles.listItemsContainer} onContextMenu={(event)=>{openModal(id, event, 'f')}}>
  //         <div className={styles.listItems}>
  //           <div className={styles.folderItem}>{svgList.folder.folder}</div>
  //           {(selectedItemID === id && modifyName) ? <input value={writeNameVal} name="writeName"
  //               onChange={(e) => {setWriteNameVal(e.target.value)}}/> : name}
  //           <div onClick={()=> toggleFolder(name)}>{openFolders[name] ? <IoMdArrowDropup color="#888888" size={15} style={{marginTop:3, marginLeft:3}}/> : <IoMdArrowDropdown color="#888888" size={15} style={{marginTop:3, marginLeft:3}}/>}</div>
  //         </div>
  //         <div className={styles.btnArea} onClick={(event)=>{
  //           openModal(id, event, 'f')
  //           }
  //         }>{svgList.folder.more}</div>
  //       </div>
  //       {openFolders[name] && data.map((item, index) => (
  //         <div style={{marginLeft:28}}>
  //           <PromiseItem key={item.id} name={item.name} fav={item.fav} id={'my-'+item.id}/>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };
  
  const PromiseItem = ({ name, fav, id }) => {
    return (
      <div className={selectedItemID === id ? styles.listItemsContainerFocused : styles.listItemsContainer} onContextMenu={(event)=>{openModal(id, event, 'p', name)}}>
        <div className={styles.listItems}>
          {fav === 'T' && <AiFillStar color="#FFBB0D" size={22} className={styles.listIcon} onClick={()=>{unBookmark(id)}}/>}
          {!(fav === 'T') && <AiOutlineStar color="#888888" size={22} className={styles.listIcon} onClick={()=>{bookmark(id)}}/>}
          {(selectedItemID === id && modifyName) ? <input value={writeNameVal} name="writeName" ref={inputRef} className={styles.renameInput}
                onChange={(e) => {setWriteNameVal(e.target.value)}}/> : name}
        </div>
        <div className={styles.btnArea} onClick={(event)=>{
            openModal(id, event, 'p', name)
            }
          }>{svgList.folder.more}</div>
      </div>
    );
  };

  return (
    <div className={resizing ? styles.containerResizing : styles.container} 
      onPointerMove={updateSize} onPointerUp={stopResizing}
    >
      {accessToken && sidebarShown && <div className={styles.sidebarWrapper} style={{flexBasis:size}}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <div onClick={()=>setsidebarShown(false)}>{svgList.headerIcon.headerHide}</div>
          </div>
          <div className={styles.sidebarMain}>
            <div className={styles.newApmt}>
              {<AiOutlineFileAdd size={20} />}<div className={styles.btnText}>새 약속 잡기</div>
            </div>
            <div className={
              size >= 300
              ? styles.syncApmt
              : styles.syncApmtSmall
            }>
              {<IoSyncOutline size={20} color="#888888" />}<div className={styles.btnText}>비회원으로 참여한 {size < 300 && <div></div>} 약속 불러오기</div>
            </div>
            <div className={styles.searchContent}>
              <RiSearchLine size={18} color="#888888" className={styles.icon}/>
              <input value={searchApmtVal} name="searchApmt" placeholder="찾기"
                onChange={(e) => {setSearchApmtVal(e.target.value)}}></input>
              {searchApmtVal && <TiDelete size={20} color="#D9D9D9" className={styles.x} onClick={()=>{setSearchApmtVal('')}}/>}
            </div>
            <div className={styles.labels}>
              즐겨찾기
              <div onClick={()=> setOpenBookmark(!openBookmark)}>
                {openBookmark
                ? <IoMdArrowDropup color="#888888" size={15} style={{marginTop:3, marginLeft:3}}/> 
                : <IoMdArrowDropdown color="#888888" size={15} style={{marginTop:3, marginLeft:3}}/>}
              </div>
            </div>
            {openBookmark && <PromiseList data={bookmarkData} fav={true}/>}
            <div className={styles.labels}>내 약속<div className={styles.btnArea}>
              <div onClick={()=>{window.location.href = '/:username/allapmt';}}>{svgList.folder.grid}</div>
              {/* <div>{svgList.folder.newFolder}</div> */}
            </div></div>
            <PromiseList data={promiseData} fav={false}/>
            {/* <FolderList data={[{name:'팅클 개발일정', id:10, fav:true}]} name="사이드프로젝트" id="10"/> */}
            <ul>
              <li>{process.env.REACT_APP_API_URL}</li>
              <li>{accessToken}</li>
              <li>{searchApmtVal}</li>
            </ul>
          </div>
        </div>
        <div 
          onPointerDown={startResizing}
          className={styles.sidebarBorder}
          onDoubleClick={reset}>
        </div>
      </div>}
      <div className={styles.mainWrapper}>
        <header className={styles.headerWrapper}>
          <div className={styles.headerBtnLeft}>
            {accessToken && !sidebarShown && <div onClick={()=>setsidebarShown(true)}>{svgList.headerIcon.headerShow}</div>}
          </div>
          <div className={styles.headerCenter} onClick={()=>{window.location.href = '/:username'}}>
            MEETable
            <button onClick={()=>{
              dispatch(
                setToken('ABCD')
              );
            }
              }>login:{accessToken}</button>
              <button onClick={()=>{
              dispatch(
                setToken('')
              );
            }
              }>logout:{accessToken}</button>
              {/* <button onClick={()=>{
              dispatch(
                setToken('@@-ABCD')
              );
            }
              }>testError:{accessToken}</button> */}
          </div>
          <div className={styles.headerBtnRight}>
            <div onClick={()=>{window.location.href = '/:username/allapmt';}}>{accessToken && <BsGrid size={28} color="#888888"/>}</div>
            <div onClick={()=>{setShowHeaderModal(true)}}><CgProfile size={28} color="#888888"/></div>

          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {showModal && <div ref={modalRef} style={modalStyle} className={styles.modal}>
        <ContextMenuModal onClose={closeModal} type={showModal} />
      </div>}
      {showHeaderModal && <div ref={modalHeaderRef} className={styles.headermodal}>
        <div className={styles.modalBtn}>내 정보</div>
        <div className={styles.modalBtn}>로그아웃</div>
      </div>}
    </div>
  );
};

export default Layout;