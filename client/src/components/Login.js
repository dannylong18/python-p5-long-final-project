import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required to login')
});

function Login() {

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
                            <Field type="text" id="username" name="username" />
                            <ErrorMessage name="username" component="div" />
                        </div>
                        <br />
                        <button type="submit">Login</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login