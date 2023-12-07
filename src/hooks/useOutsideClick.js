import { useEffect } from 'react';

function useOutsideClick(ref, callback) {
  // 모달에서 바깥부분 누르면 닫히게 하는 함수 구현하려다가 시간 없어서 아직 미완성
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  }

export default useOutsideClick;