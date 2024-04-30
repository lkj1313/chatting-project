import { useState } from "react";
import classes from "./ChatRoomCreatorModal.module.css";
import cameraImg from "../../../assets/camera.png";
import checkImg from "../../../assets/checkImg.png";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import defaultBackground from "../../../assets/defaultBackground.jpg";

const ChatRoomCreatorModal = ({ closeModal }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatRoomName, setChatRoomName] = useState("");
  const [chatRoomDescription, setChatRoomdDescription] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const handleDescriptionChange = (e) => {
    setChatRoomdDescription(e.target.value);
  };

  /////// 체크눌렀을시
  const handleChatRoomCreation = async () => {
    if (chatRoomName.length > 4) {
      alert("대화방 이름은 4글자를 초과할 수 없습니다.");
      return;
    }
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
      } else {
        // 이미지가 없는 경우 기본 프로필 이미지 업로드
        const imageRef = ref(storage, "chatroom_images/defaultBackground.jpg");
        const response = await fetch(defaultBackground); // 이미지 경로를 사용하여 이미지를 가져옴

        const blob = await response.blob();
        // 이미지를 Blob 객체로 변환
        await uploadBytes(imageRef, blob); // Blob 객체를 사용하여 이미지 업로드
      }

      // 대화방 생성
      const roomsRef = collection(db, "rooms");
      const roomData = {
        name: chatRoomName,
        imageUrl: selectedImage
          ? `chatroom_images/${selectedImage.name}`
          : `chatroom_images/defaultBackground.jpg`,
        description: chatRoomDescription,
        time: new Date().toISOString(),
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
                alt="cameraImg"
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
            <img src={checkImg} alt="checkImg"></img>
          </button>
          <div className={classes.guideInputBox}>
            <input
              className={classes.guideInput}
              placeholder="안내"
              onChange={handleDescriptionChange}
            ></input>
            <span>대화방에 관한 설명을 써주세요</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomCreatorModal;
