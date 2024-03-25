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

const provider = new GoogleAuthProvider();

provider.addScope("email");

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      alert("로그인 완료");
      //로그인 성공후 /main페이지로 이동
      navigate("/profilepage");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/invalid-credential") {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      } else {
        console.error("로그인 실패:", errorCode, errorMessage);
      }
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
        alert("로그인 완료");
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
      <div className={classes.secondDiv}>
        <form className={classes.loginForm} onSubmit={handleSubmit}>
          <div className={classes.Login}>Login</div>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className={classes.input}
            type="email"
            placeholder="아이디"
          ></input>

          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={classes.input}
            type="password"
            placeholder="비밀번호"
          ></input>

          <div className={classes.buttonDiv}>
            <button // 로그인버튼
              className={classes.button}
              type="submit"
              name="submitButton"
            >
              로그인
            </button>

            <button //회원가입 버튼
              className={classes.button}
              onClick={() => navigate("/signupPage")}
            >
              회원가입
            </button>
          </div>

          <button onClick={googleLogin} className={classes.googleLoginButton}>
            <div className={classes.buttonContent}>
              <img
                className={classes.googleLogo}
                src={googleLogo}
                alt="googleLogo"
              />
              <span>Google 계정으로 로그인</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
