import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setSession } from "../../features/authSlice";
import { deleteSessionAuth } from '../../utils/session';

function AddContact({contacts, setContacts}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");

    function handleAdd() {
        axios.post("/contact/add", { username: username }).then(function (response) {
            if (response.data.type === "success") {
                setUsername("");
                setContacts([...contacts, { username: username }]);
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
    function handleChange(event) {
        setUsername(event.target.value);
    }

    return (
        <div className="row mb-3 align-items-center">
            <div className="col-lg-4 col-md-6 col-sm-6 align-self-start">
            <div className="input-group input-group-lg">
                <span className="input-group-text bg-transparent fs-3 rounded-pill-left"><i className="bi bi-person-plus-fill"></i></span>
                <input type="text" className="form-control border-start-0 rounded-pill-right focus-none" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" value={username} onChange={handleChange} />
            </div>
            </div>
            <div className="col-lg-8 col-md-6 col-sm-6 d-flex">
               <button type="button" className="btn btn-primary rounded-pill" onClick={handleAdd}>Add contact</button>     
            </div> 
        </div>
    );
}

export default AddContact;