import { useState } from "react";
import classes from "./ChatRoomCreatorModal.module.css";
import cameraImg from "../../../assets/camera.png";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const ChatRoomCreatorModal = ({ closeModal }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatRoomName, setChatRoomName] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  /////// 체크눌렀을시
  const handleChatRoomCreation = async () => {
    if (!chatRoomName) {
      alert("대화방 이름을 입력해주세요.");
      return;
    }

    const db = getFirestore();
    const storage = getStorage();

    try {
      if (selectedImage) {
        // 이미지 업로드
        const imageRef = ref(storage, `chatroom_images/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
      }

      // 대화방 생성
      const roomsRef = collection(db, "rooms");
      const roomData = {
        name: chatRoomName,
        imageUrl: selectedImage
          ? `chatroom_images/${selectedImage.name}`
          : null,
      };
      await addDoc(roomsRef, roomData);

      alert("대화방이 성공적으로 생성되었습니다.");
      closeModal();
    } catch (error) {
      console.error("Error creating chat room: ", error);
      alert("대화방 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ margin: "10px" }}>
      <div className={classes.inputChatRoomNameCotainer}>
        <input
          className={classes.pictureInput}
          id="fileInput"
          type="file"
          onChange={handleImageChange}
        ></input>
        <label htmlFor="fileInput">
          <div className={classes.cameraImgBox}>
            {selectedImage ? (
              <img
                className={classes.cameraImg}
                src={URL.createObjectURL(selectedImage)}
              ></img>
            ) : (
              <img
                className={classes.cameraImg}
                src={cameraImg}
                alt="camera img"
              ></img>
            )}
          </div>
        </label>
        <div style={{ position: "relative" }}>
          <input
            className={classes.chatRoomNameInput}
            placeholder="대화방명"
            maxLength={10}
            value={chatRoomName}
            onChange={(e) => setChatRoomName(e.target.value)}
          ></input>
          <button
            className={classes.checkButton}
            onClick={handleChatRoomCreation}
          >
            <span>✅</span>
          </button>
          <div className={classes.guideInputBox}>
            <input className={classes.guideInput} placeholder="안내"></input>
            <span>대화방에 관한 설명을 써주세요</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomCreatorModal;
