import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import './navbar.css'
 

function Home() {
    // {user, setUser}
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const toggleForm = () => {
        setIsLoggedIn(!isLoggedIn)
    }

    return(
        <div>
            <h1>
            Welcome to <span style={{ color: '#e57373' }}>Concierge MD</span>
            </h1>
            <h3>
            We provide concierge services for doctors who want to expand care for their patients. 
            </h3>
            <br />
            <h3>
            Check out our available doctors and read their reviews!
            </h3>
            {isLoggedIn ? <Login /> : <Signup />}
            <button className="hometogglebtn" onClick={toggleForm}>
            {isLoggedIn ? "Don't have a username? Click here to Signup" : "Go to Login"}
            </button>
        </div>
    );
}

export default Home;