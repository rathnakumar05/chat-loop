import { useEffect, useRef } from "react";
function ScrollTo(){
    const my_ref = useRef();
    useEffect(() => {
        my_ref.current.scrollIntoView();
    }, []);
    return <div ref={my_ref} />;
}

export default ScrollTo;