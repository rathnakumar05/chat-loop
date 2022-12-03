import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setSession } from "../../features/authSlice";
import { deleteSessionAuth } from '../../utils/session';

function Base(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // axios.interceptors.response.use(function (response) {
    //     return response;
    // }, function (error) {
    // if (401 === error.response.status) {
    //     navigate("/login");
    // } else {
    //     return Promise.reject(error);
    // }
    // });
    function handleLogout() {
        props.logoutSocket();
        axios.get("/auth/logout").then(function (response) {
            if (response.data.type === "success") {
                dispatch(setSession({ session_id: "", auth: "N" }));
                deleteSessionAuth();
                navigate("/login");
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <React.Fragment>
            <nav className="navbar bg-light mb-4">
                <div className="container">
                    <a className="navbar-brand text-primary" href="/#">
                        <h1>Chat Loop</h1>
                    </a>
                    <button className="btn btn-primary rounded-pill align-top" onClick={handleLogout} >Logout</button>
                </div>
            </nav>
            {props.children}
        </React.Fragment>
    );
}

export default Base;

