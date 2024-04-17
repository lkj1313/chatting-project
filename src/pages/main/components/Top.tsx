import { useState, useContext, useEffect } from "react";
import classes from "./Top.module.css";
import ProfileModal from "../../../components/ProfileModal";
import URL_TO_DEFAULT_PROFILE_PICTURE from "../../../assets/profile.jpg";
import { Context } from "../../../App";
import Menu from "./Menu";

const Top = () => {
  const contextObject = useContext(Context);
  const [hidden, setHidden] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextObject.profilePicture !== null) {
      setLoading(false);
    }
  }, [contextObject.profilePicture]);

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };
  return (
    <div
      className={
        hidden
          ? `${classes.topComponentsFirstDiv2}`
          : `${classes.topComponentsFirstDiv}`
      }
    >
      <span style={{ visibility: hidden ? "hidden" : "visible" }}>채팅</span>

      <div className={classes.menu}>
        <Menu setHidden={setHidden} />
      </div>
      <div>
        {/* <button className={classes.profileButton} onClick={openProfileModal}>
          {loading ? (
            // 로딩 중인 경우 기본 이미지 또는 로딩 표시
            <img
              className={classes.profilePicture}
              src={URL_TO_DEFAULT_PROFILE_PICTURE}
              alt="Profile"
            />
          ) : (
            // 프로필 사진이 로드된 경우 프로필 사진 표시
            <div>
              <img
                className={classes.profilePicture}
                src={contextObject.profilePicture}
                alt="Profile"
              />
            </div>
          )}
        </button> */}
      </div>
    </div>
  );
};

export default Top;
