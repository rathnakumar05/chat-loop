import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { authState } from "../features/authSlice";

function AuthRoute({ children, ...rest }) {
    const auth = useSelector(authState);
    return (auth.auth === "Y") ? children : <Navigate
    to={{
            pathname: "/login"
    }}
/>
}

export default AuthRoute;