import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import classes from "./ChatRoomList.module.css";

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {
    try {
      const db = getFirestore();
      const roomsCol = collection(db, "rooms");
      const querySnapshot = await getDocs(
        query(collection(db, "rooms"), orderBy("time", "desc"))
      );

      const fetchedChatRooms = [];
      querySnapshot.forEach((doc) => {
        fetchedChatRooms.push({ id: doc.id, ...doc.data() });
      });

      const storage = getStorage();
      const updatedChatRooms = await Promise.all(
        fetchedChatRooms.map(async (room) => {
          const imageRef = ref(storage, room.imageUrl);
          const url = await getDownloadURL(imageRef);
          return { ...room, imageUrl: url };
        })
      );

      if (JSON.stringify(updatedChatRooms) !== JSON.stringify(chatRooms)) {
        setChatRooms(updatedChatRooms);
      }
    } catch (error) {
      console.error("Error fetching chat rooms: ", error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [chatRooms]);

  return (
    <div className={classes.chatRoomsBox}>
      {chatRooms.map((room) => (
        <div className={classes.chatRoomBox} key={room.id}>
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
  );
};

export default ChatRoomList;
