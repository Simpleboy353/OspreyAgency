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
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
const { ipcRenderer } = window.require("electron");

export default function UserViewEvents() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAttending, setIsAttending] = useState("Attending");
  const [basicModal, setBasicModal] = useState(false);
  const [submit, setSubmit] = useState(false);

  const [buttonState, setButtonState] = useState({
    bgColor: '#313a50',
    text: 'Mark Attendance',
  });

  const history = useHistory();

  useEffect(() => {
    document.body.className = "light-mode";
    fetchLoggedInUser();
    fetchEvents();
  }, []);

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

  async function fetchEvents() {
    try {
      const response = await ipcRenderer.invoke("fetchActiveEvents");
      if (response.success) {
        setEvents(response.events);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleAttendEvent = async (e) => {
    e.preventDefault();
    if (!userId || !selectedEventId) {
      console.error("Missing user ID or event ID");
      return;
    }
    setSubmit(true);

    try {
      const response = await ipcRenderer.invoke("insertEventApplication", {
        eventId: selectedEventId,
        userId: userId,
        isattending: isAttending,
        feedback: null,
      });

      if (response.success) {
        setButtonState({ bgColor: 'green', text: 'Attendance Marked' });
        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Mark Attendance' });
        }, 2000);
      } else {
        setButtonState({ bgColor: 'red', text: 'Error Occurred' });

        setTimeout(() => {
          setButtonState({ bgColor: '#313a50', text: 'Mark Attendance' });
        }, 2000);
      }
    } catch (error) {
      setButtonState({ bgColor: 'red', text: 'Error Occurred' });

      setTimeout(() => {
        setButtonState({ bgColor: '#313a50', text: 'Mark Attendance' });
      }, 2000);
    }

    setSubmit(false);
  };

  const filteredEvents = events.filter((event) =>
    [event.title, event.venue, event.date].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", flexGrow: 1, position: "relative" }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: "absolute", left: "10px", color: "#aaa" }} />
            <input
              type="text"
              className="custom-input block w-full"
              placeholder="Search Events"
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: "100%", padding: "10px 40px", borderRadius: "25px", outline: "none", background: "white" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            View Events
          </h1>

          <MDBBtn
            style={{
              height: "50px",
              marginTop: "3%",
              paddingRight: "40px",
              paddingLeft: "40px",
              borderRadius: "20px 0 20px 0"
            }}
            onClick={() => history.push("/userAttendingEvents")}
          >
            Attending Events
          </MDBBtn>
        </div>

        <MDBRow className="row-cols-1 row-cols-md-3 g-4 mt-3">
          {filteredEvents.map((event) => (
            <MDBCol key={event.eventId}>
              <MDBCard className="h-100" style={{ borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} id="card">
                <center>
                <MDBCardImage
  src={event.image ? `data:image/png;base64,${event.image}` : "../Assets/user.png"}
  position="top"
  style={{
    height: "310px",
    width: "400px",
    objectFit: "cover",
  

   
  }}
/>
                </center>
                <MDBCardBody>
                  <MDBCardTitle style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "10px" }}>{event.title}</MDBCardTitle>
                  <MDBCardText style={{ fontSize: "0.9rem", color: "#555", marginBottom: "5px" }}><strong>Venue:</strong> {event.venue}</MDBCardText>
                  <MDBCardText style={{ fontSize: "0.9rem", color: "#555", marginBottom: "5px" }}><strong>Date:</strong> {event.date}</MDBCardText>
                  <MDBCardText style={{ fontSize: "0.9rem", color: "#555", marginBottom: "15px" }}>{event.description}</MDBCardText>
                  <MDBBtn
                    style={{ backgroundColor: "#313a50", color: "white", borderRadius: "20px", width: "100%" }}
                    onClick={() => {
                      setSelectedEventId(event.eventId);
                      setBasicModal(true);
                    }}
                  >
                    Ready to Attend Event
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>

        <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
          <MDBModalDialog>
            <MDBModalContent id="card">
              <MDBModalHeader>
                <MDBModalTitle>Event Applications</MDBModalTitle>
                <MDBBtn className="btn-close" color="none" onClick={() => setBasicModal(false)}></MDBBtn>
              </MDBModalHeader>
              <form onSubmit={handleAttendEvent}>
                <MDBModalBody>
                  <Form.Group>
                    <p>Do You Want to Attend Event?</p>
                    <Form.Select onChange={(e) => setIsAttending(e.target.value)} required>
                      <option value="Attending">I want to Attend</option>
                      <option value="Not Attending">I don't want to Attend</option>
                    </Form.Select>
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
      </div>
    </div>
  );
}