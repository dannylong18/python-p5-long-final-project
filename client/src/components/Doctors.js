import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import './doctorcard.css'

function Doctors() {

    const [doctors, setDoctors] = useState([])
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        fetch("/doctors")
        .then((r) => r.json())
        .then(data => {setDoctors(data)})
    }, []);

    const handleShowReviews = (doctorId) => {
        if (doctorId === selectedDoctorId) {
            setSelectedDoctorId(null);
        } else {
            fetch(`/reviews/${doctorId}`)
            .then((r) => r.json())
            .then (data => {
                setReviews(prevReviews => ({
                    ...prevReviews, 
                    [doctorId]: data
                }));
                setSelectedDoctorId(doctorId)
            })
        }
    };

    
    return(
        <div>
            <h2>Doctors</h2>
            <ul className="item-grid">
            {doctors.map(doc => (
                <li key={doc.id}>
                    <DoctorCard 
                        id={doc.id}
                        name={doc.name}
                        specialty={doc.specialty}
                        bio={doc.bio}
                        reviews={reviews[doc.id] || []}
                        isSelected={selectedDoctorId === doc.id}
                        onShowReviews={() => handleShowReviews(doc.id)}
                    />
                </li>
            ))}
            </ul>
        </div>
    )
}

export default Doctors;