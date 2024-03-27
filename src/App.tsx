import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext } from "react";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ChatPage from "./pages/chat/ChatPage";
import ProfilePage from "./pages/profile/ProfilePage";

//id context
export const IdContext = createContext(null);
// PrivateRoute 컴포넌트 정의
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [id, setId] = useState();
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // 사용자가 있으면 true, 없으면 false 설정
      if (user) {
        setId(user.uid); // 사용자가 있으면 ID 설정
      }

      if (!user) {
        // 사용자가 없으면 /로 리디렉션
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]); // navigate를 useEffect 의존성 배열에 추가

  return (
    <IdContext.Provider value={id}>
      {isAuthenticated ? children : <LoginPage />}
    </IdContext.Provider>
  ); // isAuthenticated가 true면 children을 렌더링
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signupPage" element={<SignupPage />} />

        <Route
          path="chatpage"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profilePage"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
