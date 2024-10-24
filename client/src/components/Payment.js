import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AppContext } from './AppContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Q84OoHti3OJEVYBXuInUEAMUVf3xrSHdXWQy2cLTaV27b5WH1nEC1o7fXkL3ngRk5ReiJvCjyk3uyuP6nTM58zw00fOaWuuFd');

const validationSchema = Yup.object({
    amount: Yup.number()
        .min(1, 'Amount must be at least $1')
        .required('Amount is required')
});

function Payment() {

    const { user, divStyle, formStyle } = useContext(AppContext);

    if (!user) {
        return <p>User must be logged in to make a payment.</p>;
    }

    const handleSubmit = (values, { resetForm }) => {
        const { amount } = values;
    
        fetch('/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(session => {
            return stripePromise.then(stripe => {
                return stripe.redirectToCheckout({ 
                    sessionId: session.session_id,
                });
            });
        })
        .then(result => {
            if (result.error) {
                console.error('Stripe Checkout error:', result.error);
                alert('Payment failed. Please try again.');
            } else {
                alert('Payment successful!');
                console.log('Stripe Checkout successful');
            }
    
            resetForm();
        })
        .catch(error => {
            console.error('Error creating Stripe Checkout session:', error);
            alert('Failed to create payment session.');
        });
    };

    return (
        <div style={divStyle}>
            <h3>Make a Payment</h3>
            <Formik
                initialValues={{ amount: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form style={formStyle}>
                        <div>
                            <label htmlFor="amount">Amount (USD): </label>
                            <Field name="amount" type="number" min="1" />
                            <ErrorMessage name="amount" component="div" />
                        </div>
                        <br />
                        <button type="submit">Pay with Stripe</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Payment;
