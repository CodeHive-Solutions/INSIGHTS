import React from "react";
import { useCookies } from "react-cookie";

function Example() {
    const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

    const handleButtonClick = () => {
        setCookie("cookie-name", "cookie-value", { path: "/" });
    };

    const handleRemoveButtonClick = () => {
        removeCookie("cookie-name");
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Set Cookie</button>
            <button onClick={handleRemoveButtonClick}>Remove Cookie</button>
            {cookies["cookie-name"] && <p>Cookie Value: {cookies["cookie-name"]}</p>}
        </div>
    );
}

export default Example;
