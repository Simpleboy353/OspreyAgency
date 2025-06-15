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
import Form from "react-bootstrap/Form";
const { ipcRenderer } = window.require('electron');

export default function Notification() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Send Announcement");
  const [buttonColor, setButtonColor] = useState(""); 

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);


  const toggleShow = () => setBasicModal(!basicModal);

    useEffect(() => {
      setShow(true);
      if (Cookies.get("mode") === "light") {
            document.body.className = "light-mode";
          } else {
            document.body.className = "dark-mode";
          }
      fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
      try {
        const response = await ipcRenderer.invoke("fetchAnnouncements");
        if (response.success) {
          setData(response.announcements);
        } else {
          console.error("Failed to fetch announcements");
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    }


  const handleAdd = async (e) => {
    e.preventDefault();
  
    setSubmit(true); // Start the loading spinner
  
    const formData = new FormData(e.target);
    const NotificationData = {
      title: formData.get("title"),
      description: formData.get("description"),
    };
  
    try {
      const response = await ipcRenderer.invoke('addNotification', NotificationData);
      if (response.success) {
        e.target.reset();
        setButtonText("Successfully Sent");
        setButtonColor("green");
        setSubmit(false); 
        setDescription('');
        setTitle('');
        fetchAnnouncements();
        setTimeout(() => {
          setButtonText("Send Announcements");
          setButtonColor(""); 
        }, 1500);    
      } else {
        setButtonText("Error Occurred");
        setButtonColor("red");
        setSubmit(false); 
        setTimeout(() => {
          setButtonText("Send Announcements");
          setButtonColor(""); 
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setButtonText("Error Occurred");
      setButtonColor("red");
      setSubmit(false); 
      setTimeout(() => {
        setButtonText("Send Announcements");
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
    ipcRenderer.send("delete-announcement", selectedDeleteId); 
    setData((prevAnnouncement) => prevAnnouncement.filter((announcement) => announcement.announcementId !== selectedDeleteId));
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
              Send Announcements
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
              Add announcement
            </MDBBtn>
          </div>

          <div
            className="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{ borderRadius: "20px", marginTop: "30px" }}
          >
            <table className="w-full text-sm text-left text-gray">
              <thead
                className="uppercase"
                id="tablehead"
                style={{ padding: "10px", color: "#313a50" }}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">Sr</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Delete</th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((announcement, index) => (
                  <tr className="border-b" key={announcement.Id}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{announcement.createdAt}</td>
                    <td className="px-6 py-4">{announcement.title}</td>
                    <td className="px-6 py-4">{announcement.description}</td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        onClick={() => {
                          confirmDelete(announcement.announcementId);
                        }}
                      >
                        <i className="fa fa-trash" style={{ color: "red" }}></i>
                      </a>
                    </td>



                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: "20px" }} size="lg">
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Send Announcements</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleAdd}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Title</p>
                  <Form.Control
                    type="text"
                    placeholder="Announcement Title"
                    size="lg"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Description</p>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Announcement Description"
                    name="description"
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