import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

function Home() {

    const [showLogin, setShowLogin] = useState(true)

    const toggleForm = () => {
        setShowLogin(!showLogin)
    }

    return(
        <div>
            <h1>
            Welcome to Concierge MD!
            </h1>
            <h3>
            We provide concierge services for doctors who want to expand care for their patients. 
            </h3>
            <h3>
            Check out our available doctors and Login/Signup to leave a review!
            </h3>
            {showLogin ? <Login /> : <Signup />}

            <br />
            <button onClick={toggleForm}>
                {showLogin ? "Don't have a username? Click here to Signup" : "Go to Login"}
            </button>

        </div>
    )
}

export default Home;