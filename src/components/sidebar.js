import React from "react";
import { Link } from "react-router-dom";
import constants from "../constants";

const logout = (data) => {
    alert("Logout called");
    console.log(data);
    debugger;
    sessionStorage.removeItem(constants.sessionStorageUserDetails)
}

const SideBar = (props) => (
    <div className="sideBarCss">
        <div className="sidebar">
            <Link to="/notes">Notes</Link>
            <Link to="/archived">Archive</Link>
            <Link to="/deleted">Trash</Link>
            <Link to="/login" onClick={() => logout()}>Logout</Link>
        </div>
    </div>
)

export default SideBar;