import classes from "./Bottom.module.css";
import sendButton from "../../../../src/assets/sendButton.png";
import { useState, useContext } from "react";
import { collection, addDoc } from "firebase/firestore";
import firestore from "./../../../main";
import { IdContext } from "../../../App";

const Bottom = () => {
  const id = useContext(IdContext);
  console.log(id);
  const [chat, setChat] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (chat.trim() !== "") {
      try {
        const docRef = await addDoc(collection(firestore, "messages"), {
          message: chat,
          userId: id,
          timestamp: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
        setChat(""); // 메시지 입력 창 초기화
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <div className={classes.firstDiv}>
      <form className={classes.chattingForm} onSubmit={sendMessage}>
        <input
          type="text"
          value={chat}
          onChange={(e) => {
            setChat(e.target.value);
          }}
        ></input>
        <button type="submit">
          <img src={sendButton}></img>
        </button>
      </form>
    </div>
  );
};

export default Bottom;
