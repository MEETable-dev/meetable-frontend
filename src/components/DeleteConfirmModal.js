import { Outlet } from "react-router-dom";
import { useResizeSidebar } from "../hooks/useResizeSidebar";
import styles from '../css/DeleteConfirmModal.module.css';
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from 'react';
import React from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

import SubmitBtn from "../components/SubmitBtn";

const DeleteConfirmModal = ({ onClose, delID }, ref) => {
    const accessToken = useSelector((state) => state.user.accessToken);
    const navigate = useNavigate();

	const handleContentClick = (e) => {
		e.stopPropagation();
	};

	const deleteSch = async (id) => {
		try {
		  const response = await axios.delete(`${process.env.REACT_APP_API_URL}/calendar/delete`, {
			data: { "calendarId": id },
		  });
		  console.log(response.data); // Optional: Log the response for debugging
		  onClose();
		} catch (error) {
		  const errorResponse = error.response;
		  console.log('Failed to delete!');
		  console.log(errorResponse.data.statusCode);
		}
	  };

	return (
		<div ref={ref}>
			<div className={styles.modalOverlay} onClick={onClose}>
				<div
					className={`${styles.modalContent}`}
					onClick={handleContentClick}
				>
					<h2>일정을 삭제하시겠습니까?</h2>

					<div className={styles.modalBody}>
						<div className={styles.btnZone}>
							<SubmitBtn
								text="취소"
								onClick={onClose}
								isActive={true}
								className={`${styles.cancelBtn}`}
							/>
							<SubmitBtn
								text="삭제"
								onClick={() => deleteSch(delID)}
								isActive={true}
								className={`${styles.createBtn}`}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.forwardRef(DeleteConfirmModal);