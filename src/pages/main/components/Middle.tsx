import ChatRoomList from "./ChatRoomList";

const Middle = ({ setMainPageMenuBarOpener, mainPageMenuBarOpener }) => {
  return (
    <ChatRoomList
      mainPageMenuBarOpener={mainPageMenuBarOpener}
      setMainPageMenuBarOpener={setMainPageMenuBarOpener}
    />
  );
};

export default Middle;
