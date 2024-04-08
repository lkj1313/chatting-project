// ProfileModal.js

import classes from "./ProfileModal.module.css";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import pencil from "../assets/pencil.jpg";
const ProfileModal = ({ children, closeModal }) => {
  const [nickname, setNickname] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setNickname(userData.nickname);
            setProfilePicture(userData.profilePicture);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className={classes.overlay} onClick={closeModal}></div>
      <div className={classes.modal}>
        <button className={classes.closeButton} onClick={closeModal}>
          X
        </button>
        <div className={classes.profileBox}>
          <img
            className={classes.profilePicture}
            src={profilePicture}
            alt="프로필 사진"
          ></img>
          <div className={classes.nicknameBox}>
            <h3 className={classes.nickname}>{nickname}</h3>
            <div className={classes.pencilContainer}>
              <button className={classes.nicknameChangeButton}>
                <img className={classes.pencil} src={pencil}></img>
              </button>
            </div>

            <p style={{ fontSize: "15px" }}>닉네임 변경</p>
          </div>
        </div>
        <div className={classes.modalContent}>{children}</div>
      </div>
    </>
  );
};

export default ProfileModal;
