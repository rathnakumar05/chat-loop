import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setSession, authState } from "../../features/authSlice";
import { deleteSessionAuth } from '../../utils/session';

function ContactModal({ contacts, setContacts, setChat }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(authState);
    const [username, setUsername] = useState("");

    function handleClick(data) {
        var username = data.username;
        axios.post("/message/get", {
            p1: auth.username,
            p2: data.username
        }).then(function (res) {
            if (res.data.type === "success") {
                var message = res.data.data;
                setChat({
                    username: username,
                    message: message,
                    show: true
                });
            }
        }).catch(function (err) {
            
        });
        // myModal.show();
    }
    const contact_list = contacts.map(function (el, index) {
        return (
            <div className="btn rounded-0 d-flex align-items-center border-bottom p-2" key={index} onClick={() => handleClick({username: el.username})}>
                <img src="https://github.com/mdo.png" alt="" width="42" height="42" className="rounded-circle me-2" />
                <h6 className="ms-2">{el.username}</h6>
            </div>
        );
    });
    function handleAdd() {
        axios.post("/contact/add", { username: username }).then(function (response) {
            if (response.data.type==="success") {
                setContacts([...contacts, { username: username }]);
            }
        }).catch(function (err) {
            var response = err.response;
            if (response.status === 403) {
                dispatch(setSession({ session_id: "", auth: "N" }));
                deleteSessionAuth()
                navigate("/login");
            }
            console.log(response);
        });
    }
    function handleChange(event) {
        setUsername(event.target.value);
    }

    return (
        <div className="modal fade right" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Contacts</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0">
                        {contact_list}
                    </div>
                    <div className="modal-footer">
                        <div className="input-group mb-3">
                            <span className="input-group-text" >@</span>
                            <input type="text" className="form-control" name="username" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={username} onChange={handleChange} />
                        </div>
                        <button type="button" className="btn btn-secondary rounded-pill" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary rounded-pill" onClick={ handleAdd }>ADD</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactModal;