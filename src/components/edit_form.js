import firebase from "firebase";
import React from "react";
import { auth, firestore, storage } from "../App";
import { useForm } from "../shared/hooks";
import { addNotification } from "../utility/notification";
import { AddOrUpdateProfileForm } from "./add_or_update_form";

export const EditForm = (props) => {
  const { user } = props.history.location.state;

  const profileImgsRef = storage.ref(`profileImgs/`);
  const usersRef = firestore.collection("users");
  const initialFormValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    dob: user.dob.toDate().toISOString().substr(0, 10),
    phoneNumber: user.phoneNumber,
    profileImg: null,
  };
  const [formValues, setFromValues, handleFormChange] = useForm(
    initialFormValues
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formValues.profileImg !== undefined) {
      // delete old profile img
      let imgName = user.profileImg.substr(
        user.profileImg.indexOf("%2F") + 3,
        user.profileImg.indexOf("?") - (user.profileImg.indexOf("%2F") + 3)
      );
      imgName = imgName.replace("%20", " ");
      profileImgsRef.child(`${imgName}`).delete();

      // add new profile img
      const img = profileImgsRef.child(`${auth.currentUser.uid}-${Date.now()}`);
      await img.put(formValues.profileImg);
      const url = await img.getDownloadURL();

      try {
        await usersRef.doc(user.id).update({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          address: formValues.address,
          phoneNumber: formValues.phoneNumber,
          profileImg: url,
          dob: firebase.firestore.Timestamp.fromDate(new Date(formValues.dob)),
        });
        setFromValues(initialFormValues);
        addNotification(
          "Success",
          "Successfully updated user profile",
          "success"
        );
      } catch (err) {
        addNotification(
          "Failure",
          "An error occured while updating user profile",
          "danger"
        );
      }
    } else {
      try {
        await usersRef.doc(user.id).update({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          address: formValues.address,
          phoneNumber: formValues.phoneNumber,
          dob: firebase.firestore.Timestamp.fromDate(new Date(formValues.dob)),
        });
        setFromValues(initialFormValues);
        addNotification(
          "Success",
          "Successfully updated user profile",
          "success"
        );
      } catch (err) {
        addNotification(
          "Failure",
          "An error occured while updating user profile",
          "danger"
        );
      }
    }
  };

  return (
    <AddOrUpdateProfileForm
      operationText="Edit"
      handleSubmit={handleSubmit}
      formValues={formValues}
      handleFormChange={handleFormChange}
      userProfileImgUrl={user.profileImgUrl}
    />
  );
};
