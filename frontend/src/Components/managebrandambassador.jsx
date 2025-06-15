
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
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
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
const { ipcRenderer } = window.require('electron');

export default function ManageBrandAmbassadors() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [ambassadors, setAmbassadors] = useState([]);
  const [id, setId] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Add Ambassador");
  const [buttonColor, setButtonColor] = useState("");

  const toggleShow = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [buttonState, setButtonState] = useState({
    bgColor: '#313a50',
    text: 'Update Ambassador',
  });
  const [image, setImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result.split(',')[1];
        setImage(imageBase64);
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    fetchBrandAmbassadors();
  }, []);

  async function fetchBrandAmbassadors() {
    try {
      const response = await ipcRenderer.invoke("fetchBrandAmbassadors");
      if (response.success) {
        setAmbassadors(response.ambassadors);
      } else {
        console.error("Failed to fetch brand ambassadors");
      }
    } catch (error) {
      console.error("Error fetching brand ambassadors:", error);
    }
  }



  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const formData = new FormData(e.target);
    const imageFile = formData.get('image');
    const name = formData.get('name');
    const role = formData.get('role');
    const description = formData.get('description');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageBase64 = reader.result.split(',')[1];

      const ambassadorData = {
        image: imageBase64,
        name,
        role,
        description
      };

      try {
        const response = await ipcRenderer.invoke('addAmbassador', ambassadorData);
        if (response.success) {
          e.target.reset();
          setButtonText("Ambassador Added");
          setButtonColor("green");
          setSubmit(false);
          fetchBrandAmbassadors();
          setTimeout(() => {
            setButtonText("Add Ambassador");
            setButtonColor("");
          }, 1500);
        } else {
          setButtonText("Error Occurred");
          setButtonColor("red");
          setSubmit(false);
          setTimeout(() => {
            setButtonText("Add Ambassador");
            setButtonColor("");
          }, 1500);
        }
      } catch (error) {
        console.error('Error adding ambassador:', error);
        setButtonText("Error Occurred");
        setButtonColor("red");
        setSubmit(false);
        setTimeout(() => {
          setButtonText("Add Ambassador");
          setButtonColor("");
        }, 1500);
      }
    };
    reader.readAsDataURL(imageFile);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);
    const updatedData = {
      id,
      name,
      role,
      image: image || undefined,
      description
    };

    try {
      const response = await ipcRenderer.invoke('updateBrandAmbassador', updatedData);

      if (response.success) {
        setButtonState({ bgColor: 'green', text: 'Updated' });
        fetchBrandAmbassadors();

        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Update Ambassador' });
        }, 2000);
      } else {
        setButtonState({ bgColor: 'red', text: 'Error Occurred' });

        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Update Ambassador' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating ambassador:', error);
      setButtonState({ bgColor: 'red', text: 'Error Occurred' });

      setTimeout(() => {
        setButtonState({ bgColor: '#313a50', text: 'Update Ambassador' });
      }, 2000);
    } finally {
      setSubmit(false);
    }
  };



  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };
  const handleDelete = () => {
    if (selectedDeleteId !== null) {
      ipcRenderer.send("delete-brandAmbassador", selectedDeleteId);
      setAmbassadors((prevBrand) => prevBrand.filter((ambassador) => ambassador.brandId !== selectedDeleteId));
    }
    setDeleteModalOpen(false);
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
              Manage Brand Ambassadors
            </h1>
            <MDBBtn
              style={{
                height: "50px",
                marginTop: "3%",
                paddingRight: "40px",
                paddingLeft: "40px",
                borderRadius: "20px 0 20px 0",
              }}
              onClick={() => {
                setBasicModal(true);
              }}
            >
              Add Ambassador
            </MDBBtn>
          </div>

          <MDBRow className="row-cols-1 row-cols-md-4 g-4" style={{ margin: "20px" }}>
            {ambassadors.map((ambassador) => (
              <MDBCol key={ambassador.brandId}>
                <MDBCard className="h-100 d-flex flex-column" style={{ borderRadius: "10px" }} id="card">
                  <center>
                    <MDBCardImage
                      src={ambassador.image ? `data:image/png;base64,${ambassador.image}` : "../Assets/user.png"}
                      position="top"
                      style={{
                        borderRadius: "0",
                        height: "200px",
                        width: "250px",
                        padding: "10px",
                      }}
                    />
                  </center>
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle style={{ fontSize: "20px" }}>{ambassador.name}</MDBCardTitle>
                    <MDBCardText style={{ fontWeight: "bold", color: "#386bc0" }}>
                      {ambassador.role}
                    </MDBCardText>
                    <MDBCardText style={{ textAlign: "justify" }}>{ambassador.description}</MDBCardText>

                    <div className="mt-auto d-flex justify-content-center">
                      {/* <MDBBtn
                        style={{
                          height: "40px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "20px",
                          marginRight: '2px'
                        }}
                        onClick={() => {
                          setId(ambassador.brandId);
                          setName(ambassador.name);
                          setRole(ambassador.role);
                          setDescription(ambassador.description)
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
                        onClick={() => confirmDelete(ambassador.brandId)}
                      >
                        Delete
                      </MDBBtn> */}
                      <div className="mt-auto d-flex justify-content-center" style={{ gap: "8px", flexWrap: "nowrap" }}>
  <MDBBtn
    style={{
      height: "40px",
      backgroundColor: "green",
      color: "white",
      borderRadius: "20px",
      minWidth: "90px", // Ensure buttons are wide enough
    }}
    onClick={() => {
      setId(ambassador.brandId);
      setName(ambassador.name);
      setRole(ambassador.role);
      setDescription(ambassador.description);
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
      minWidth: "90px", // Ensuring equal width
    }}
    onClick={() => confirmDelete(ambassador.brandId)}
  >
    Delete
  </MDBBtn>
</div>

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
              <MDBModalTitle>Add Ambassador</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
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
                    style={{ borderRadius: "10px", color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Role</p>
                  <Form.Control
                    type="Role"
                    placeholder="Role"
                    name="role"
                    size="lg"
                    required
                    style={{ borderRadius: "10px", color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Image</p>
                  <Form.Control
                    type="file"
                    size="lg"
                    placeholder="Upload Image"
                    name="image"
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Description</p>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Description"
                    name="description"
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
                    paddingRight: '30px', paddingLeft: '30px'
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
              <MDBModalTitle>Update Ambassador</MDBModalTitle>
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
                    style={{ borderRadius: "10px", color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Role</p>
                  <Form.Control
                    type="Role"
                    placeholder="Role"
                    name="Role"
                    size="lg"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    style={{ borderRadius: "10px", color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Image </p>
                  <Form.Control
                    type="file"
                    size="lg"
                    placeholder="Upload Image"
                    onChange={handleImageChange}
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Description</p>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Description"
                    size="lg"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
          <MDBModalContent id="card">
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
