import classes from "./Menu.module.css";
import { useState, useEffect, useContext } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../../../components/ProfileModal";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { Context } from "../../../App";

import Modal from "../../../components/Modal";
import ChatRoomCreatorModal from "./ChatRoomCreatorModal";

const Menu = ({ setMainPageMenuBarOpener }) => {
  const [isOpen, setIsOpen] = useState(false); // 메뉴바
  const [modalOpen, setModalOpen] = useState(false); // 프로필모달
  const [profilePictureUrl, setProfilePictureUrl] = useState(""); //모달오픈버튼 프사
  const [nickname, setNickname] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isChatRoomCreatorModal, setIsChatRoomCreatorModal] = useState(false);
  const context = useContext(Context);
  console.log(profilePicture);
  const navigate = useNavigate();
  const profileModalOpener = () => {
    setModalOpen(!modalOpen);
  };
  const chatRoomCreatorModalOpener = () => {
    setIsChatRoomCreatorModal(true);
  };
  const chatRoomCreatorModalCloser = () => {
    setIsChatRoomCreatorModal(false);
  };
  const logout = async () => {
    const isLogOut = window.confirm("정말 로그아웃 하시겠습니까?");
    if (!isLogOut) return;

    try {
      const auth = getAuth();
      await signOut(auth);

      navigate("/");
    } catch (error) {
      alert("로그아웃 중 오류가 발생했습니다: " + error.message);
    }
  };

  useEffect(() => {
    const firestore = getFirestore(); // Firestore 가져오기
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setNickname(userData.nickname);
          setProfilePicture(userData.profilePicture);
        }
      });

      return () => unsubscribe();
    }
  }, []); // 의존성 배열에 onSnapshot 추가

  return (
    <div className={classes.menuBox}>
      <div
        className={isOpen ? `${classes.overlay}` : ""}
        onClick={() => {
          setMainPageMenuBarOpener(false);
          setIsOpen(!isOpen);
        }}
      ></div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setMainPageMenuBarOpener(true);
        }}
        className={
          isOpen ? `${classes.menuButtonHidden}` : `${classes.menuButton}`
        }
      >
        ☰
      </button>
      <>
        <div
          className={`${classes.menuContainer} ${isOpen ? classes.open : ""}`}
        >
          <div className={classes.profileModalButtonBox}>
            <button
              className={classes.profileModalButton}
              onClick={profileModalOpener}
            >
              <img src={profilePicture}></img>
            </button>

            <span>{nickname}</span>
            <button className={classes.logOutButton} onClick={logout}>
              로그아웃
            </button>
          </div>
          <div>
            {modalOpen ? (
              <ProfileModal
                closeModal={profileModalOpener}
                contextObject={context}
              />
            ) : null}
          </div>
          <div className={classes.OtherButtonBox}>
            <button
              className={classes.chatRoomCreatorButton}
              onClick={chatRoomCreatorModalOpener}
            >
              대화방 만들기
            </button>
          </div>
          {isChatRoomCreatorModal ? (
            <Modal closeModal={chatRoomCreatorModalCloser} title="채널 만들기">
              <ChatRoomCreatorModal closeModal={chatRoomCreatorModalCloser} />
            </Modal>
          ) : null}
        </div>
      </>
    </div>
  );
};

export default Menu;
