import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [reviews, setReviews] = useState({});
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [user, setUser] = useState(null);

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

    const onLogout = () => {
      fetch('/logout', {
        method: 'DELETE'
      })
      .then((r) => {if(r.ok) {
        setUser(() => null)
        alert('User Logged Out.')
      }})
    }

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

    const divStyle = {
      width: "100%",
      maxWidth: "400px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      margin: "20px auto",
    };

    const formStyle = {
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.05)",
        marginBottom: "15px",
    }

      return (
        <AppContext.Provider value={{
            reviews,
            setReviews,
            selectedDoctorId,
            setSelectedDoctorId,
            doctors,
            setDoctors,
            user,
            setUser, 
            onLogout,
            handleShowReviews,
            divStyle,
            formStyle
        }}>
            {children}
        </AppContext.Provider>
      );
};
