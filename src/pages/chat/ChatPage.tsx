import { useState } from "react";
import classes from "./ChatPage.module.css";
import Top from "./components/Top";
import Bottom from "./components/Bottom";

import Middle from "./components/Middle";

const ChatPage = () => {
  const [chatList, setChatList] = useState([]);
  return (
    <div className={classes.firstDiv}>
      <Top />

      <Middle chatList={chatList} />
      <div className={classes.bottom}>
        <Bottom chatList={chatList} setChatList={setChatList} />
      </div>
    </div>
  );
};

export default ChatPage;
