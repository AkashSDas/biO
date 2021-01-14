import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route } from "react-router-dom";
import { auth } from "../App";

// routes which needs user to be authenticated
export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user] = useAuthState(auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
