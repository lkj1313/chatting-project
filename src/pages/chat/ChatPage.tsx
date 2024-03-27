import classes from "./ChatPage.module.css";
import Top from "./components/Top";
import Bottom from "./components/Bottom";

import ChatRoom from "./components/ChatRoom";

const ChatPage = () => {
  return (
    <div className={classes.firstDiv}>
      <Top />
      <ChatRoom />
      <Bottom />
    </div>
  );
};

export default ChatPage;
