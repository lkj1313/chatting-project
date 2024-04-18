import classes from "./Modal.module.css";

const Modal = ({ closeModal, title, children }) => {
  return (
    <div className={classes.modalContainer}>
      <div className={classes.tCBox}>
        <div className={classes.titleBox}>{title}</div>
        <button className={classes.closeButton} onClick={closeModal}>
          X
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Modal;
