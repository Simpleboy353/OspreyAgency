import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
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
  MDBSwitch,
} from "mdb-react-ui-kit";
import Cookies from "js-cookie";
import Form from "react-bootstrap/Form";
const { ipcRenderer } = window.require('electron');

export default function Activities() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [id, setId] = useState("");
  const [title, settitle] = useState("");
  const [location, setlocation] = useState("");

  const toggleShow = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);
  const toggleInfo = () => setInfoModal(!infoModal);
  const [buttonText, setButtonText] = useState("Add Activity");
  const [buttonColor, setButtonColor] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [buttonState, setButtonState] = useState({
    bgColor: '#313a50',
    text: 'Update Activity',
  });

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    fetchActivity();
  }, []);

      useEffect(() => {
        if (infoModal && id) {
          fetchActivityAttendee();
        }
    }, [infoModal, id]);

  async function fetchActivity() {
    try {
      const response = await ipcRenderer.invoke("fetchActivity");
      if (response.success) {
        setData(response.activities);
      } else {
        console.error("Failed to fetch Activity");
      }
    } catch (error) {
      console.error("Error fetching Activity:", error);
    }
  }


  const confirmDelete = (id) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };
  const handleDelete = () => {
    if (selectedDeleteId !== null) {
      ipcRenderer.send("delete-activity", selectedDeleteId);
      setData((prevActivity) => prevActivity.filter((activity) => activity.activityId !== selectedDeleteId));
    }
    setDeleteModalOpen(false);
  };


  const handleAdd = async (e) => {
    e.preventDefault();

    setSubmit(true);

    const formData = new FormData(e.target);
    const activityData = {
      title: formData.get("title"),
      location: formData.get("location"),
      status: "Active",
    };

    try {
      const response = await ipcRenderer.invoke('addActivity', activityData);
      if (response.success) {
        e.target.reset();
        setButtonText("Activity Added");
        setButtonColor("green");
        setSubmit(false);
        fetchActivity();
        setTimeout(() => {
          setButtonText("Add Activity");
          setButtonColor("");
        }, 1500);
      }
      else {
        setButtonText("Error Occurred");
        setButtonColor("red");
        setSubmit(false);
        setTimeout(() => {
          setButtonText("Add Activity");
          setButtonColor("");
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      setButtonText("Error Occurred");
      setButtonColor("red");
      setSubmit(false);
      setTimeout(() => {
        setButtonText("Add Activity");
        setButtonColor("");
      }, 1500);
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);
    const updatedData = { id, title, location };
    try {
      const response = await ipcRenderer.invoke('updateActivity', updatedData);
      if (response.success) {
        setButtonState({ bgColor: 'green', text: 'Updated' });
        fetchActivity();
        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Update Activity' });
        }, 2000);
      } else {
        setButtonState({ bgColor: 'red', text: 'Error Occurred' });

        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Update Activity' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      setButtonState({ bgColor: 'red', text: 'Error Occurred' });

      setTimeout(() => {
        setButtonState({ bgColor: '#313a50', text: 'Update Activity' });
      }, 2000);
    } finally {
      setSubmit(false);
    }
  };


  const handleSwitchChange = async (currentStatus, activityId) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

    try {
      const result = await ipcRenderer.invoke('update-activity-status', {
        activityId,
        status: newStatus
      });

      if (result.success) {
        setData((prevActivities) =>
          prevActivities.map((activity) =>
            activity.activityId === activityId ? { ...activity, status: newStatus } : activity
          )
        );
      } else {
        console.error("Failed to update status in database");
      }
    } catch (error) {
      console.error("IPC error:", error);
    }
  };

    const fetchActivityAttendee = async () => {
        try {
            const response = await ipcRenderer.invoke("fetchActivityAttendees", id);
            if (response.success) {
                setAttendees(Array.isArray(response.attendees) ? response.attendees : []);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching attendees:", error);
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
              Manage Activities
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
              Add Activity
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
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Location</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Edit Status</th>
                  <th scope="col" className="px-6 py-3">Details</th>
                  <th scope="col" className="px-6 py-3">Update</th>
                  <th scope="col" className="px-6 py-3">Delete</th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((activity, index) => (
                  <tr className="border-b" key={activity.activityId}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{activity.title}</td>
                    <td className="px-6 py-4">{activity.location}</td>
                    <td className="px-6 py-4" style={{ color: activity.status === 'Active' ? "" : "red" }}>{activity.status}</td>
                    <td className="px-6 py-4">
                      <MDBSwitch
                        checked={activity.status === 'Active'} // Ensures correct toggle state
                        onChange={() => handleSwitchChange(activity.status, activity.activityId)}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href="#"
                        onClick={() => {
                          setId(activity.activityId);
                          setInfoModal(true);
                        }}
                      >
                        <i className="fa fa-eye" style={{ color: "orange" }}></i>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          setId(activity.activityId);
                          settitle(activity.title);
                          setlocation(activity.location);
                          setUpdateModal(true);
                        }}
                      >
                        <i
                          className="fa fa-edit"
                          style={{ color: "green" }}
                        ></i>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => confirmDelete(activity.activityId)}
                      >
                        <i
                          className="fa fa-trash"
                          style={{ color: "red" }}
                        ></i>
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
              <MDBModalTitle>Add Activity</MDBModalTitle>
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
                    name="title"  // Add name attribute here
                    placeholder="Activity Title"
                    size="lg"
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Location</p>
                  <Form.Control
                    type="text"
                    name="location"  // Add name attribute here
                    placeholder="Activity Location"
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
        <MDBModalDialog style={{ borderRadius: "20px" }} size="lg">
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Update Activity</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleUpdate}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdate}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Title</p>
                  <Form.Control
                    type="text"
                    placeholder="activity Title"
                    size="lg"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    required
                    style={{ borderRadius: '10px', color: "black" }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Location</p>
                  <Form.Control
                    type="text"
                    placeholder="activity Location"
                    size="lg"
                    value={location}
                    onChange={(e) => setlocation(e.target.value)}
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


      <MDBModal show={infoModal} setShow={setInfoModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: "20px" }} size="lg">
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Activity Applications</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleInfo}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div
                className="relative overflow-x-auto shadow-md sm:rounded-lg"
                style={{ borderRadius: "20px", overflowY: "auto", maxHeight: '300px', }}
              >
                <table className="w-full text-sm text-left text-gray">
                  <thead
                    className="uppercase"
                    id="tablehead"
                    style={{ padding: "10px", color: "#313a50" }}
                  >
                    <tr>
                      <th scope="col" className="px-6 py-3">Sr</th>
                      <th scope="col" className="px-6 py-3">User</th>
                      <th scope="col" className="px-6 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody id="tablebody">
                  {attendees.map((attendee, index) => (
                    <tr className="border-b" key={attendee.userId}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap"
                      >
                       {index + 1}
                      </th>
                      <td>
                        <div className='d-flex align-items-right px-6 py-4 '>
                          <img
                            src={attendee.image ? `data:image/png;base64,${attendee.image}` : "../Assets/user.png"}
                            alt=''
                            style={{ width: '45px', height: '45px' }}
                            className='rounded-circle'
                          />
                          <div className='ms-3'>
                            <p className='fw-bold mb-1'>{attendee.name}</p>
                            <p className=' mb-0'>{attendee.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{attendee.description || "No Details Given"}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </MDBModalBody>

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
