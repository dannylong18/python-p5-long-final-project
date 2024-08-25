import DoctorCard from "./DoctorCard";
import './doctorcard.css'

function Doctors({ reviews, handleShowReviews, selectedDoctorId, doctors, user, setReviews }) {
  
    const displayDoctors = () => {
    return doctors.map(doc => (
      <li key={doc.id}>
        <DoctorCard 
          id={doc.id}
          name={doc.name}
          specialty={doc.specialty}
          bio={doc.bio}
          reviews={reviews[doc.id] || []}
          setReviews={setReviews}
          isSelected={selectedDoctorId === doc.id}
          onShowReviews={() => handleShowReviews(doc.id)}
          user={user}
        />
      </li>
    ));
  };

  return (
    <div>
      <h2>Doctors</h2>
      <ul className="item-grid">
        {displayDoctors()}
      </ul>
    </div>
  );
}

export default Doctors;
