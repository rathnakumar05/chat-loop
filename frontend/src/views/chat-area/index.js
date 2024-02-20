import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.min";
import pc_config from "./config";
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
    const modal_ref = useRef();
    const channel = useRef(false);
    const initiate = useRef(false);
    const start = useRef(false);
    const pc = useRef(undefined);
    const local = useRef();
    const remote = useRef();
    const local_stream = useRef(undefined);
    const remote_stream = useRef(undefined);

    const URL = "http://localhost:3000/";
    /* eslint-disable no-unused-vars */
    const [socket, setSocket] = useState(io(URL, { autoConnect: false }));
    /* eslint-disable no-unused-vars */
    const [contacts, setContacts] = useState([]);
    const [chat, setChat] = useState({
        username: "",
        message: [],
        show: false,
    });
    const chat_username = useRef("");

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
        local.current.defaultMuted = true;
        local.current.muted = true;
        getContacts();
        listen();
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
            chat_username.current = chat["username"];
            setChat({ ...chat, message: message_up });
            cb({ status: 'success',  seen: "Y"});
        }
    });

    function listen() {
    
        socket.on("webrtc_request", (data, cb) => {
            handleClick({ username: data.from, show_modal: true });
            cb({ status: 'success' });
        });

        socket.on("webrtc_accept", (data, cb) => {
            if (data.status === "success") {
                channel.current = true;
            }
            cb({ status: 'success' });
        });

        socket.on("webrtc", (data) => {
            if (data.type === 'media') {
                console.log("HHHHHHHHHHHHH");
              channel.current = true;
              startConn();
            } else if (data.type === 'offer') {
                console.log("offer");
                if (!initiate.current && !start.current) {
                    console.log("wddwdd");
                startConn("ooo");
              }
              pc.current.setRemoteDescription(new RTCSessionDescription(data));
              answer();
            } else if (data.type === 'answer' && start.current) {
                console.log("answer");
              pc.current.setRemoteDescription(new RTCSessionDescription(data));
            } else if (data.type === 'candidate' && start.current) {
                console.log("candidate");
              var candidate = new RTCIceCandidate({
                sdpMLineIndex: data.label,
                candidate: data.candidate
              });
              pc.current.addIceCandidate(candidate);
            } 
        });
    }

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
        chat_username.current = chat["username"];
        setChat({ ...chat, message: message_up });
    }

    function webrtcRequest() {
        socket.emit("webrtc_request", {
            data: {say: "Hello!"},
            to: chat_username.current,
        });
    }

    function sendWebrtc(data) {
        socket.emit("webrtc", {
            data: data,
            to: chat_username.current,
        });
    }

    function logoutSocket() {
        socket.emit("logout");
    }


    const showModal = (init) => { 
        const bsModal = new bootstrap.Modal(modal_ref.current, {
            backdrop: 'static',
            keyboard: false
        })
        bsModal.show();

        if (init !== null) {
            console.log("dddddd");
            initiate.current = true;
            webrtcRequest();
        } else if (init===null) {
            channel.current = true;
        }

        
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        .then(function (stream) {
            local_stream.current = stream;
            local.current.srcObject = stream;
            console.log("calling media");
            sendWebrtc({ type: 'media' });
            if (init !== null) {
                startConn();
            }
        })
        .catch(function(e) {
          alert('getUserMedia() error: ' + e.name);
        });
    }

    function startConn(kk = null) {
        console.log(kk !== null ? "xwdd" : "");
        if (!start.current && typeof local_stream.current !== 'undefined' && channel.current) {
            console.log(kk !== null ? "xwdd2" : "");
            createPeerConn();
            pc.current.addStream(local_stream.current);
            start.current = true;
            if (initiate.current) {
                console.log("calling offer");
               offer();
            }
        }
    }

    function createPeerConn() {
        try {
          pc.current = (new RTCPeerConnection(pc_config));
          pc.current.onicecandidate = handleIceCandidate;
          pc.current.onaddstream = handleRemoteStreamAdded;
          pc.current.onremovestream = handleRemoteStreamRemoved;
          console.log('Created RTCPeerConnnection');
        } catch (e) {
          console.log('Failed to create PeerConnection, exception: ' + e.message);
          alert('Cannot create RTCPeerConnection object.');
          return;
        }
    }
    
    function handleIceCandidate(event) {
        if (event.candidate) {
            console.log("Hello");
            sendWebrtc({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
          console.log('End of candidates.'+chat);
        }
    }

    function handleRemoteStreamAdded(event) {
        console.log(event);
        console.log('Remote stream added.');
        remote_stream.current = event.stream;
        remote.current.srcObject = event.stream;
    }

    function handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }

    function offer() {
        pc.current.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    function setLocalAndSendMessage(sessionDescription) {
        pc.current.setLocalDescription(sessionDescription);
        sendWebrtc(sessionDescription);
    }

    function handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
    }

    function answer() {
        pc.current.createAnswer().then(
          setLocalAndSendMessage,
          onCreateSessionDescriptionError
        );
    }

    function onCreateSessionDescriptionError(error) {
        console.log(error);
    }


    function handleClick(data) {
        var username = data.username;
        var show_modal = data.show_modal !== undefined && data.show_modal === true ? true : false;
        axios.post("/message/get", {
            p1: auth.username,
            p2: data.username
        }).then(function (res) {
            if (res.data.type === "success") {
                var message = res.data.data;
                chat_username.current = username;
                setChat({
                    username: username,
                    message: message,
                    show: true
                });
                if (show_modal === true) {
                    showModal(null);
                    socket.emit("webrtc_accept", {
                        data: { status: "success" },
                        to: username,
                    });
                }
            }
        }).catch(function (err) {
            var response = err.response;
            if (response.status === 403) {
                dispatch(setSession({ session_id: "", auth: "N" }));
                deleteSessionAuth()
                navigate("/login");
            }
        });
    }

    const hideModal = () => {
        pc.current.close();
        pc.current = null;
        const bsModal= bootstrap.Modal.getInstance(modal_ref.current)
        bsModal.hide();
    }

    return (
        <Base logoutSocket={ logoutSocket }>
            <div className="container">
                <AddContact contacts={contacts} setContacts={setContacts} />
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-6 my-2">
                    <Contacts contacts={contacts} setContacts={setContacts} setChat={setChat} handleClick={handleClick} />
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-6 my-2">
                        <Chat chat={chat} setChat={setChat} sendChat={sendChat} modal_ref={modal_ref} showModal={showModal} hideModal={hideModal} initiate={initiate} pc={pc} local={local} remote={remote} />
                    </div>
                </div>
            </div>
            <ContactModal contacts={contacts} setContacts={setContacts} setChat={setChat} />
        </Base>
    );
}

export default ChartArea;