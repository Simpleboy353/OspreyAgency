import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtn,
  MDBTypography,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import Navbar from "./Navbar";
import Cookies from "js-cookie";

const { ipcRenderer } = window.require("electron");

export default function UserViewProfile() {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [profession, setProfession] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [interest, setInterest] = useState("");
  const [submit, setSubmit] = useState(false);
  const [buttonState, setButtonState] = useState({ bgColor: "#313a50", text: "Edit Profile" });
  const [updateModal, setUpdateModal] = useState(false);
  const [image, setImage] = useState(null);

  const toggleUpdate = () => setUpdateModal(!updateModal);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result.split(",")[1];
        setImage(imageBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setShow(true);
    document.body.className = "light-mode";
    getData();
  }, []);

  async function getData() {
    try {
      const userId = Cookies.get("userId");
      if (userId) {
        const result = await ipcRenderer.invoke("fetchSpecificUser", userId);
        if (result.success) {
          setUsers(result.SpecificUser);
        } else {
          console.error("Failed to fetch user");
        }
      } else {
        console.error("No userId found in cookies");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);
    const updatedData = { id, name, email, image: image || undefined, phoneNo, profession, hobbies, interest };

    try {
      const response = await ipcRenderer.invoke("updateUserProfile", updatedData);
      if (response.success) {
        setButtonState({ bgColor: "green", text: "Updated" });
        getData();
        document.getElementById("userForm").reset();
        setName("");
        setEmail("");
        setPhoneNo("");
        setProfession("");
        setInterest("");
        setHobbies("");
        setTimeout(() => setButtonState({ bgColor: "#313a50", text: "Edit Profile" }), 2000);
      } else {
        setButtonState({ bgColor: "red", text: "Error Occurred" });
        setTimeout(() => setButtonState({ bgColor: "#313a50", text: "Edit Profile" }), 2000);
      }
    } catch (error) {
      console.error("Error updating Profile:", error);
      setButtonState({ bgColor: "red", text: "Error Occurred" });
      setTimeout(() => setButtonState({ bgColor: "#313a50", text: "Edit Profile" }), 2000);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div>
      <Navbar />
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center">
          <MDBCol md="8" lg="6">
            <MDBCard>
              <div className="d-flex flex-column align-items-center p-4 bg-dark text-white">
                <MDBCardImage
                  src={users[0]?.image ? `data:image/png;base64,${users[0]?.image}` : "../Assets/user.png"}
                  alt="User Image"
                  className="rounded-circle mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <MDBTypography tag="h5" className="mb-1">{users[0]?.name}</MDBTypography>
                <MDBCardText className="mb-2">{users[0]?.email}</MDBCardText>
                <MDBCardText>{users[0]?.phoneNo}</MDBCardText>
                <MDBBtn outline color="light" onClick={() => {
                  setId(users[0]?.userId);
                  setName(users[0]?.name);
                  setEmail(users[0]?.email);
                  setPhoneNo(users[0]?.phoneNo);
                  setProfession(users[0]?.profession);
                  setHobbies(users[0]?.hobbies);
                  setInterest(users[0]?.interest);
                  setUpdateModal(true);
                }}>Edit Profile</MDBBtn>
              </div>
              <MDBCardBody>
                <h4 className="mb-3">About</h4>
                <MDBCardText><b>Profession:</b> {users[0]?.profession}</MDBCardText>
                <MDBCardText><b>Hobbies:</b> {users[0]?.hobbies}</MDBCardText>
                <MDBCardText><b>Interest:</b> {users[0]?.interest}</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <MDBModal show={updateModal} setShow={setUpdateModal} tabIndex="-1">
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Profile</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleUpdate}></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdate} id="userForm">
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" placeholder="Phone" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Profession</Form.Label>
                  <Form.Control type="text" placeholder="Profession" value={profession} onChange={(e) => setProfession(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Hobbies</Form.Label>
                  <Form.Control type="text" placeholder="Hobbies" value={hobbies} onChange={(e) => setHobbies(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Interest</Form.Label>
                  <Form.Control type="text" placeholder="Interest" value={interest} onChange={(e) => setInterest(e.target.value)} required />
                </Form.Group>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn type="submit" style={{ backgroundColor: buttonState.bgColor }}>
                  {submit ? <MDBSpinner size="sm" /> : buttonState.text}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
