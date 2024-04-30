import { useState, useEffect, useRef } from "react";
import classes from "./ChatList.module.css";
import auth from "../../../main";
import Modal from "../../../components/Modal";

import { Button } from "@mui/material";

const ChatList = ({ chatList }) => {
  const chatListRef = useRef(null); // ChatList 컴포넌트의 ref 생성
  const curretUserUid = auth.auth.currentUser.reloadUserInfo.localId;
  const [chatMenuOpen, setChatMenuOpen] = useState(false);

  const [openModalIndex, setOpenModalIndex] = useState(null);

  const handleChatClick = (key) => {
    setOpenModalIndex(key);
  };

  const closeModal = () => {
    setOpenModalIndex(null);
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatList]); // 스크롤 chatList가 업데이트 될떄마다 젤 아래로 내리기
  console.log(chatMenuOpen);
  return (
    <div className={classes.chatListContainer} ref={chatListRef}>
      {chatList
        .sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
        .map((chat) => (
          <div
            className={
              curretUserUid === chat.userId
                ? classes.chatContainerMy
                : classes.chatContainerOther
            }
            key={chat.timestamp}
          >
            <div
              className={
                curretUserUid === chat.userId
                  ? classes.profilePictureNicknameBoxMy
                  : classes.profilePictureNicknameBoxOther
              }
            >
              <img
                className={classes.chatProfilePicture}
                src={chat.profilePicture}
              ></img>
              <div className={classes.chatNickname}>{chat.nickname}</div>
            </div>

            <div
              className={
                curretUserUid === chat.userId
                  ? classes.chatDivMy
                  : classes.chatDivOther
              }
            >
              <div className={classes.chatMessage}>
                {chat.message}
                <button
                  className={classes.chatMenuButton}
                  onClick={() => handleChatClick(chat.timestamp)}
                >
                  ⋮
                </button>
              </div>

              <div className={classes.chatTime}>
                {new Date( // 채팅시간
                  chat.timestamp.seconds * 1000 +
                    chat.timestamp.nanoseconds / 1000000
                ).toLocaleString("ko-KR", {
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      {openModalIndex !== null && (
        <Modal closeModal={closeModal} title="채팅 수정창" height="200px">
          <div className={classes.chatCorrectBox}>
            <Button variant="contained">채팅 삭제</Button>
            <Button variant="contained">채팅 수정하기</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ChatList;
{
  /* <div className={classes.menuOverlay}>
  <div className={classes.chatMenu}>
    <button className={classes.chatRemoveButton}>대화 삭제</button>
    <button className={classes.chatModifyButton}>대화 수정</button>
  </div>
</div>; */
}
