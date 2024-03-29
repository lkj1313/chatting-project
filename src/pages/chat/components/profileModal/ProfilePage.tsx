import classes from "./ProfilePage.module.css";
import ProfilePicture from "./ProfilePicture";

const ProfilePage = ({ closeModal, index }) => {
  console.log(closeModal);
  return (
    <div className={classes.firstDiv}>
      <div className={classes.profileDiv}>
        <ProfilePicture closeModal={closeModal} index={index} />
      </div>
    </div>
  );
};

export default ProfilePage;
