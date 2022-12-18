import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setSession, authState } from "../../features/authSlice";
import { deleteSessionAuth } from '../../utils/session';
import avatar from '../../images/avatar.jpg';

function Contacts({ contacts, setContacts, setChat, handleClick }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(authState);

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