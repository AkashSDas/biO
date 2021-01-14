import firebase from "firebase";
import React from "react";
import { auth, firestore, storage } from "../App";
import { useForm } from "../shared/hooks";
import { addNotification } from "../utility/notification";
import { AddOrUpdateProfileForm } from "./add_or_update_form";

export const AddForm = () => {
  const profileImgsRef = storage.ref("profileImgs/");
  const usersRef = firestore.collection("users");
  const initialFormValues = {
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    phoneNumber: "",
    profileImg: null,
  };
  const [formValues, setFromValues, handleFormChange] = useForm(
    initialFormValues
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const img = profileImgsRef.child(`${auth.currentUser.uid}-${Date.now()}`);
    await img.put(formValues.profileImg);
    const url = await img.getDownloadURL();

    try {
      await usersRef.add({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        address: formValues.address,
        phoneNumber: formValues.phoneNumber,
        profileImg: url,
        dob: firebase.firestore.Timestamp.fromDate(new Date(formValues.dob)),
      });
      setFromValues(initialFormValues);
      addNotification("Success", "Successfully added user profile", "success");
    } catch (err) {
      addNotification(
        "Failure",
        "An error occured while adding user profile",
        "error"
      );
    }
  };

  return (
    <AddOrUpdateProfileForm
      operationText="Add"
      handleSubmit={handleSubmit}
      formValues={formValues}
      handleFormChange={handleFormChange}
    />
  );
};
