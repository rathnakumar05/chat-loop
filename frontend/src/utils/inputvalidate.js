var msg = {
    required: "This field is required",
}

function textValidate(props) {
    if (props.value === undefined) {
        return false;
    }
    if (props.required!==undefined && props.required===1 && props.value==="") {
        return [false, msg.required];
    }
}


option = {
    required: {
        required: true,
        message: "This is required",
    },
    regex: "/[0-9A-Za-z]/",
    
}