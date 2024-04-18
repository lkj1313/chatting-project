import classes from "./Mainpage.module.css";
import Middle from "./components/Middle";
import Top from "./components/Top";

const MainPage = () => {
  return (
    <div className={classes.mainPageFirstDiv}>
      <Top />
      <Middle />
    </div>
  );
};

export default MainPage;
