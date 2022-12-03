import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import joi from 'joi-browser';

import { setSession } from '../../features/authSlice';
import { setSessionAuth } from '../../utils/session';
import "./login.css";


function Login(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState("");
    const [error_msg, setError_msg] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
        change: 0,
        validation: 0
    });

    const schema = {
        email: joi.string().email().required().label('Email'),
        password: joi.string().required().min(8).max(30).label("Password")
    };

    function validateField(event) {
        var { name, value } = event.target;
        var obj = { [name]: value };
        var schema_1 = { [name]: schema[name] };
        const { error } = joi.validate(obj, schema_1, { abortEarly: false });
        var errors_data = { ...errors };
        var new_err = {};
        if (error) {
            for (var err of error.details) {
                let name = err.path[0];
                let message = err.message;
                new_err[name] = message;
            }
        }

        for (var key in obj) {
            if (new_err[key] === undefined) {
                delete errors_data[key];
            } else {
                errors_data[key] = new_err[key];
            }
        }
        setErrors(errors_data);
    }

    function handleChange(event) {
        var { name, value } = event.target;
        var form_data = { ...form };
        form_data[name] = value;
        setForm(form_data);
        validateField(event);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const { error } = joi.validate(form, schema, { abortEarly: false });

        if (false) {
            var errors_data = { };
            for (var err of error.details) {
                let name = err.path[0];
                let message = err.message;
                errors_data[name] = message;
            }
            setErrors(errors_data);
            return false;
        } else {
            axios.post('/auth/login', form).then(function (response) {
                if (response.data.type === "success") {
                    var session_id = response.data.session_id;
                    var username = response.data.username;
                    dispatch(setSession({ session_id: session_id, auth: "Y", username: username }));
                    setSessionAuth({ session_id: session_id, auth: "Y", username: username });
                    navigate("/chat-area");
                }
            }).catch(function (error) {
                var response = error.response;
                var data = response.data;
                if (data.type === "error") {
                    if (data.errors !== undefined) {
                        setErrors(data.errors);
                        setError_msg("");
                    } else {
                        setError_msg(data.message);
                    }
                }
            });
        }
    }

    return (
        <main className="d-flex flex-column justify-content-center align-items-center mx-2 main">
            <h1 className="mb-4 text-primary">Chat Loop</h1>
            <div className="card" style={{ width: '100%', maxWidth: '27rem' }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Log in to Chat loop</h5>
                    {error_msg!=="" ? <div className="alert alert-danger p-1 text-center" style={{ fontSize: '0.9rem'}} role="alert">
                        {error_msg}
                    </div> : ""}
                    <form>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Email" name="email" onChange={handleChange} />
                        <div className={`form-text ${errors.email ? "" : "invisible"} errors_text text-danger`}>{ errors.email ? errors.email : "None" }</div>
                        <label htmlFor="password" className="form-label">password</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={handleChange} />
                        <div className={`form-text ${errors.password ? "" : "invisible"} errors_text text-danger`}>{ errors.password ? errors.password : "None" }</div>
                        <Link className="mb-2 text-center d-block" to="/register">create an account</Link>
                        <button type="submit" className="btn btn-primary d-block mx-auto" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Login;