import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import fetchData from "../helpers/fetchData";
import { ThemeContext } from "./ThemeContext";
import { formatPhoneNumber } from "../helpers/formatPhoneNumber";
import SuccessMessage from "./SuccessMessage";

function UserGrid({ countries }) {
    const [userGrid, setUserGrid] = useState();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        fetchData().then(data => {
            setUserGrid(data);
        })
    }, []);

    const handleUpdateUserData = async (values) => {

        try {
            const { password, ...updatedData } = values;

            const response = await fetch(`http://localhost:3004/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error(`Error:${response.status}`);
            }
            const updatedUsers = userGrid.map((user) =>
                user.id === selectedUser.id ? { ...user, ...updatedData } : user
            );
            setUserGrid(updatedUsers);
            setSelectedUser(null);
            setIsFormSubmitted(true);
        } catch (error) {
            console.log(error, 'Error');
        }
    };

    const handleDeleteUserData = async () => {
        try {
            const response = await fetch(`http://localhost:3004/users/${selectedUser.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error:${response.status}`);
            }

            const updatedUsers = userGrid.filter((user) => user.id !== selectedUser.id);
            setUserGrid(updatedUsers);
            setSelectedUser(null);
            setIsFormSubmitted(true);
        } catch (error) {
            console.log(error, "Error");
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
        email: Yup.string().email('Invalid email').required('Email is required'),
        tel: Yup.string()
            .matches(/^(\+?[0-9]{1,3}\s?)?(\d{3}\s?){1,5}\d{1,3}$/, 'Invalid phone number')
            .required('Phone number is required'),
        country: Yup.string().required('Country is required'),
    })

    return (
        <div className={`form ${theme}`}>
            <h1>User Grid</h1>
            <div className="grid-users-card">
                {userGrid ? userGrid.map(item => (
                    <div
                        key={item.id}
                        onClick={() => { setSelectedUser(item); setIsFormOpen(true) }}
                        className={selectedUser && selectedUser.id === item.id
                            ? `user-card ${theme} active-card` : `user-card ${theme}`}>
                        <h4>Full Name: {item.firstName} {item.lastName}</h4>
                        <p>Username: {item.userName}</p>
                        <p>Email: {item.email}</p>
                        <p>Phone: {item.tel}</p>
                        <p>Country: {item.country}</p>
                    </div>
                )) : null}
                {selectedUser && isFormOpen && (
                    <>
                        <div className="overlay" onClick={() => setIsFormOpen(false)}></div>
                        <Formik
                            initialValues={selectedUser}
                            validationSchema={validateSchema}
                            onSubmit={handleUpdateUserData}>
                            <Form className={`form ${theme} update-form`}>
                                <button
                                    type="button"
                                    className={`close-btn ${theme}`}
                                    onClick={() => setIsFormOpen(false)}>
                                    &#10005;
                                </button>
                                <h1>Update Form</h1>
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
                                        disabled
                                    />
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
                                    <Field
                                        autoComplete="current-password"
                                        id="password"
                                        name="password"
                                        type="password"
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Phone number<sup>*</sup></label>
                                    <Field
                                        autoComplete="tel"
                                        id="tel"
                                        name="tel"
                                        type="tel"
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
                                        <option value="">Country</option>
                                        {countries ? countries.map(item => (
                                            <option key={item.code} value={item.code}>{item.name}</option>
                                        )) : null}
                                    </Field>
                                    <ErrorMessage component="div" className="error" name="country" />
                                </div>
                                <button type="submit" className={`btn ${theme}`}>Update User</button>
                                <button type="button" onClick={handleDeleteUserData} className={`btn delete-btn ${theme}`}>Delete User</button>

                                {isFormSubmitted && <div className="form-error" onClose={isFormSubmitted}>Please fill in all required fields!</div>}
                            </Form>
                        </Formik>
                    </>
                )}
            </div>
            {isFormSubmitted && (
                <div className={`form ${theme} update-form`} >
                    <SuccessMessage />
                </div>)
            }
        </div>
    )
}

export default UserGrid;