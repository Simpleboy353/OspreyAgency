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
  const [submit, setSubmit] = useState(false);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.className = "dark-mode";
  }, []);

  const handleEmail = (event) => {
    setEmail(event.target.value);
    if (event.target.value.length === 0) {
      event.target.style.backgroundColor = "#f6eacf";
      event.target.style.border = "1px solid #daa93e";
    } else {
      event.target.style.backgroundColor = "#d1e4df";
      event.target.style.border = "1px solid #579c89";
    }
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length === 0) {
      event.target.style.backgroundColor = "#f6eacf";
      event.target.style.border = "1px solid #daa93e";
    } else {
      event.target.style.backgroundColor = "#d1e4df";
      event.target.style.border = "1px solid #579c89";
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmit(true);

    // Send credentials to the backend
    try {
      const result = await ipcRenderer.invoke('login', { username: email, password });

      if (result.success) {
        // Successful login
        Cookies.set("username", result.user.username);
        Cookies.set("password", result.user.password);
        window.location.href = "/dashboard";
      } else {
        // Invalid credentials
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
                      Admin Login
                    </h4>
                    <Form.Group className="mb-3">
                      <Form.Control
                        placeholder="Admin ID"
                        size="lg"
                        value={email}
                        onChange={handleEmail}
                        style={{ borderRadius: "10px" }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Admin Password"
                        size="lg"
                        value={password}
                        onChange={handlePassword}
                        style={{ borderRadius: "10px" }}
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
                  <div className="d-flex  mx-3 mb-4" style={{ justifyContent: 'center' }}>
                    <p>Not an admin</p>
                    <Link to="/userLogin" style={{ marginLeft: '5px' }}>Go to User Login</Link>
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

