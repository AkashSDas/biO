import React from "react";
import { NavBar } from "./nav";
import { UserProfile } from "./user_profile";

export const Landing = () => {
  return (
    <div>
      <NavBar />
      <UserProfile />
    </div>
  );
};
