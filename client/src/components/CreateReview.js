import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    doctorId: Yup.number().positive().integer()
        .required('Doctor is required'),
    rating: Yup.number()
        .min(0, 'Rating must be between 0 and 5')
        .max(5, 'Rating must be between 0 and 5')
        .required('Rating is required'),
    comment: Yup.string()
        .max(50, 'Comment must be 50 characters or less')
        .required('Comment is required')
});

function CreateReview({doctors}) {
    
    const handleSubmit = (values, { resetForm }) => {
        const reviewData = {
            ...values,
            rating: Number(values.rating),
        };
        fetch('/createreview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Review submitted successfully!');
            resetForm();
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            alert('Failed to submit review.');
        });
    };

    return (
        <div>
            <h2>Create a Review</h2>
            <Formik
                initialValues={{ doctorId: '', rating: '', comment: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <div>
                            <label htmlFor="doctorId">Select Doctor: </label>
                            <Field as="select" name="doctorId">
                                <option value="">Select a doctor...</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="doctorId" component="div" />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="rating">Rating (0-5): </label>
                            <Field name="rating" type="number" min="0" max="5" />
                            <ErrorMessage name="rating" component="div" />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="comment">Comment: </label>
                            <Field as="textarea" name="comment" />
                            <ErrorMessage name="comment" component="div" />
                        </div>
                        <br />
                        <button type="submit">Submit Review</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default CreateReview;
