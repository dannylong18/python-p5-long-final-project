import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    specialty: Yup.string(),
    bio: Yup.string()
});

function CreateDoctor ({ setDoctors, user}) {

    if (!user) {
        return <p>User must be logged in to add a new doctor.</p>
    }

    const handleSubmit = (values, {resetForm}) => {
        fetch('/createdoctor', {
            method: 'POST', 
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(r => {
            if (!r.ok){
                throw new Error('Network response was not ok');
            }
            return r.json()
        })
        .then(data => {
            alert('Doctor added successfully!');
            setDoctors(prevDoctors => [...prevDoctors, data]);
        })
        .catch(error => {
            console.error('Error adding doctor:', error);
            alert('Failed to add doctor.')
        });
    }

    return (
        <div>
            <h3>Don't see your doctor? Add a New Doctor</h3>
            <Formik
            initialValues={{ name: '', specialty: '', bio: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            >
            {() => (
            <Form>
                <div>
                <label htmlFor="name">Name: </label>
                <Field name="name" type="text" />
                <ErrorMessage name="name" component="div" />
                </div>
                <br />
                <div>
                <label htmlFor="specialty">Specialty: </label>
                <Field name="specialty" type="text" />
                <ErrorMessage name="specialty" component="div" />
                </div>
                <br />
                <div>
                <label htmlFor="bio">Bio: </label>
                <Field as="textarea" name="bio" />
                <ErrorMessage name="bio" component="div" />
                </div>
                <br />
                <button type="submit">Add Doctor</button>
            </Form>
            )}
            </Formik>
        </div>
    )
}

export default CreateDoctor;