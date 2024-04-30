import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ChatPage from "./pages/chat/ChatPage";
import MainPage from "./pages/main/MainPage";
import profile from "./assets/profile.jpg";
// 파이어스토어에서 사용자의 프로필 사진을 가져오는 함수

const getProfilePicture = async (userId) => {
  const firestore = getFirestore();
  try {
    const userDoc = doc(firestore, "users", userId); // users 컬렉션에서 해당 사용자 문서 가져오기
    const userSnapshot = await getDoc(userDoc); // 사용자 문서 가져오기
    console.log(userSnapshot);
    if (userSnapshot.exists()) {
      // 사용자 문서가 존재하면 프로필 사진 반환
      return userSnapshot.data().profilePicture;
    } else {
      console.log("사용자 문서가 존재하지 않습니다.");
      return null;
    }
  } catch (error) {
    console.error(
      "파이어스토어에서 프로필 사진을 가져오는 중 오류 발생:",
      error
    );
    return null;
  }
};
//id context
export const Context = createContext(null);

// PrivateRoute 컴포넌트 정의
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [id, setId] = useState();
  const [profilePicture, setProfilePicture] = useState(profile);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user); // 사용자가 있으면 true, 없으면 false 설정

      if (user) {
        console.log(user);
        const userId = user.uid;
        setId(userId); // 사용자가 있으면 ID 설정
        console.log(userId);

        const userProfilePicture = await getProfilePicture(userId);
        console.log(userProfilePicture);
        setProfilePicture(userProfilePicture); // 프로필 사진 설정
      }

      if (!user) {
        // 사용자가 없으면 /로 리디렉션
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Context.Provider value={{ id, profilePicture, setProfilePicture }}>
      {isAuthenticated ? children : <LoginPage />}
    </Context.Provider>
  ); // isAuthenticated가 true면 children을 렌더링
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signupPage" element={<SignupPage />} />
        <Route
          path="/mainpage"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mainpage/:roomId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
