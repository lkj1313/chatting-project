import { useEffect, useState, useRef } from "react";
import classes from "./ChatList.module.css";
import auth from "../../../main";

const ChatList = ({ chatList }) => {
  const chatListRef = useRef(null); // ChatList 컴포넌트의 ref 생성
  const curretUserUid = auth.auth.currentUser.reloadUserInfo.localId;
  console.log(curretUserUid);

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
            key={chat.timestamp.seconds}
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
              <div className={classes.chatMessage}>{chat.message}</div>
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
    </div>
  );
};

export default ChatList;
