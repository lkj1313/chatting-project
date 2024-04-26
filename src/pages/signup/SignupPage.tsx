import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import sendButton from "../../assets/sendButton.png";
import classes from "./SignupPage.module.css";
import Button from "@mui/material/Button";
import firestore from "../../main";
import Loding from "../../components/Loading";
import URL_TO_DEFAULT_PROFILE_PICTURE from "../../assets/profile.jpg";
const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
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
  const inputNickname = (e) => {
    setNickname(e.target.value);
  };
  const signup = async () => {
    if (emailCheck(email) && passwordCheck(password) && nickname.length >= 2) {
      setLoading(true);
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        setTimeout(() => {
          setLoading(false); // 로딩 상태 비활성화
          navigate("/");
        }, 2000);
        // Firestore에 사용자 정보 저장
        const firestore = getFirestore();
        if (firestore) {
          await setDoc(doc(firestore, "users", user.uid), {
            email: email,
            nickname: nickname,
            profilePicture: URL_TO_DEFAULT_PROFILE_PICTURE, // 기본 프로필 사진 URL
          });
        } else {
          console.error("파이어스토어 연결에 문제가 있습니다.");
        }

        alert("가입이 완료되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("가입 중 오류가 발생했습니다:", error.message);
        if (error.code === "auth/email-already-in-use") {
          alert("이미 사용 중인 이메일 주소입니다.");
        } else {
          alert("가입 중 오류가 발생했습니다: " + error.message); // 오류 메시지 출력 수정
        }
      }
    } else {
      if (!emailCheck(email)) {
        alert("이메일 형식이 맞지 않습니다.");
      }

      if (!passwordCheck(password)) {
        alert("비밀번호가 6자리는 넘어야합니다.");
      }
      if (nickname.length < 2) {
        alert("닉네임은 2자리수를 넘어야 합니다.");
      }
    }
  };

  return (
    <div className={classes.firstDiv}>
      {loading ? (
        <Loding />
      ) : (
        <div className={classes.secondDiv}>
          <div className={classes.signup}>
            <img
              className={classes.icon}
              src={sendButton}
              alt="ICON"
              onClick={() => navigate("/")}
            ></img>
          </div>
          <div className={classes.inputBox}>
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
            <input
              className={classes.input}
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={inputNickname}
            ></input>

            <Button
              variant="contained"
              className={classes.singupButton}
              onClick={signup}
              type="submit"
            >
              회원가입 하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
