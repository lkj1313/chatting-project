import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import classes from "./ChatRoomList.module.css";

const ChatRoomList = ({ mainPageMenuBarOpener }) => {
  console.log(mainPageMenuBarOpener);
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  const enterChatRoom = (roomId, roomName) => {
    const isOkay = window.confirm(`${roomName} 채팅방에 들어가시겠습니까?`);
    if (isOkay) {
      navigate(`/mainpage/${roomId}`);
    }
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const db = getFirestore();
        const roomsCol = collection(db, "rooms");
        const q = query(roomsCol, orderBy("time", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedChatRooms = [];
        const storage = getStorage();

        for (const doc of querySnapshot.docs) {
          const room = doc.data();
          const imageRef = ref(storage, room.imageUrl);
          const url = await getDownloadURL(imageRef);
          fetchedChatRooms.push({ id: doc.id, ...room, imageUrl: url });
        }

        setChatRooms(fetchedChatRooms);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div>
      {mainPageMenuBarOpener ? null : (
        <div className={classes.chatRoomsBox}>
          {chatRooms.map((room) => (
            <div
              key={room.id}
              className={classes.chatRoomBox}
              onClick={() => enterChatRoom(room.id, room.name)}
            >
              <div className={classes.imgBox}>
                <img
                  className={classes.chatRoomImg}
                  src={room.imageUrl}
                  alt="Chatroom Image"
                />
              </div>
              <span className={classes.chatRoomName}>{room.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRoomList;
