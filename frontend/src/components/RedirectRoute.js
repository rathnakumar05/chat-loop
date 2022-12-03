import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { authState } from "../features/authSlice";

function RedirectRoute({ children, ...rest }) {
    const auth = useSelector(authState);
    return (auth.auth === "Y") ? <Navigate
        to={{
            pathname: "/chat-area"
        }}
    /> : children;
}

export default RedirectRoute;