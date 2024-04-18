import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const Bottom = () => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const db = getFirestore();
        const roomsCol = collection(db, "rooms");
        const querySnapshot = await getDocs(roomsCol);
        const fetchedChatRooms = [];
        querySnapshot.forEach((doc) => {
          fetchedChatRooms.push({ id: doc.id, ...doc.data() });
        });
        setChatRooms(fetchedChatRooms);
      } catch (error) {
        console.error("Error fetching chat rooms: ", error);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div>
      <h2>채팅방 목록</h2>
      <div>
        {chatRooms.map((room) => (
          <div key={room.id}>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            {/* 필요한 정보를 추가로 표시할 수 있습니다 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bottom;
