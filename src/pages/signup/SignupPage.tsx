import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import classes from "./SignupPage.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegEx = /^[A-Za-z0-9]{6,}$/;

  const emailCheck = (email: string): boolean => {
    return emailRegEx.test(email);
  };

  const passwordCheck = (password: string): boolean => {
    return passwordRegEx.test(password);
  };

  const inputEmail = (e: React.FormEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const inputPassword = (e: React.FormEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const signup = async () => {
    if (emailCheck(email) && passwordCheck(password)) {
      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        alert("가입이 완료되었습니다.");
        navigate("/");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          alert("이미 사용 중인 이메일 주소입니다.");
        } else {
          alert("가입 중 오류가 발생했습니다:", error.message);
        }
      }
    } else {
      if (!emailCheck(email)) {
        alert("이메일 형식이 맞지 않습니다.");
      }

      if (!passwordCheck(password)) {
        alert("비밀번호가 6자리는 넘어야합니다.");
      }
    }
  };

  return (
    <div className={classes.firstDiv}>
      <div className={classes.secondDiv}>
        <div className={classes.signup}>Signup</div>
        <input
          className={classes.input}
          placeholder="이메일을 입력해주세요"
          type="email"
          value={email}
          onChange={inputEmail}
        ></input>
        <input
          className={classes.input}
          placeholder="비밀번호를 입력해주세요"
          type="password"
          value={password}
          onChange={inputPassword}
        ></input>
        <div>
          <button className={classes.button} onClick={signup} type="submit">
            회원가입 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
