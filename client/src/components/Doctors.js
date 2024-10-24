import DoctorCard from "./DoctorCard";
import CreateDoctor from "./CreateDoctor";
import './doctorcard.css'
import { useContext } from "react";
import { AppContext } from "./AppContext";

function Doctors() {
//Original Props: {reviews, setReviews, selectedDoctorId, doctors, setDoctors, user, handleShowReviews}
    const {user, doctors, reviews, selectedDoctorId, handleShowReviews} = useContext(AppContext)
  
    const displayDoctors = () => {
    return doctors.map(doc => (
      <li key={doc.id}>
        <DoctorCard 
          id={doc.id}
          name={doc.name}
          specialty={doc.specialty}
          bio={doc.bio}
          reviews={reviews[doc.id] || []}
          // setReviews={setReviews}
          isSelected={selectedDoctorId === doc.id}
          onShowReviews={() => handleShowReviews(doc.id)}
          // user={user}
        />
      </li>
    ));
  };

  return (
    <>
      <h2 style={{textAlign: "center", color: '#e57373'}}>Doctors</h2>
      <ul className="item-grid">
        {displayDoctors()}
      </ul>
      {user && <CreateDoctor 
      // setDoctors={setDoctors} 
      // user={user} 
      />}
    </>
  );
}

export default Doctors;
