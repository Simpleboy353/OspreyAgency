import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBCard, MDBCardBody, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
const { ipcRenderer } = window.require("electron");

export default function Myaccount() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState(""); // Current username
  const [newUsername, setNewUsername] = useState(""); // New username to be updated
  const [newPass, setNewPass] = useState(""); // New password
  const [error, setError] = useState(""); 

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    setUsername(Cookies.get("username") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setSubmit(true); // Set submit to true before the request
  
    ipcRenderer.invoke("update-credentials", { username, newUsername, newPassword: newPass })
      .then((response) => {
        if (response.success) {
          setSuccess(true);
          setError(""); // Clear any previous errors

          // If username is successfully updated, update the state and cookies
          if (newUsername) {
            setUsername(newUsername); // Update username in state
            Cookies.set("username", newUsername); // Update username in cookies
          }
        } else {
          setSuccess(false);
          setError(response.message); // Display the error message from the backend
        }
      })
      .catch((err) => {
        setSuccess(false);
        setError("An unexpected error occurred.");
      })
      .finally(() => {
        setSubmit(false); // Set submit to false after the request completes
      });
  };

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <h1 className="dashboard" style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}>
            My Account
          </h1>
          <MDBCard style={{ borderRadius: 0, margin: "5px", marginTop: "40px" }} id="card">
            <h4 id="cardhead" style={{ textAlign: "left", padding: "15px", fontWeight: "bold" }}>
              Change Credentials
            </h4>
            <form onSubmit={handleSubmit}>
              <MDBCardBody style={{ textAlign: "left" }}>
                <Form.Group className="mb-3">
                  <div className="d-flex flex-wrap">
                    <div className="mb-2 mb-lg-0 pe-lg-2 flex-grow-1">
                      <p style={{ marginBottom: "0px" }}>Admin ID</p>
                      <Form.Control
                        type="text"
                        size="lg"
                        id="card"
                        name="username"
                        value={username}
                        disabled
                        style={{ borderRadius: "10px", color: "black" }}
                      />
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px" }}>New Username</p>
                  <Form.Control
                    type="text"
                    placeholder="New Username"
                    size="lg"
                    id="card"
                    name="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ borderRadius: "10px", color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px" }}>New Password</p>
                  <Form.Control
                    type="password"
                    placeholder="New Password"
                    size="lg"
                    id="card"
                    name="newPass"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    style={{ borderRadius: "10px", color: "black" }}
                  />
                </Form.Group>

                {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

                <MDBBtn
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    backgroundColor: success ? "green" : "",
                    color: success ? "white" : "",
                  }}
                  className="btnsc"
                  type="submit"
                >
                  {submit ? <MDBSpinner color="info" /> : success ? <span>Updated</span> : <span>Change Credentials</span>}
                </MDBBtn>
              </MDBCardBody>
            </form>
          </MDBCard>
        </div>
      </div>
    </div>
  );
}
