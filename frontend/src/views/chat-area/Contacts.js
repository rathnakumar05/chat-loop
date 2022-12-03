import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setSession, authState } from "../../features/authSlice";
import { deleteSessionAuth } from '../../utils/session';
import avatar from '../../images/avatar.jpg';

function Contacts({ contacts, setContacts, setChat }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(authState);

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
            var response = err.response;
            if (response.status === 403) {
                dispatch(setSession({ session_id: "", auth: "N" }));
                deleteSessionAuth()
                navigate("/login");
            }
        });
    }

    const list = contacts.map((el, index) => (
        <li className="list-group-item bg-transparent pointer" key={index} onClick={() => handleClick({username: el.username})} >
            <div className="d-flex align-items-start">
                <img src={avatar} alt="" width="62" height="62" className="rounded-circle me-2" />
                <div className="mx-2">
                    <h4 className="avatar_name text-truncate">{el.username}</h4>
                    {/* <p className="avatar_content text-truncate">{el.last_msg}</p> */}
                </div>
                {/* <div className="ms-auto me-2">
                    <p>{el.last_seen}</p>
                </div> */}
            </div>
        </li>
    ));
    return (
        <div className="card overflow-auto scroll scroll-max-70vh">
            <ul className="list-group list-group-flush">
                {list}
            </ul>
        </div>
    );
}

export default Contacts;