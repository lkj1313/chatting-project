import classes from "./Menu.module.css";

import { useState } from "react";
import firebase from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Menu = ({ setHidden }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    const isLogOut = window.confirm("정말 로그아웃 하시겠습니까?");
    if (!isLogOut) return;

    try {
      const auth = getAuth();
      await signOut(auth);

      navigate("/");
    } catch (error) {
      alert("로그아웃 중 오류가 발생했습니다: " + error.message);
    }
  };
  return (
    <div className={classes.menuBox}>
      <div
        className={isOpen ? `${classes.overlay}` : ""}
        onClick={() => {
          setHidden(false);
          setIsOpen(!isOpen);
        }}
      ></div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHidden(true);
        }}
        className={
          isOpen ? `${classes.menuButtonHidden}` : `${classes.menuButton}`
        }
      >
        ☰
      </button>
      <>
        <div
          className={`${classes.menuContainer} ${
            isOpen ? classes.open : classes.close
          }`}
        >
          <button onClick={logout}>로그아웃</button>
          <button>대화방 만들기</button>
        </div>
      </>
    </div>
  );
};

export default Menu;
