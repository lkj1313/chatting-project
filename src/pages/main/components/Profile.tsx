import classes from "./Profile.module.css";
import profile from "../../../assets/profile.jpg";

const Profile = ({ width, height }) => {
  return (
    <img
      style={{ width: width, height: height }}
      src={profile}
      alt="기본프로필사진"
    ></img>
  );
};

export default Profile;
