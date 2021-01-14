import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect } from "react-router-dom";
import { auth, signInWithGoogle } from "../App";
import { Logo } from "./logo";

const LoginBtn = () => (
  <div className="sign-in-btn" onClick={signInWithGoogle}>
    <i className="fab fa-google"></i>
    <span>Sign in with Google</span>
  </div>
);

export const Login = () => {
  const [user] = useAuthState(auth);

  // since on chaning the authState the user is not redirected
  // to the Landing page therefore doing a redirect
  const redirectToLandingPage = () => {
    return user ? <Redirect to="/" /> : null;
  };

  return (
    <section className="login">
      {redirectToLandingPage()}

      <Logo />
      <div className="description">
        <span>build with</span>
        <img src="/react-logo.svg" />
        <img src="/firebase-logo.svg" />
      </div>
      <LoginBtn />
    </section>
  );
};
