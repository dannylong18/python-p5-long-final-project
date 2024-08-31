import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required to login')
});

function Login({setUser}) {

    const handleSubmit = (values, { resetForm }) => {
        fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values),
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.Error) {
                alert(`Error: ${data.Error}`);
            }
            else {
                alert('Login successful!');
                resetForm()
                setUser(() => data)
            }
        })
    }

    return (
        <div>
            <Formik 
                initialValues={{ username: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <div>
                            <label htmlFor="username">Username: </label>
                            <Field type="text" id="username" name="username" /> <button type="submit">Login</button>
                            <ErrorMessage name="username" component="div" />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login