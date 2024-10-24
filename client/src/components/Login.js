import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useContext } from "react";
import { AppContext } from "./AppContext";

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required to login')
});

function Login() {
        //{setUser, user}

    const {setUser, divStyle, formStyle} = useContext(AppContext)

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
        <div style={divStyle}>
            <Formik 
                initialValues={{ username: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form style={formStyle}>
                        <div>
                            <label htmlFor="username">Username: </label>
                            <Field type="text" id="username" name="username" /> 
                            <br />
                            
                            <ErrorMessage name="username" component="div" />
                        </div>
                        <br />
                        <div>
                                <button type="submit">Login</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login