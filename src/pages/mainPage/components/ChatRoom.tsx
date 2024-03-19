import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import firestore from "../../../main";

const ChatRoom = () => {
  const [chatList, setChatList] = useState([]); // 화면에 표시될 채팅 메세지 목록

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const chatCollection = collection(firestore, "messages"); // "messages" 컬렉션 사용
        const unsubscribe = onSnapshot(chatCollection, (snapshot) => {
          // message 컬렉션 변경사항 감지
          const chats = [];
          snapshot.forEach((doc) => {
            chats.push({ id: doc.id, ...doc.data() });
          });
          setChatList(chats);
        });
      } catch (error) {
        console.error("Error fetching chat list: ", error);
      }
    };

    // 컴포넌트가 마운트되면 Firestore에서 채팅 목록을 가져옴
    fetchChatList();

    // 컴포넌트가 언마운트될 때 리스너 구독 해제
    return () => {};
  }, []);

  return (
    <div>
      {chatList.map((chatItem) => (
        <div key={chatItem.id}>
          <p>{chatItem.message}</p>
          <small>{chatItem.timestamp.toDate().toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ChatRoom;
