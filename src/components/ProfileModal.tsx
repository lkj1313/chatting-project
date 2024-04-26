import classes from "./ProfileModal.module.css";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import pencil from "../assets/pencil.jpg";
import ProfileModalLoading from "./ProfileModalLoading";

const ProfileModal = ({ children, closeModal, contextObject }) => {
  const [nickname, setNickname] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null); // 변경된 프로필 사진 파일
  const [uploading, setUploading] = useState(false); // 프로필 사진 업로드 상태
  const [loading, setLoading] = useState(false);
  const [currentNickname, setCurrentNickname] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  useEffect(() => {
    const firestore = getFirestore(); // firestore 가져오기

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setNickname(userData.nickname);
            setProfilePicture(userData.profilePicture);
            console.log(profilePicture);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (newProfilePicture !== null) {
      handleSubmit();
    }
  }, [newProfilePicture]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setNewProfilePicture(file);
    setLoading(true);
  };

  const changeNickname = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();

      const user = auth.currentUser;
      const newNickname = currentNickname; // 현재 입력된 새로운 닉네임
      const userDocRef = doc(firestore, "users", user.uid);

      // 사용자 문서 업데이트
      await updateDoc(userDocRef, {
        nickname: newNickname, // 새로운 닉네임으로 업데이트
      });

      setNickname(newNickname); // UI 업데이트
      setIsEditingNickname(false); // 닉네임 편집 모드 종료
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  const handleSubmit = async () => {
    console.log(newProfilePicture);
    if (!newProfilePicture) {
      console.error("New profile picture is null");
      return;
    }
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is logged in:", user.uid);
          // 여기서 handleSubmit 함수를 호출하거나, 로그인된 사용자에 대한 작업을 수행할 수 있습니다.
        } else {
          console.log("User is not logged in");
          // 로그인되지 않은 사용자에 대한 처리를 수행할 수 있습니다.
        }
      });
      setUploading(true);

      const firestore = getFirestore();
      const storage = getStorage();
      const user = auth.currentUser;

      const userDocRef = doc(firestore, "users", user.uid);
      console.log(user.uid);
      // Firebase Storage에 프로필 사진 업로드
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/${newProfilePicture.name}`
      );
      console.log(newProfilePicture);
      await uploadBytes(storageRef, newProfilePicture);

      // 업로드된 파일의 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(storageRef);

      // 사용자 문서 업데이트
      await updateDoc(userDocRef, {
        profilePicture: downloadURL, // 업데이트된 프로필 사진 URL
      });
      contextObject.setProfilePicture(downloadURL);
      setProfilePicture(downloadURL); // UI 업데이트
      setNewProfilePicture(null);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setUploading(false);
    }
  };

  return (
    <>
      <div className={classes.modal}>
        <button className={classes.closeButton} onClick={closeModal}>
          X
        </button>
        <div className={classes.profileBox}>
          <label
            htmlFor="profilePictureInput"
            className={classes.profilePictureButton}
          >
            {loading ? (
              <ProfileModalLoading />
            ) : (
              <img
                className={classes.profilePicture}
                src={profilePicture}
                alt="프로필 사진"
              />
            )}
          </label>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className={classes.nicknameBox}>
            {isEditingNickname ? (
              <input
                type="text"
                placeholder="새로운 닉네임을 입력하세요"
                value={currentNickname}
                onChange={(e) => setCurrentNickname(e.target.value)}
                style={{
                  margin: "12px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    changeNickname(); // 엔터 키를 누르면 handleSubmit 함수 실행
                  }
                }}
              />
            ) : (
              <h3 className={classes.nickname}>{nickname}</h3>
            )}

            <div className={classes.pencilContainer}>
              <button
                className={classes.nicknameChangeButton}
                onClick={() => {
                  setIsEditingNickname(!isEditingNickname);
                }}
              >
                <img className={classes.pencil} src={pencil} alt="편집" />
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
