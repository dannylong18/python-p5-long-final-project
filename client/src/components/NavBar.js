import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './navbar.css'
import { useContext } from "react";
import { AppContext } from "./AppContext";

const NavBar = () => {
    // {onLogout, user}
    const {onLogout, user} = useContext(AppContext)

    return (
        <div className="button-container">
            <nav className="navbar">
                <Link to='/home'>Homepage</Link>
                <Link to='/doctors'>Doctors</Link>
                <Link to='/createreview'>Leave Review</Link>
                <Link to='/payment'>Make A Payment</Link>
            </nav>
            {user ? 
            (<button className="hometogglebtn" onClick={onLogout}>
            Logout
            </button>) : null}
        </div>
    )
}

export default NavBar