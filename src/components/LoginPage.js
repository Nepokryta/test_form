import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Formik, Field, Form } from "formik";
import * as Yup from 'yup';
import fetchData from "../helpers/fetchData";
import UserGrid from "./UserGrid";
import { ThemeContext } from "./ThemeContext";
import ShowPasswordBtn from "./ShowPasswordBtn";

function LoginPage({ countries }) {
    const [userGrid, setUserGrid] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showAllUsers, setAllUsers] = useState(false);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        fetchData().then(data => {
            setUserGrid(data);
        });
    }, []);

    const handleSubmit = (values) => {
        const foundUser = userGrid.find((user) => user.userName === values.userName && user.password === values.password);

        if (foundUser) {
            setAllUsers(true);
        } else {
            setShowError(true);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div>
                {!showAllUsers ? (
                    <Formik
                        initialValues={{
                            userName: '',
                            password: ''
                        }}
                        validationSchema={Yup.object({
                            userName: Yup.string()
                                .required('Username is required'),
                            password: Yup.string()
                                .required('Password is required'),
                        })}
                        onSubmit={handleSubmit}
                    >
                        {(formikProps) => (
                            <>
                                <Form className={`form ${theme}`}>
                                    <h1>Login Form</h1>
                                    <div className="form-group">
                                        <label htmlFor="userName">Username<sup>*</sup></label>
                                        <Field
                                            autoComplete="Username"
                                            id="userName"
                                            name="userName"
                                            type="text"
                                        />
                                        <ErrorMessage component="div" className={`error ${theme}`} name="userName" />
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
                                        <ErrorMessage component="div" className={`error ${theme}`} name="password" />
                                    </div>

                                    <button type="submit" className={`btn ${theme}`}>Sing In</button>

                                    {showError && <div className="form-error">The user name or password is incorrect!</div>}

                                    {formikProps.isValid === false && formikProps.submitCount !== 0
                                        ? <div className="form-error"><sup>*</sup>Please fill in all required fields!</div>
                                        : null}
                                </Form>
                            </>
                        )}
                    </Formik>
                ) : (
                    <UserGrid countries={countries} userGrid={userGrid} />
                )}
            </div>
        </>
    )
}

export default LoginPage;