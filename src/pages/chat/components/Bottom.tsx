import classes from "./Bottom.module.css";
import sendButton from "../../../../src/assets/sendButton.png";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  getDocs,
} from "firebase/firestore";

import auth from "../../../main";

const Bottom = ({ chatList, setChatList }) => {
  const currentUser = auth.auth.currentUser;
  const userId = currentUser.reloadUserInfo.localId;
  const roomId = window.location.pathname.split("/").pop();

  const [chat, setChat] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const firestore = getFirestore();
    if (chat.trim() !== "") {
      try {
        // 사용자 프로필 사진 URL 가져오기
        const userDocRef = doc(firestore, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        let profilePictureUrl = null;
        let nickname = null;

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          profilePictureUrl = userData.profilePicture;
          nickname = userData.nickname;
        }

        // 채팅 메시지 저장
        const messagesCollectionRef = collection(
          firestore,
          `rooms/${roomId}/messages`
        );
        await addDoc(messagesCollectionRef, {
          profilePicture: profilePictureUrl,
          message: chat,
          userId: userId,
          nickname: nickname,
          timestamp: new Date(),
        });
        setChat(""); // 메시지 입력 창 초기화
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      getChatList(roomId);
    }
  };

  const getChatList = async (roomId) => {
    const firestore = getFirestore();
    try {
      const q = query(collection(firestore, "rooms", roomId, "messages"));
      const querySnapshot = await getDocs(q);

      const chats = querySnapshot.docs.map((doc) => doc.data());
      if (chatList.length < chats.length) {
        setChatList(chats);
      }
    } catch (error) {
      console.log(error);
      return []; // 에러 발생 시 빈 배열 반환 또는 다른 처리 방식
    }
  };

  useEffect(() => {
    getChatList(roomId);
  }, [roomId]);

  return (
    <div className={classes.firstDiv}>
      <form className={classes.chattingForm} onSubmit={sendMessage}>
        <input
          type="text"
          value={chat}
          onChange={(e) => {
            setChat(e.target.value);
          }}
        ></input>
        <button type="submit">
          <img src={sendButton} alt="Send" />
        </button>
      </form>
    </div>
  );
};

export default Bottom;
