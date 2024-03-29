import { useNavigate } from "react-router-dom";
import classes from "./ProfilePicture.module.css";
import { useContext, useEffect, useState } from "react";
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import firestore from "../../../../main";
import { IdContext } from "../../../../App";
import profile from "../../../../assets/profile.jpg";
import pencil from "../../../../assets/pencil.jpg";

const ProfilePicture = ({ closeModal, index }) => {
  console.log(closeModal);
  const id = useContext(IdContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [nickname, setNickname] = useState("마루");

  const changePicture = async (imageUrl) => {
    try {
      const docRef = await setDoc(doc(firestore, "users", id), {
        id,
        profileImageUrl: imageUrl,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleImageClick = async (event) => {
    try {
      // 파일 선택을 위한 input 엘리먼트 클릭
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImageUrl(e.target.result);
            changePicture(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
    } catch (error) {
      console.error("Error selecting image: ", error);
    }
  };
  const changeNickname = async (nickname) => {
    try {
      const docRef = doc(firestore, "users", id);
      await updateDoc(docRef, {
        nickname: nickname,
      });
      console.log("Nickname updated successfully!");
    } catch (error) {
      console.error("Error updating nickname: ", error);
    }
  };
  const handleNicknameEdit = async () => {
    const newNickname = prompt("새로운 닉네임을 입력하세요:", nickname);

    // 닉네임 길이 확인
    if (newNickname !== null && newNickname.trim().length <= 6) {
      try {
        await changeNickname(newNickname.trim()); // 닉네임 변경
        setNickname(newNickname.trim()); // 화면에 새로운 닉네임 반영
      } catch (error) {
        console.error("Error updating nickname: ", error);
      }
    } else if (newNickname !== null) {
      // 길이가 6자를 초과하는 경우 알림 표시
      alert("닉네임은 6자 이하로 입력해주세요.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNickname(data.nickname || "마루"); // Firestore에서 가져온 닉네임 정보 설정
          setImageUrl(data.profileImageUrl || profile); // 프로필 이미지 정보 설정
        } else {
          setNickname(""); // 사용자의 도큐먼트가 없을 때는 빈 문자열로 설정
          setImageUrl(profile); // 프로필 이미지 정보 설정
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setNickname(""); // 에러가 발생하면 빈 문자열로 설정
        setImageUrl(profile); // 프로필 이미지 정보 설정
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className={classes.firstDiv}>
      <div className={classes.userInfo}>
        <span>회원정보</span>
      </div>
      <button
        className={classes.closeModalButton}
        onClick={() => {
          closeModal(index);
        }}
      >
        <span style={{ fontSize: "30px" }}>&times;</span>
      </button>
      <div>
        <button //프사변경 버튼
          className={classes.profilePictureChangeButton}
          onClick={handleImageClick}
        >
          {imageUrl && (
            <img
              className={classes.profilePicture}
              src={imageUrl}
              alt="ProfilePicture"
            />
          )}
        </button>
        <div className={classes.nicknameBox}>
          <span className={classes.nickname}>{nickname}</span>
          <button
            className={classes.edditNicknameButton}
            onClick={handleNicknameEdit}
          >
            <img src={pencil} alt="Edit" className={classes.nicknameIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
