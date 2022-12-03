export const setSessionAuth = ({session_id, auth, username}) => {
    localStorage.setItem("session_id", session_id);
    localStorage.setItem("auth", auth);
    localStorage.setItem("username", username);
}

export const getSessionAuth = () => {
    var session = {
        session_id: localStorage.getItem("session_id"),
        auth: localStorage.getItem("auth"),
        username: localStorage.getItem("username"),
    }
    return session;
}

export const deleteSessionAuth = () => {
    localStorage.clear();
}