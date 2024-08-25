import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Doctors from "./Doctors";
import CreateReview from "./CreateReview";
import NavBar from "./NavBar";

function App() {
  const [reviews, setReviews] = useState({});
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/doctors")
      .then((r) => r.json())
      .then(data => setDoctors(data));
  }, []);

  useEffect(() => {
    fetch('/checksession').then((r) => {
      if(r.ok){
        r.json().then((currentUser) =>
        setUser(() => currentUser));
    }
  })}, [])

  const handleShowReviews = (doctorId) => {
    if (doctorId === selectedDoctorId) {
      setSelectedDoctorId(null);
    } else {
      fetch(`/reviews/${doctorId}`)
        .then((r) => r.json())
        .then(data => {
          setReviews(prevReviews => ({
            ...prevReviews,
            [doctorId]: data
          }));
          setSelectedDoctorId(doctorId);
        });
    }
  };

  const toggleForm = () => {
      setIsLoggedIn(!isLoggedIn)
  }

  const onLogout = () => {
    fetch('/logout', {
      method: 'DELETE'
    })
    .then((r) => {if(r.ok) {
      setUser(() => null)
      alert('User Logged Out.')
    }})
  }

  return (
    <div>
      <NavBar 
      onLogout={onLogout}
      user={user}
      />
      <div>
        <Switch>
          <Route exact path='/'>
            <Home 
              isLoggedIn={isLoggedIn}
              toggleForm={toggleForm}
              user={user}
              setUser={setUser}
            />
          </Route>
          <Route exact path='/doctors'>
            <Doctors
              reviews={reviews}
              setReviews={setReviews}
              handleShowReviews={handleShowReviews}
              selectedDoctorId={selectedDoctorId}
              doctors={doctors}
              user={user}
            />
          </Route>
          <Route exact path='/createreview'>
            <CreateReview doctors={doctors} setDoctors={setDoctors} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
