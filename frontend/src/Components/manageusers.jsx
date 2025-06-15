import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import "./manageusers.css"
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
} from "mdb-react-ui-kit";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
const { ipcRenderer } = window.require('electron');

export default function ManageUsers() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const toggleShow = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);
  const [buttonText, setButtonText] = useState("Add User");
  const [buttonColor, setButtonColor] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [buttonState, setButtonState] = useState({
    bgColor: '#313a50',
    text: 'Update User',
  });

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getData();
  }, []);


  async function getData() {
    try {
      const result = await ipcRenderer.invoke("fetchUsers");
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }


  const handleAdd = async (e) => {
    e.preventDefault();

    setSubmit(true); 

    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("Password"),
    };

    try {
      const response = await ipcRenderer.invoke('addUser', userData);
      if (response.success) {
        e.target.reset();
        setButtonText("User Added");
        setButtonColor("green");
        setSubmit(false);
        getData();
        setTimeout(() => {
          setButtonText("Add User");
          setButtonColor("");
        }, 1500);
      } else {
        setButtonText("Error Occurred");
        setButtonColor("red");
        setSubmit(false);
        setTimeout(() => {
          setButtonText("Add User");
          setButtonColor("");
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setButtonText("Error Occurred");
      setButtonColor("red");
      setSubmit(false);
      setTimeout(() => {
        setButtonText("Add User");
        setButtonColor("");
      }, 1500);
    }
  };

  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedDeleteId !== null) {
      ipcRenderer.send("delete-user", selectedDeleteId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== selectedDeleteId));
    }
    setDeleteModalOpen(false);
  };




  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);
    const updatedData = { id, name, email, password };
    try {
      const response = await ipcRenderer.invoke('updateUser', updatedData);
      if (response.success) {
        setButtonState({ bgColor: 'green', text: 'Updated' });
        getData();
        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Update User' });
        }, 2000);
      } else {
        setButtonState({ bgColor: 'red', text: 'Error Occurred' });

        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Update User' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setButtonState({ bgColor: 'red', text: 'Error Occurred' });

      setTimeout(() => {
        setButtonState({ bgColor: '#313a50', text: 'Update User' });
      }, 2000);
    } finally {
      setSubmit(false);
    }
  };





  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Manage Users
            </h1>
            <MDBBtn
              style={{
                height: "50px",
                marginTop: "3%",
                paddingRight: '40px',
                paddingLeft: '40px',
                borderRadius: "20px 0 20px 0"
              }}
              onClick={() => {
                setBasicModal(true);
              }}
            >
              Add User
            </MDBBtn>
          </div>


          <MDBRow className="row-cols-1 row-cols-md-4 g-4" style={{ margin: "20px" }}>
            {users.map((user) => (
              <MDBCol key={user.userId}>
                <MDBCard className="h-100 d-flex flex-column" style={{ borderRadius: "0" }} id="card">
                  <center>
                    <MDBCardImage
                      src={user.image ? `data:image/png;base64,${user.image}` : "../Assets/user.png"}
                      position="top"
                      style={{
                        borderRadius: "100px",
                        height: "200px",
                        width: "200px",
                        padding: "10px",
                      }}
                    />
                  </center>
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle style={{ fontSize: "20px" }}>{user.name}</MDBCardTitle>
                    <MDBCardText style={{ fontWeight: 'bold', color: '#386bc0' }}>{user.email}</MDBCardText>
                    <MDBCardText style={{ textAlign: 'justify' }}>{user.hobbies}</MDBCardText> <br />
                    <MDBCardText style={{ textAlign: 'justify', marginTop: '-20px' }}>{user.interest}</MDBCardText>
                    <div className="mt-auto d-flex justify-content-center">
                      <MDBBtn
                        style={{
                          height: "40px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "20px",
                          marginRight: '2px'
                        }}
                        onClick={() => {
                          setId(user.userId);
                          setName(user.name);
                          setEmail(user.email);
                          setPassword(user.password);
                          setUpdateModal(true);
                        }}
                      >
                        Update
                      </MDBBtn>
                      <MDBBtn
                        style={{
                          height: "40px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "20px",
                        }}
                        onClick={() => confirmDelete(user.userId)}
                      >
                        Delete
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>

        </div>
      </div>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }} size="lg">
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Add User</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleAdd}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Name</p>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    size="lg"
                    name="name"
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Email</p>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    size="lg"
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Password</p>
                  <Form.Control
                    type="text"
                    placeholder="Password"
                    name="Password"
                    size="lg"
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btnsc"
                  style={{
                    borderRadius: '20px',
                    backgroundColor: buttonColor,
                  }}
                >
                  {submit ? (
                    <MDBSpinner color="info" />
                  ) : (
                    <span>{buttonText}</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>


      <MDBModal show={updateModal} setShow={setUpdateModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }} size="lg">
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Update User</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleUpdate}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdate}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Name</p>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    size="lg"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Email</p>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                  <span id="email-error"></span>
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Password</p>
                  <Form.Control
                    type="text"
                    placeholder="Password"
                    size="lg"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btnsc"
                  style={{ borderRadius: '20px', backgroundColor: buttonState.bgColor }}
                >
                  {submit ? <MDBSpinner color="info" /> : <span>{buttonState.text}</span>}
                </MDBBtn>

              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal show={deleteModalOpen} setShow={setDeleteModalOpen} tabIndex="-1">
        <MDBModalDialog >
          <MDBModalContent id='card'>
            <MDBModalHeader>
              <h5>Confirm Deletion</h5>
            </MDBModalHeader>
            <MDBModalBody>
              Are you sure you want to delete?
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</MDBBtn>
              <MDBBtn color="danger" onClick={handleDelete}>OK</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
