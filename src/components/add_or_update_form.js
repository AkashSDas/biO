import React from "react";
import { NavBar } from "./nav";

export const AddOrUpdateProfileForm = ({
  operationText,
  handleSubmit,
  formValues,
  handleFormChange,
  userProfileImgUrl = null,
}) => {
  const userProfileImgJsx = () => {
    if (userProfileImgUrl) {
      return (
        <div>
          <img src={userProfileImgUrl} />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <NavBar />

      <section className="add-or-edit-form">
        <h2>{operationText} your profile</h2>

        {userProfileImgJsx()}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Firstname</label>
            <input
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleFormChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label>Lastname</label>
            <input
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleFormChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label>Date of birth</label>
            <input
              type="date"
              name="dob"
              value={formValues.dob}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formValues.address}
              onChange={handleFormChange}
              placeholder="Enter your address"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleFormChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Profile image</label>
            <input type="file" name="profileImg" onChange={handleFormChange} />
          </div>

          <button type="submit">
            <i className="fas fa-alien-monster"></i> Submit
          </button>
        </form>
      </section>
    </div>
  );
};
