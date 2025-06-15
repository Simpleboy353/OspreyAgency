import React, { useEffect, useState } from "react";
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
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import Navbar from "./Navbar";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

export default function UserViewactivities() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [description, setDescription] = useState(""); // New State for Description

  const history = useHistory();

  const [buttonState, setButtonState] = useState({
    bgColor: "#313a50",
    text: "Attend Activity",
  });

  useEffect(() => {
    setShow(true);
    document.body.className = "light-mode";
    fetchActivity();
    fetchLoggedInUser();
  }, []);

  async function fetchActivity() {
    try {
      const response = await ipcRenderer.invoke("fetchActiveActivity");
      if (response.success) {
        setActivities(response.activities);
        setFilteredActivities(response.activities);
      } else {
        console.error("Failed to fetch Activity");
      }
    } catch (error) {
      console.error("Error fetching Activity:", error);
    }
  }

  async function fetchLoggedInUser() {
    try {
      const email = Cookies.get("email");
      const userId = Cookies.get("userId");

      console.log("Email:", email);
      console.log("User ID:", userId);

      const response = await ipcRenderer.invoke("getLoggedInUser", userId);
      if (response.success && response.user) {
        setUserId(response.user.userId);
      } else {
        console.error("Failed to fetch user ID");
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);
    if (query === "") {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter((activity) =>
        activity.title.toLowerCase().includes(query)
      );
      setFilteredActivities(filtered);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await handleAttendActivity();
    setBasicModal(false);
    setDescription("");
  };

  const handleAttendActivity = async () => {
    if (!userId || !selectedActivityId || !description.trim()) {
      console.error("Missing user ID, activity ID, or description");
      return;
    }
    setSubmit(true);

    try {
      const response = await ipcRenderer.invoke("insertActivityApplication", {
        activityId: selectedActivityId,
        userId: userId,
        description: description,
      });

      if (response.success) {
        setButtonState({
          bgColor: "green",
          text: "Activity Attendance Marked",
        });
      } else {
        setButtonState({ bgColor: "red", text: "Error Occurred" });
      }
    } catch (error) {
      console.error("Error attending activity:", error);
      setButtonState({ bgColor: "red", text: "Error Occurred" });
    }

    setTimeout(() => {
      setButtonState({ bgColor: "#313a50", text: "Attend Activity" });
    }, 2000);

    setSubmit(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              position: "relative",
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ position: "absolute", left: "10px", color: "#aaa" }}
            />
            <input
              id="search"
              name="search"
              type="text"
              value={searchText}
              onChange={handleSearch}
              required
              className="custom-input block w-full"
              placeholder="Search activities"
              style={{
                width: "100%",
                padding: "10px 40px",
                borderRadius: "25px",
                outline: "none",
                background: "white",
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className={` ${show ? "show" : ""}`}>
 <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            View Activities
          </h1>

          <MDBBtn
            style={{
              height: "50px",
              marginTop: "3%",
              paddingRight: "40px",
              paddingLeft: "40px",
              borderRadius: "20px 0 20px 0"
            }}
            onClick={() => history.push("/userAppliedactivities")}
          >
            Attending Activities
          </MDBBtn>
        </div>


            <MDBRow className="row-cols-1 row-cols-md-3 g-4" style={{ marginTop: "10px", marginBottom: "10px" }}>
              {filteredActivities.map((activity) => (
                <MDBCol key={activity.Id}>
                  <MDBCard className="h-100" style={{ borderRadius: "10px" }} id='card'>
                    <MDBCardBody style={{ textAlign: "center" }} >
                      <MDBCardTitle style={{ fontSize: "20px" }}>{activity.title}</MDBCardTitle>
                      <MDBCardText>
                        Location: <span style={{ fontWeight: "bold", color: "#386bc0" }}>{activity.location}</span>
                      </MDBCardText>
                      <MDBCardText>{activity.description}</MDBCardText>
                      <MDBBtn
                        style={{
                          height: "40px",
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "20px",
                        }}
                        onClick={() => {
                          setBasicModal(true);
                          setSelectedActivityId(activity.activityId);
                        }}
                      >
                        Participate in Activity
                      </MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))}
            </MDBRow>
          </div>
        </div>

        <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
          <MDBModalDialog size="lg">
            <MDBModalContent id='card'>
              <MDBModalHeader>
                <MDBModalTitle>Activity Application</MDBModalTitle>
                <MDBBtn className="btn-close" color="none" onClick={() => setBasicModal(false)}></MDBBtn>
              </MDBModalHeader>
              <form onSubmit={handleAdd}>
                <MDBModalBody>
                  <Form.Group className="mb-3">
                    <p style={{textAlign:'left'}}>Do You Want to Attend? Write Basic Details</p>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Details"
                      size="lg"
                      required
                      value={description}
                      onChange={handleDescriptionChange}
                      style={{ borderRadius: "10px", color: "black" }}
                    />
                  </Form.Group>
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn type="submit" style={{ borderRadius: "20px", backgroundColor: buttonState.bgColor }}>
                    {submit ? <MDBSpinner color="info" /> : <span>{buttonState.text}</span>}
                  </MDBBtn>
                </MDBModalFooter>
              </form>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </div>
    </div>
  );
}
