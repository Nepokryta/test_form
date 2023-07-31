import React, { useContext, useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { ThemeContext } from "./ThemeContext";
import { formatPhoneNumber } from "../helpers/formatPhoneNumber";
import ShowPasswordBtn from "./ShowPasswordBtn";
import SuccessMessage from "./SuccessMessage";

function RegistrationPage({ countries }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const theme = useContext(ThemeContext);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (values, { resetForm }) => {
        const id = uuidv4();
        try {
            const newData = { id, ...values };

            const newResponse = await fetch('http://localhost:3004/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            if (!newResponse.ok) {
                throw new Error(`Error:${newResponse.status}`);
            }
            setIsFormSubmitted(true);
            resetForm();
        } catch (error) {
            console.log(error, 'Error');
        }

    };

    useEffect(() => {
        const resetSuccessMessage = () => {
            if (isFormSubmitted) {
                setTimeout(() => {
                    setIsFormSubmitted(false);
                }, 2000);
            }
        };
        resetSuccessMessage();
    }, [isFormSubmitted]);

    const validateSchema = Yup.object({
        firstName: Yup.string()
            .required('First name is required'),
        lastName: Yup.string()
            .required('Last name is required'),
        userName: Yup.string()
            .required('Username is required'),
        email: Yup.string()
            .email('Invalid email').required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
                'At least 8 characters including at least 1 capital letter, 1 symbol, and 1 number')
            .required('Password is required'),
        tel: Yup.string()
            .matches(/^(\+?[0-9]{1,3}\s?)?(\d{3}\s?){1,5}\d{1,3}$/, 'Invalid phone number')
            .required('Phone number is required'),
        country: Yup.string().required('Country is required'),
    })

    return (
        <>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    userName: '',
                    email: '',
                    password: '',
                    tel: '',
                    country: '',
                }}
                validationSchema={validateSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <>
                        {!isFormSubmitted ?
                            <Form className={`form ${theme}`}>
                                <h1>Registration Form</h1>
                                <div className="form-group">
                                    <label htmlFor="firstName">First name<sup>*</sup></label>
                                    <Field
                                        autoComplete="given-name"
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                    />
                                    <ErrorMessage component="div" className="error" name="firstName" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last name<sup>*</sup></label>
                                    <Field
                                        autoComplete="family-name"
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                    />
                                    <ErrorMessage component="div" className="error" name="lastName" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="userName">Username<sup>*</sup></label>
                                    <Field
                                        autoComplete="Username"
                                        id="userName"
                                        name="userName"
                                        type="text"
                                    />
                                    <ErrorMessage component="div" className="error" name="userName" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email<sup>*</sup></label>
                                    <Field
                                        autoComplete='email'
                                        id="email"
                                        name="email"
                                        type="email"
                                    />
                                    <ErrorMessage component="div" className="error" name="email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password<sup>*</sup></label>
                                    <div className="password">
                                        <Field
                                            autoComplete="current-password"
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                        />
                                        <ShowPasswordBtn handleTogglePassword={handleTogglePassword} showPassword={showPassword} />
                                    </div>
                                    <ErrorMessage component="div" className="error" name="password" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tel">Phone number<sup>*</sup></label>
                                    <Field
                                        autoComplete="tel"
                                        id="tel"
                                        name="tel"
                                        type="text"
                                        onInput={(event) => {
                                            event.target.value = formatPhoneNumber(event.target.value);
                                        }}
                                    />
                                    <ErrorMessage component="div" className="error" name="tel" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country<sup>*</sup></label>
                                    <Field
                                        autoComplete="country"
                                        id="country"
                                        name="country"
                                        as="select">
                                        <option value="" defaultValue>--- Choose the country ---</option>
                                        {countries ? countries.map(item => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        )) : null}
                                    </Field>
                                    <ErrorMessage component="div" className="error" name="country" />
                                </div>

                                <button type="submit" className={`btn ${theme}`}>Register User</button>

                                {formikProps.isValid === false && formikProps.submitCount !== 0
                                    ? <div className="form-error"><sup>*</sup>Please fill in all required fields!</div>
                                    : null}
                            </Form>

                            : <Form className={`form ${theme}`} >
                                <SuccessMessage />
                            </Form>
                        }
                    </>
                )}
            </Formik>
        </>
    )
}

export default RegistrationPage;