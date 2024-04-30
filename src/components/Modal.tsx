import classes from "./Modal.module.css";
import { useState, useEffect } from "react";

const Modal = ({ closeModal, title, children, height }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [modalLeft, setModalLeft] = useState(0);
  const [modalTop, setModalTop] = useState(0);

  const [modalContainerStyle, setModalContainerStyle] = useState({});
  console.log(height);
  useEffect(() => {
    // 프롭스로 받은 height 값을 사용하여 스타일을 동적으로 업데이트합니다.
    const updatedStyle = {
      ...modalContainerStyle,
      height: height, // 프롭스로 받은 height 값을 적용합니다.
    };
    setModalContainerStyle(updatedStyle);
  }, [height]); // height 값이 변경될 때마다 스타일을 업데이트합니다.

  const handleMouseDown = (event) => {
    if (event.currentTarget.classList.contains(classes.modalContainer)) {
      setIsDragging(true);
      setStartX(event.clientX);
      setStartY(event.clientY);
      setModalLeft(event.currentTarget.offsetLeft);
      setModalTop(event.currentTarget.offsetTop);
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    const currentX = event.clientX;
    const currentY = event.clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    event.currentTarget.style.left = `${modalLeft + deltaX}px`;
    event.currentTarget.style.top = `${modalTop + deltaY}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <div className={classes.overlay} onClick={closeModal}></div>
      <div
        className={`${classes.modalContainer} ${classes.dynamicHeight}`}
        style={modalContainerStyle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className={classes.tCBox}>
          <div className={classes.titleBox}>{title}</div>

          <button className={classes.closeButton} onClick={closeModal}>
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
