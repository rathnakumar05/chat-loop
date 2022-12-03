import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthRoute from "../components/AuthRoute";
import RedirectRoute from "../components/RedirectRoute";
import ChatArea from "../views/chat-area";
import Login from "../views/login";
import Register from "../views/register";

function MainRouter() {    
    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <RedirectRoute>
                        <Login />
                    </RedirectRoute>
                } />
                <Route path="/register" element={
                    <RedirectRoute>
                        <Register />
                    </RedirectRoute>
                } />
                <Route path="/chat-area" element={
                    <AuthRoute>
                        <ChatArea />
                    </AuthRoute>
                    } />
                <Route path="/" element={
                    <AuthRoute>
                        <ChatArea />
                    </AuthRoute>
                    } />
                </Routes>
        </Router>
    )
}

export default MainRouter;
