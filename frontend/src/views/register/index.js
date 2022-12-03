import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import joi from "joi-browser";

import "./register.css";

function Register() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [error_msg, setError_msg] = useState("");
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirm_password: ""
    });

    const schema = {
        email: joi.string().email().required().label('Email'),
        username: joi.string().regex(/^[a-zA-Z0-9_]*$/).min(3).max(30).required().label("Username").error(errors => { 
            errors.forEach(err => {
                if (err.type === 'string.regex.base') {
                    err.message = `"Username" must contains only alphanumeric and _,-`
                }
            })
            return errors;
        }),
        password: joi.string().required().min(8).max(30).label("Password"),
        confirm_password: joi.any().required().valid(joi.ref("password")).error(errors => { 
            errors.forEach(err => {
                if (err.type === "any.allowOnly") {
                    err.message = `"Confrim Password" and "Password" must be same`
                }
            });
            return errors;
        })
    };
    
    function validateField(event) {
        var { name, value } = event.target;
        var obj = { [name]: value };
        var schema_1 = { [name]: schema[name] };
        if (name === "confirm_password") {
            obj["password"] = form.password ? form.password : "";
            schema_1["password"] = schema["password"];
        } else if (name === "password") {
            obj["confirm_password"] = form.confirm_password ? form.confirm_password : "";
            schema_1["confirm_password"] = schema["confirm_password"];
        }
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

        if (error) {
            var errors_data = { };
            for (var err of error.details) {
                var name = err.path[0];
                var message = err.message;
                errors_data[name] = message;
            }
            setErrors(errors_data);
            return false;
        } else {
            axios.post('/auth/register', form).then(function (response) {
                if (response.data.type==="success") {
                    navigate("/login");
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
    return(
        <main className="d-flex flex-column justify-content-center align-items-center mx-2 main">
            <h1 className="mb-3 text-primary">Chat Loop</h1>
            <div className="card" style={{ width: '100%', maxWidth: '27rem' }}>
                <div className="card-body pb-2">
                    <h5 className="card-title text-center">Register on Chat loop</h5>
                    {error_msg!=="" ? <div className="alert alert-danger p-1 text-center" style={{ fontSize: '0.9rem'}} role="alert">
                        {error_msg}
                    </div> : ""}
                    <form>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                        <div className={`form-text ${errors.email ? "" : "invisible"} errors_text text-danger`}>{ errors.email ? errors.email : "None" }</div>
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                        <div className={`form-text ${errors.username ? "" : "invisible"} errors_text text-danger`}>{ errors.username ? errors.username : "None" }</div>
                        <label htmlFor="password" className="form-label">password</label>
                        <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
                        <div className={`form-text ${errors.password ? "" : "invisible"} errors_text text-danger`}>{ errors.password ? errors.password : "None" }</div>
                        <label htmlFor="confirm_password" className="form-label">comfirm password</label>
                        <input type="password" className="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" value={form.confirm_password} onChange={handleChange} />
                        <div className={`form-text ${errors.confirm_password ? "" : "invisible"} errors_text text-danger`}>{ errors.confirm_password ? errors.confirm_password : "None" }</div>
                        <Link className="mb-2 text-center d-block" to="/login">Already have an account ?</Link>
                        <button type="submit" className="btn btn-primary d-block mx-auto mb-1" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Register;