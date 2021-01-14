import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AddForm } from "./components/add_form";
import { EditForm } from "./components/edit_form";
import { Landing } from "./components/landing";
import { Login } from "./components/login";
import { PrivateRoute } from "./components/private_routes";
import "./design/style.scss";

// ===========================
// FIREBASE CONFIG
// ===========================

// Initialize firebase
firebase.initializeApp({
  // firebase config
});

// Global variables
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Login using google account
export const signInWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

const App = () => {
  return (
    <main>
      <ReactNotification />

      <Router>
        <Switch>
          <PrivateRoute path="/" exact component={Landing} />
          <Route path="/login" exact component={Login} />
          <PrivateRoute path="/add-profile" exact component={AddForm} />
          <PrivateRoute path="/edit-profile" exact component={EditForm} />
        </Switch>
      </Router>
    </main>
  );
};

export default App;
