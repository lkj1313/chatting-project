import classes from "./Top.module.css";
import { useState, useContext, useEffect } from "react";

import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Top = () => {
  const [roomName, setRoomName] = useState(""); // 방 이름 상태 추가
  const [roomImage, setRoomImage] = useState("");
  const roomId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();

  useEffect(() => {
    getRoomData(roomId); // getRoomData 함수 호출
  }, []);

  const getRoomData = async (roomId) => {
    const firestore = getFirestore();
    const storage = getStorage();
    try {
      const roomDocRef = doc(firestore, "rooms", roomId);
      const roomDocSnap = await getDoc(roomDocRef);
      if (roomDocSnap.exists()) {
        const roomData = roomDocSnap.data();
        const roomName = roomData.name;
        const roomImgUrl = roomData.imageUrl;
        console.log(roomImgUrl);

        const imageRef = ref(storage, roomImgUrl);

        setRoomName(roomName); // 방 이름 상태 업데이트
        getDownloadURL(imageRef)
          .then((url) => {
            // 다운로드 URL을 상태에 설정
            setRoomImage(url);
            console.log(url);
          })
          .catch((error) => {
            // 이미지 다운로드 URL을 얻는 동안 에러 발생 시 처리
            console.error("다운로드 URL을 가져오는 중 에러 발생:", error);
          });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting room document:", error);
    }
  };

  const handleRefreshClick = () => {
    //페이지 새로고침
    window.location.reload();
  };

  return (
    <div className={classes.firstDiv}>
      <button
        className={classes.backButton}
        onClick={() => {
          navigate("/mainpage");
        }}
      >
        🔙{" "}
      </button>
      <button className={classes.roomImgButton} onClick={handleRefreshClick}>
        <img className={classes.roomImg} src={roomImage} alt="roomImg"></img>
      </button>
      <span className={classes.roomName}>{roomName}</span>
    </div>
  );
};

export default Top;
