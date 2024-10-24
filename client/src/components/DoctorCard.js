import React, { useState } from 'react';
import './doctorcard.css';
import { useContext } from 'react';
import { AppContext } from './AppContext';

function DoctorCard({ id, name, specialty, bio, reviews, isSelected, onShowReviews }) {
  //Revised Props: { id, name, specialty, bio, reviews, isSelected, onShowReviews }
  //Original Props: {setReviews, user, id, name, specialty, bio, reviews, isSelected, onShowReviews}

  const {setReviews, user} = useContext(AppContext)

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);

  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleUpdate = () => {
    fetch(`/reviews/${editingReviewId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment: editComment, rating: editRating }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Update failed');
        return response.json();
      })
      .then(updatedReview => {
        alert('Review updated successfully!');
        setReviews(prevReviews => {
          if (!prevReviews[id] || !Array.isArray(prevReviews[id])) {
            console.error('Reviews for this doctor is not an array');
            return prevReviews;
          }
          return {
            ...prevReviews,
            [id]: prevReviews[id].map(review =>
              review.id === editingReviewId ? updatedReview : review
            )
          };
        });
        setEditingReviewId(null);
        setEditComment('');
        setEditRating(0);
      })
      .catch(error => {
        console.error('Error updating review:', error);
        alert('Failed to update review. Comments must be less than 50 characters and rating cannot exceed 5.');
      });
  };

  const handleDelete = (reviewId) => {
    fetch(`/reviews/${reviewId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) throw new Error('Delete failed');
        return response.json();
      })
      .then(() => {
        alert('Review deleted successfully!');
        setReviews(prevReviews => {
          if (!prevReviews[id] || !Array.isArray(prevReviews[id])) {
            console.error('Reviews for this doctor is not an array');
            return prevReviews;
          }
          return {
            ...prevReviews,
            [id]: prevReviews[id].filter(review => review.id !== reviewId)
          };
        });
      })
      .catch(error => {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      });
  };

  return (
    <section className={`doctor-card ${isSelected ? 'expanded' : ''}`}>
      <h3>{name}</h3>
      <p>{specialty}</p>
      <p>{bio}</p>
      <button onClick={onShowReviews}>
        {isSelected ? 'Hide Reviews' : 'Show Reviews'}
      </button>
      {isSelected && (
        <section className="reviews">
          {reviews.length > 0 ? (
            <ol>
              {reviews.map(review => (
                <li key={review.id}>
                  <p>Rating: {review.rating}/5</p>
                  {editingReviewId === review.id ? (
                    <>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <input
                        type="number"
                        value={editRating}
                        min="0"
                        max="5"
                        onChange={(e) => setEditRating(Number(e.target.value))}
                      />
                      <button onClick={handleUpdate}>Update</button>
                      <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <p className='review-comment'>{review.comment}</p>
                      <p className='review-timestamp'>Posted on: {review.time_created}</p>
                      {user && user.id === review.user_id && (
                        <>
                          <button onClick={() => handleEdit(review)}>Edit</button>
                          <button onClick={() => handleDelete(review.id)}>Delete</button>
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p>No reviews available.</p>
          )}
        </section>
      )}
    </section>
  );
}

export default DoctorCard;

