import { useState } from "react";
import classes from "./Top.module.css";
import ProfileModal from "../../../components/ProfileModal";

const Top = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };
  return (
    <div className={classes.topComponentsFirstDiv}>
      <span>채 팅</span>
      <div>
        <button
          className={classes.profileButton}
          onClick={openProfileModal}
        ></button>
        {showProfileModal && <ProfileModal closeModal={closeProfileModal} />}
      </div>
    </div>
  );
};

export default Top;
