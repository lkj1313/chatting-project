import classes from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import googleLogo from "../../assets/google.png";
import logo from "../../assets/sendButton.png";
import Button from "@mui/material/Button";
import Loding from "../../components/Loading";

const provider = new GoogleAuthProvider();

provider.addScope("email");

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setTimeout(() => {
        setLoading(false); // 로딩 상태 비활성화
        navigate("/mainPage");
      }, 2000);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/invalid-credential") {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        console.error("로그인 실패:", errorCode, errorMessage);
      }
      setLoading(false);
    }
  };

  const googleLogin = () => {
    // 구글로그인
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        navigate("/mainpage");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        // ...
      });
  };
  return (
    <div className={classes.firstDiv}>
      {loading ? ( // 로딩 중일 때
        <Loding />
      ) : (
        // 로딩 중이 아닐 때
        <div className={classes.secondDiv}>
          <form className={classes.loginForm} onSubmit={handleSubmit}>
            {/* 로그인 폼 */}
            <img
              className={classes.logo}
              src={logo}
              alt="Logo"
              onClick={() => window.location.reload()}
            />
            <div className={classes.inputBox}>
              {/* 이메일, 비밀번호 입력란 */}
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classes.input}
                type="email"
                placeholder="이메일"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classes.input}
                type="password"
                placeholder="비밀번호"
              />
              {/* 로그인, 회원가입 버튼 */}
              <div className={classes.buttonDiv}>
                <Button
                  variant="contained"
                  className={classes.button}
                  style={{ margin: "10px 0px" }}
                  type="submit"
                  name="submitButton"
                >
                  로그인
                </Button>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={() => navigate("/signupPage")}
                >
                  회원가입
                </Button>
              </div>
              {/* 구글 로그인 버튼 */}
              <button
                onClick={googleLogin}
                className={classes.googleLoginButton}
              >
                <div className={classes.buttonContent}>
                  <img
                    className={classes.googleLogo}
                    src={googleLogo}
                    alt="Google Logo"
                  />
                  <span>Google 계정으로 로그인</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
