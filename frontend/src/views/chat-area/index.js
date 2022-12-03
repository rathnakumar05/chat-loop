import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import * as bootstrap from 'bootstrap';

import Base from "../layouts/Base";
import AddContact from "./AddContact";
import Contacts from "./Contacts";
import Chat from "./Chat";
import ContactModal from "./ContactModal";
import "./chat-area.css";
import { setSession, authState } from "../../features/authSlice";
import { deleteSessionAuth } from '../../utils/session';

function ChartArea() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(authState);
    const URL = "http://localhost:3000";
    /* eslint-disable no-unused-vars */
    const [socket, setSocket] = useState(io(URL, { autoConnect: false }));
    /* eslint-disable no-unused-vars */
    const [contacts, setContacts] = useState([]);
    const [chat, setChat] = useState({
        username: "",
        message: [],
        show: false,
    });

    function getContacts() {
        axios.get("/contact").then(function (response) {
            var data = response.data;
            if (data.type === "success") {
                setContacts(data.data);
            }
        }).catch(function (err) {
            var response = err.response
            if (response.status===403) {
                dispatch(setSession({ session_id: "", auth: "N" }));
                deleteSessionAuth()
                navigate("/login");
            }
        })
    }
    
    function getChatState() {
        return chat;
    }

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        getContacts();
        socket.connect();
    }, []);
    /* eslint-disable react-hooks/exhaustive-deps */

    socket.on("connect_error", (err) => {
        if (err.message === "unauthorized") {
            dispatch(setSession({ session_id: "", auth: "N" }));
            deleteSessionAuth()
            navigate("/login");
        }
    });

    socket.on("p2p", (data, cb) => {
        var { from, message, to } = data;
        var chat_msg = {
            from,
            message,
            to
        };
        var chat = getChatState();
        if (chat["username"] === from) {
            var message_up = [...chat["message"], chat_msg];
            setChat({ ...chat, message: message_up });
            cb({ status: 'success',  seen: "Y"});
        }
    });

    function sendChat(msg) {
        socket.emit("p2p", {
            message: msg,
            to: chat.username,
        });
        
        var chat_msg = {
            from : auth.username,
            message: msg,
            to: chat.username,
        };

        var message_up = [...chat["message"], chat_msg];
        setChat({ ...chat, message: message_up });
    }

    function logoutSocket() {
        socket.emit("logout");
    }

    return (
        <Base logoutSocket={ logoutSocket }>
            <div className="container">
                <AddContact contacts={contacts} setContacts={setContacts} />
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                    <Contacts contacts={contacts} setContacts={setContacts} setChat={setChat} />
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-6">
                        <Chat chat={chat} setChat={setChat} sendChat={sendChat} />
                    </div>
                </div>
            </div>
            <ContactModal contacts={contacts} setContacts={setContacts} setChat={setChat} />
        </Base>
    );
}

export default ChartArea;