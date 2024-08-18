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

  useEffect(() => {
    fetch("/doctors")
      .then((r) => r.json())
      .then(data => setDoctors(data));
  }, []);

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

  return (
    <div>
      <NavBar />
      <div>
        <Switch>
          <Route exact path='/'><Home /></Route>
          <Route exact path='/doctors'>
            <Doctors
              reviews={reviews}
              handleShowReviews={handleShowReviews}
              selectedDoctorId={selectedDoctorId}
              doctors={doctors}
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
