import './doctorcard.css';

function DoctorCard({ id, name, specialty, bio, reviews, isSelected, onShowReviews }) {
  return (
    <div className={`doctor-card ${isSelected ? 'expanded' : ''}`}>
      <h3>{name}</h3>
      <p>{specialty}</p>
      <p>{bio}</p>
      <button onClick={onShowReviews}>
        {isSelected ? 'Hide Reviews' : 'Show Reviews'}
      </button>
      {isSelected && (
        <div className="reviews">
          {reviews.length > 0 ? (
            <ol>
              {reviews.map(review => (
                <li key={review.id}> 
                  <p>Rating: {review.rating}/5</p>
                  <p className='review-comment'>{review.comment}</p>
                  <p className='review-timestamp'>Posted on: {review.time_created}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DoctorCard;
