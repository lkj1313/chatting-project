import classes from "./Top.module.css";
import { useState, useContext, useEffect } from "react";

import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Top = () => {
  const [roomName, setRoomName] = useState(""); // 방 이름 상태 추가
  const roomId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();

  useEffect(() => {
    getRoomData(roomId); // getRoomData 함수 호출
  }, []);

  const getRoomData = async (roomId) => {
    const firestore = getFirestore();
    try {
      const roomDocRef = doc(firestore, "rooms", roomId);
      const roomDocSnap = await getDoc(roomDocRef);
      if (roomDocSnap.exists()) {
        const roomData = roomDocSnap.data();
        const roomName = roomData.name;

        setRoomName(roomName); // 방 이름 상태 업데이트
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting room document:", error);
    }
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
      <span className={classes.roomName}>{roomName}</span>
    </div>
  );
};

export default Top;
