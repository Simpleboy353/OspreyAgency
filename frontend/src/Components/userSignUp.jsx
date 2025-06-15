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
import { Link } from "react-router-dom";
const { ipcRenderer } = window.require('electron');


function Login() {
    const [submit, setSubmit] = useState(false);
      const [buttonText, setButtonText] = useState("SignUp");
      const [buttonColor, setButtonColor] = useState(""); 


    useEffect(() => {
        document.body.className = "dark-mode";
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmit(true);
    
        const formData = new FormData(e.target);
        const imageFile = formData.get('image');
        const name = formData.get('name');
        const email = formData.get('email');
        const phoneNo = formData.get('phoneNo');
        const profession = formData.get('profession');
        const hobbies = formData.get('hobbies');
        const interest = formData.get('interest');
        const password = formData.get('password');
    
        // Convert image to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            // Removing metadata (e.g., "data:image/png;base64,")
            const imageBase64 = reader.result.split(',')[1];
    
            const userData = {
                name,
                email,
                phoneNo,
                profession,
                hobbies,
                interest,
                image: imageBase64,
                password
            };
    
            try {
                const response = await ipcRenderer.invoke('signUp', userData);
                if (response.success) {
                    e.target.reset();
                    setButtonText("User Added");
                    setButtonColor("green");
                    setSubmit(false);
                    setTimeout(() => {
                        setButtonText("Sign Up");
                        setButtonColor("");
                    }, 1500);
                } else {
                    setButtonText("Error Occurred");
                    setButtonColor("red");
                    setSubmit(false);
                    setTimeout(() => {
                        setButtonText("Sign Up");
                        setButtonColor("");
                    }, 1500);
                }
            } catch (error) {
                console.error('Error adding user:', error);
                setButtonText("Error Occurred");
                setButtonColor("red");
                setSubmit(false);
                setTimeout(() => {
                    setButtonText("Sign Up");
                    setButtonColor("");
                }, 1500);
            }
        };
    
        reader.readAsDataURL(imageFile);
    };
    



    return (
        <div >
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
                                    <form onSubmit={handleAdd}>
                                        <center>
                                            <img
                                                src="./Assets/logo.png"
                                                alt="Sushi"
                                                style={{
                                                    width: "180px",
                                                    borderRadius: "50%",
                                                    height: "150px",
                                                }}
                                            />
                                        </center>
                                        <h4 style={{ marginTop: "10px", marginBottom: "30px" }}>
                                            User SignUp
                                        </h4>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        placeholder="Name"
                                                        name="name"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="text"
                                                        name="phoneNo"
                                                        placeholder="Phone Number"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="text"
                                                        name="hobbies"
                                                        placeholder="Hobbies"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="file"
                                                        size="lg"
                                                        name="image"
                                                        required
                                                        style={{ borderRadius: '10px', color: "black" }}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        placeholder="Email"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="text"
                                                        name="profession"
                                                        placeholder="Profession"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="text"
                                                        name="interest"
                                                        placeholder="Interest"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        placeholder="Password"
                                                        size="lg"
                                                        style={{ borderRadius: "10px" }}
                                                    />
                                                </Form.Group>
                                            </div>

                                        </div> 
                                        <MDBBtn
                                            type="submit"
                                            className="btnsc"
                                            size="lg"
                                            style={{
                                                borderRadius: '20px',
                                                backgroundColor: buttonColor,
                                                width: "100%",
                                
                                            }}

                                        >
                                            {submit ? (
                                                <MDBSpinner color="info" />
                                            ) : (
                                                <span>{buttonText}</span>
                                            )}
                                        </MDBBtn>
                                    </form>



                                    <div className="d-flex  mx-3 mb-4" style={{ justifyContent: 'center' }}>
                                        <p>Already Have Account</p>
                                        <Link to="/userLogin" style={{ marginLeft: '5px' }}>Login Here</Link>
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
        </div>
    );
}

export default Login;
