import classes from "./ChatRoom.module.css";
import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import firestore from "../../../main";
import defaultPic from "../../../assets/profile.jpg";
import ProfilePage from "./profileModal/ProfilePage";

const DEFAULT_PROFILE_PIC = defaultPic;
const DEFAULT_NICKNAME = "마루"; // 기본 닉네임 설정

const ChatRoom = () => {
  const [chatList, setChatList] = useState([]); // 화면에 표시될 채팅 메세지 목록
  const [modalStates, setModalStates] = useState([]); // 각 채팅 메시지에 대한 모달 상태 배열
  const modalRef = useRef(null);

  // 모달 열기
  const openModal = (index) => {
    const newModalStates = [...modalStates];
    newModalStates[index] = true;
    setModalStates(newModalStates);
  };

  // 모달 닫기
  const closeModal = (index) => {
    const newModalStates = [...modalStates];
    newModalStates[index] = false;
    setModalStates(newModalStates);
  };

  const handleClickOutsideModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setModalStates(Array(chatList.length).fill(false));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "messages"),
      async (snapshot) => {
        try {
          const updatedMessages = [];
          for (const docSnap of snapshot.docs) {
            // 메세지 doc 가져오기

            const messageData = docSnap.data();
            // 사용자 정보 가져오기
            const userDoc = await getDoc(
              doc(firestore, "users", messageData.userId)
            );
            const userData = userDoc.data();
            const userProfilePic =
              userData.profileImageUrl || DEFAULT_PROFILE_PIC; // 사용자 프로필 사진 또는 기본 프로필 사진 설정

            const userNickname = userData.nickname || DEFAULT_NICKNAME; // 사용자 닉네임 또는 기본 닉네임 설정
            const messageWithUserInfo = {
              id: docSnap.id,
              message: messageData.message,
              timestamp: messageData.timestamp,
              userProfilePic: userProfilePic,
              userNickname: userNickname,
            };
            updatedMessages.push(messageWithUserInfo);
          }
          const sortedMessages = updatedMessages.sort(
            (a, b) => a.timestamp - b.timestamp
          );
          setChatList(sortedMessages);
        } catch (error) {
          console.error("Error fetching chat list: ", error);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const chatListContainer = document.getElementById("chatListContainer");
    chatListContainer.scrollTop = chatListContainer.scrollHeight;
  }, [chatList]);

  return (
    <div id="chatListContainer" className={classes.firstDiv}>
      {chatList.map((chatItem, index) => (
        <div className={classes.messageContainer} key={chatItem.id}>
          <button
            className={classes.profileButton}
            onClick={() => openModal(index)}
          >
            {" "}
            {/* 수정 */}
            <img
              className={classes.profilePic}
              src={chatItem.userProfilePic}
              alt="Profile Pic"
            />
          </button>
          {modalStates[index] && (
            <div className={classes.modalContainer}>
              <div ref={modalRef} className={classes.modalContent}>
                <ProfilePage closeModal={closeModal} index={index} />
              </div>
            </div>
          )}

          <span className={classes.userNickname}>{chatItem.userNickname}</span>
          <p className={classes.balloon}>
            {" "}
            {chatItem.message}{" "}
            <small>{chatItem.timestamp.toDate().toLocaleString()}</small>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatRoom;
