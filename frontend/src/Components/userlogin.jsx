import React, { useState, useEffect } from "react";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBSpinner,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit] = useState(false);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        document.body.className = "dark-mode";
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setSubmit(true);

        try {
            const result = await ipcRenderer.invoke("userLogin", { email, password });

            if (result.success) {
                Cookies.set("email", email);
                Cookies.set("userId", result.user.userId);
                window.location.href = "/viewEvents";
            } else {
                setValid(true);
                setSubmit(false);
                setTimeout(() => setValid(false), 2000);
            }
        } catch (error) {
            setValid(true);
            setSubmit(false);
            setTimeout(() => setValid(false), 2000);
        }
    };

    return (
        <div>
            <div className="login-container">
                <MDBContainer fluid>
                    <MDBRow className="d-flex justify-content-center align-items-center h-100">
                        <MDBCol col="12">
                            <MDBCard
                                className="my-5 mx-auto"
                                id="card"
                                style={{ borderRadius: 0, maxWidth: "700px" }}
                            >
                                <MDBCardBody className="p-5 w-100 d-flex flex-column">
                                    <form onSubmit={handleLogin}>
                                        <center>
                                            <img
                                                src="./Assets/logo.png"
                                                alt="Sushi"
                                                style={{
                                                    width: "180px",
                                                    borderRadius: "50%",
                                                    height: "180px",
                                                }}
                                            />
                                        </center>
                                        <h4 style={{ marginTop: "10px", marginBottom: "30px" }}>
                                            User Login
                                        </h4>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="email"
                                                placeholder="Email"
                                                name="email"
                                                size="lg"
                                                style={{ borderRadius: "10px" }}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                size="lg"
                                                style={{ borderRadius: "10px" }}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </Form.Group>

                                        <MDBBtn
                                            type="submit"
                                            size="lg"
                                            style={{
                                                borderRadius: 20,
                                                width: "100%",
                                                backgroundColor: valid ? "red" : "",
                                            }}
                                            className="btnsc"
                                        >
                                            {submit ? (
                                                <MDBSpinner color="info" />
                                            ) : valid ? (
                                                <span>Incorrect Login</span>
                                            ) : (
                                                <span>Login</span>
                                            )}
                                        </MDBBtn>
                                    </form>
                                    <div className="d-flex  mx-3 mb-4" style={{ justifyContent: "center" }}>
                                        <p>Not Have Account</p>
                                        <Link to="/userSignUp" style={{ marginLeft: "5px" }}>SignUp Here</Link>
                                        <p style={{marginLeft:'10px'}}>Not User</p>
                                        <Link to="/" style={{ marginLeft: "5px" }}>Admin Login</Link>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
            <footer className="footer">
                <p>
                    &copy; {new Date().getFullYear()} WomenEmpowerment. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default Login;

