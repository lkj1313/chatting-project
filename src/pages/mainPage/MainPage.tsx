import classes from "./MainPage.module.css";
import Top from "./components/Top";
import Bottom from "./components/Bottom";

import ChatRoom from "./components/ChatRoom";

const MainPage = () => {
  return (
    <div className={classes.firstDiv}>
      <Top />
      <ChatRoom />
      <Bottom />
    </div>
  );
};

export default MainPage;
