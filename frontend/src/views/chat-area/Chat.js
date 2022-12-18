import { useState } from "react";
import { useSelector } from "react-redux";
import { authState } from "../../features/authSlice";


import ScrollTo from "../../components/ScrollTo";
import VideoChat from "./VideoChat";
    
import avatar from '../../images/avatar.jpg';

function Chat({ chat, setChat, sendChat, modal_ref, showModal, hideModal, pc, local, remote }) {
    const [msg, setMsg] = useState("");
    const auth = useSelector(authState);

    var message = chat.message.map(function (el, index) {
        return (<div className={`d-flex mb-2 ${auth.username === el.from ? "flex-row-reverse" : ""}`} key={index}>
            <div className="card chat_msg" >
                <div className="card-body p-2">
                    {el.message}
                </div>
            </div>
            { (index === chat.message.length-1) ? <ScrollTo /> : '' }
        </div>);
    });
    function handleInput(e) {
        setMsg(e.currentTarget.textContent);
    }
    function handleSend() {
        if (msg !== "") {
            sendChat(msg);
            setMsg("");
            const el = document.getElementById('content_edit');
            el.innerHTML = "";
        }
    }
    return (
        <>
        <div className={`card scroll-max-70vh ${chat.show===false ? 'd-none' : ''}`}>
            <div className="card-header bg-transparent p-1">
                <div className="d-flex align-items-center">
                    <img src={avatar} alt="" width="42" height="42" className="rounded-circle me-2" />
                    <div className="mx-2">
                        <h5 className="avatar_name_header text-truncate mb-0">{ chat.username }</h5>
                        <p className="mb-1 fs-6 fw-lighter">last seen 12 minutes ago</p>
                    </div>
                </div>
            </div>
            <div className="card-body scroll-55vh overflow-auto scroll">
            {message}
            </div>
            <div className="card-footer bg-transparent d-flex align-items-end">
                    <button className="btn border-0 fs-4 p-1 me-2 ms-auto" onClick={ () => showModal(true) } ><i className="bi bi-camera-video-fill"></i></button>
                <div className="input-group chat_area">
                    <div id="content_edit" className="form-control focus-none p-2 fs-6 me-3 chat_area_inner overflow-auto scroll" contentEditable="true" onInput={(e) => handleInput(e)}></div>
                </div>
                <button className="btn border-0 send_btn fs-4 p-1 me-2 ms-auto" onClick={handleSend} ><i className="bi bi-send-fill"></i></button>
            </div>
        </div>
        <VideoChat modal_ref={modal_ref} hideModal={hideModal} local={local} remote={remote} pc={pc} />
        </>
    );
}

export default Chat;