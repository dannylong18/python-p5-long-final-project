import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './navbar.css'

const NavBar = () => {
    return (
        <nav className="navbar">
            <Link to='/'>Homepage</Link>
            <Link to='/doctors'>Doctors</Link>
            <Link to='/createreview'>Leave Review</Link>
        </nav>
    )
}

export default NavBar