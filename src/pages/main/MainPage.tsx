import classes from "./Mainpage.module.css";
import Middle from "./components/Middle";

import Top from "./components/Top";
import { useState } from "react";

const MainPage = () => {
  const [mainPageMenuBarOpener, setMainPageMenuBarOpener] = useState(false);
  return (
    <div className={classes.mainPageFirstDiv}>
      <Top
        setMainPageMenuBarOpener={setMainPageMenuBarOpener}
        mainPageMenuBarOpener={mainPageMenuBarOpener}
      />
      <Middle
        setMainPageMenuBarOpener={setMainPageMenuBarOpener}
        mainPageMenuBarOpener={mainPageMenuBarOpener}
      />
    </div>
  );
};

export default MainPage;
