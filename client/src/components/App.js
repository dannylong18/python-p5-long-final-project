// import { useState, useEffect } from "react";
// import React, {useContext} from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Doctors from "./Doctors";
import CreateReview from "./CreateReview";
import Payment from "./Payment";
import NavBar from "./NavBar";
import SPayment from "./SPayment";
import FPayment from "./FPayment.js";
// import { AppContext } from "./AppContext";

function App() {
  

  return (
    <>
      <NavBar 
      // onLogout={onLogout}
      // user={user}
      />
      <>
        <Switch>
          <Route exact path='/'>
          <Home />
          </Route>

          <Route exact path='/home'>
            <Home 
              // user={user}
              // setUser={setUser}
            />
          </Route>
        
          <Route exact path='/doctors'>
            <Doctors
              // reviews={reviews}
              // setReviews={setReviews}
              // handleShowReviews={handleShowReviews}
              // selectedDoctorId={selectedDoctorId}
              // setDoctors={setDoctors}
              // doctors={doctors}
              // user={user}
            />
          </Route>

          <Route exact path='/createreview'>
            <CreateReview 
            //doctors={doctors} 
            //setDoctors={setDoctors} 
            />
          </Route>

          <Route exact path='/payment'>
          <Payment />
          </Route>

          <Route exact path='/payment_success'>
          <SPayment />
          </Route>

          <Route exact path='/payment_fail'>
          <FPayment />
          </Route>

        </Switch>
      </>
    </>
  );
}

export default App;


// const {
  //   // reviews,
  //   // setReviews,
  //   // selectedDoctorId,
  //   // setSelectedDoctorId,
  //   // doctors,
  //   // setDoctors,
  //   // user,
  //   // setUser,
  // } = useContext(AppContext);

  // const [reviews, setReviews] = useState({});
  // const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  // const [doctors, setDoctors] = useState([]);
  // const [user, setUser] = useState(null);
  

  // useEffect(() => {
  //   fetch("/doctors")
  //     .then((r) => r.json())
  //     .then(data => setDoctors(data));
  // }, []);

  // useEffect(() => {
  //   fetch('/checksession').then((r) => {
  //     if(r.ok){
  //       r.json().then((currentUser) =>
  //       setUser(() => currentUser));
  //   }
  // })}, [])

  // const handleShowReviews = (doctorId) => {
  //   if (doctorId === selectedDoctorId) {
  //     setSelectedDoctorId(null);
  //   } else {
  //     fetch(`/reviews/${doctorId}`)
  //       .then((r) => r.json())
  //       .then(data => {
  //         setReviews(prevReviews => ({
  //           ...prevReviews,
  //           [doctorId]: data
  //         }));
  //         setSelectedDoctorId(doctorId);
  //       });
  //   }
  // };


  // const onLogout = () => {
  //   fetch('/logout', {
  //     method: 'DELETE'
  //   })
  //   .then((r) => {if(r.ok) {
  //     setUser(() => null)
  //     alert('User Logged Out.')
  //   }})
  // }