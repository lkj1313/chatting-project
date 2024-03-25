import classes from "./ProfilePage.module.css";
import ProfilePicture from "./components/ProfilePicture";

const ProfilePage = () => {
  return (
    <div className={classes.firstDiv}>
      <div className={classes.profileDiv}>
        <ProfilePicture />
      </div>
    </div>
  );
};

export default ProfilePage;
