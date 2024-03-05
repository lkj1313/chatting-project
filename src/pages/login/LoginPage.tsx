import classes from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

const LoginPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className={classes.firstDiv}>
      <div className={classes.secondDiv}>
        <form className={classes.loginForm} onSubmit={handleSubmit}>
          <input className={classes.input} placeholder="아이디"></input>
          <input className={classes.input} placeholder="비밀번호"></input>
          <div>
            <button
              className={classes.button}
              type="submit"
              name="submitButton"
            >
              로그인
            </button>
            <button
              className={classes.button}
              onClick={() => {
                navigate("/signupPage");
              }}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
