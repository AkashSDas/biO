import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { auth, firestore, storage } from "../App";
import { addNotification } from "../utility/notification";

export const UserProfile = () => {
  const usersRef = firestore.collection("users");
  const query = usersRef.orderBy("firstName").limit(25);
  const [users] = useCollectionData(query, { idField: "id" });

  return (
    <div className="profile-grid">
      {users &&
        users.map((user, idx) => (
          <ProfileCard key={idx} user={user} usersRef={usersRef} />
        ))}
    </div>
  );
};

const convertFirestoreTimestampToReact = (timestamp) => {
  let dob = timestamp.toDate().toString();
  dob = dob.split(" ").slice(1, 4).join(" ");
  return dob;
};

export const ProfileCard = (props) => {
  // user profile info
  const {
    address,
    dob,
    firstName,
    lastName,
    phoneNumber,
    profileImg,
  } = props.user;

  return (
    <div className="profile-card">
      <div className="img-container">
        <img src={profileImg} alt={`${firstName} ${lastName}`} />
      </div>

      <div className="description">
        <span id="name">
          {firstName} {lastName}
        </span>
        <span>{convertFirestoreTimestampToReact(dob)}</span>
        <span>{address}</span>
        <span>{phoneNumber}</span>

        <div className="action-btns">
          <EditBtn user={props.user} />
          <DeleteBtn usersRef={props.usersRef} user={props.user} />
          <HeartBtn user={props.user} />
        </div>
      </div>
    </div>
  );
};

const DeleteBtn = ({ usersRef, user }) => {
  const onClick = async () => {
    try {
      await usersRef.doc(user.id).delete();
      addNotification("Success", "Successfully deleted the user", "success");

      // removing user profile img from the firebase storage
      const profileImgsRef = storage.ref(`profileImgs/`);

      let imgName = user.profileImg.substr(
        user.profileImg.indexOf("%2F") + 3,
        user.profileImg.indexOf("?") - (user.profileImg.indexOf("%2F") + 3)
      );
      imgName = imgName.replace("%20", " ");
      profileImgsRef.child(`${imgName}`).delete();
    } catch (e) {
      addNotification(
        "Failure",
        "An error occured which deleting the user",
        "danger"
      );
    }
  };

  return (
    <button className="trash-bin" onClick={onClick}>
      <img src="trash_bin.svg" />
    </button>
  );
};

const EditBtn = (props) => (
  <Link
    to={{
      pathname: "/edit-profile",
      state: {
        user: props.user,
      },
    }}
  >
    <button className="edit">
      <img src="edit.svg" />
    </button>
  </Link>
);

const HeartBtn = ({ user }) => {
  const [isHearted, setIsHearted] = useState(false);

  // to keep the uniqueness to know whether the user has
  // hearted the profile or not, the heart id is kept as
  // profileId_userId (userId === auth.currentUser.uid) and
  // profileId will be that profile's user.id

  const heartRef = firestore
    .collection("hearts")
    .doc(`${user.id}_${auth.currentUser.uid}}`);

  useEffect(() => {
    heartRef.get().then((doc) => {
      if (doc.exists) {
        setIsHearted(true);
      }
    });
  }, []);

  const toggleIsHearted = () => {
    if (isHearted) {
      heartRef
        .delete()
        .then((res) => setIsHearted(false))
        .catch((e) => null);
    } else {
      heartRef
        .set({ profileId: user.id, userId: auth.currentUser.uid })
        .then((res) => setIsHearted(true))
        .catch((e) => null);
    }
  };

  const btnJsx = (className) => (
    <button className={`${className}-heart-btn `} onClick={toggleIsHearted}>
      <i className="far fa-heart"></i>
    </button>
  );

  return <>{isHearted ? btnJsx("active") : btnJsx("inactive")}</>;
};
