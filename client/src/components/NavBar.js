import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './navbar.css'

const NavBar = ({onLogout, user}) => {

    return (
        <div className="button-container">
            <nav className="navbar">
                <Link to='/'>Homepage</Link>
                <Link to='/doctors'>Doctors</Link>
                <Link to='/createreview'>Leave Review</Link>
            </nav>
            {user ? 
            (<button className="hometogglebtn" onClick={onLogout}>
            Logout
            </button>) : null}
        </div>
    )
}

export default NavBar