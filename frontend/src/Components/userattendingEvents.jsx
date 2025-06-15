import React, { useState, useEffect } from "react";
import Navbar from './Navbar';
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
import Cookies from "js-cookie";
const { ipcRenderer } = window.require("electron");

export default function UserAttendingEvents() {
    const [submit, setSubmit] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [attendingEvent, setAttendingEvent] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [buttonState, setButtonState] = useState({
        bgColor: '#313a50',
        text: 'Give Feedback',
    });

    const userId = Cookies.get("userId");

    useEffect(() => {
        document.body.className = "light-mode";
        fetchAttendingEvent(userId);
    }, [userId]);

    async function fetchAttendingEvent(userId) {
        try {
            const response = await ipcRenderer.invoke("fetchAttendingEvent", userId);
            if (response.success) {
                setAttendingEvent(response.attendingEvent);
            } else {
                console.error("Failed to fetch attending event");
            }
        } catch (error) {
            console.error("Error fetching attending event:", error);
        }
    }

    async function handleSubmitFeedback(eventId, feedback) {
        setSubmit(true);
        try {
            const response = await ipcRenderer.invoke("submitFeedback", { eventId, userId, feedback });
            if (response.success) {
                setButtonState({ bgColor: 'green', text: 'Feedback Given' });
                fetchAttendingEvent(userId);
                setTimeout(() => {
                    setButtonState({ bgColor: '#313a50', text: 'Give Feedback' });
                }, 2000);
                document.getElementById('feedbackForm').reset();

            } else {
                setButtonState({ bgColor: 'red', text: 'Error Occurred' });
                setTimeout(() => {
                    setButtonState({ bgColor: '#313a50', text: 'Give Feedback' });
                }, 2000);
            }
        } catch (error) {
        } finally {
            setSubmit(false);
        }
    }


    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="sidecol3">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h1
                            className="dashboard"
                            style={{
                                textAlign: "left",
                                paddingTop: "40px",
                                fontWeight: "bolder",
                            }}
                        >
                            Attended Events
                        </h1>
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
                                    <th scope="col" className="px-6 py-3">Venue</th>
                                    <th scope="col" className="px-6 py-3">Feedback</th>
                                    <th scope="col" className="px-6 py-3">Review</th>
                                </tr>
                            </thead>
                            <tbody id="tablebody">
                            {attendingEvent.length > 0 ? (
                                attendingEvent.map((event, index) => (
                                    <tr className="border-b" key={event.eventId}>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{index + 1}</th>
                                        <td className="px-6 py-4">{event.title}</td>
                                        <td className="px-6 py-4">{event.venue}</td>
                                        <td className="px-6 py-4">{event.feedback}</td>
                                        <td className="px-6 py-4">
                                            <MDBBtn
                                                color="success"
                                                style={{ height: "35px", borderRadius: "5px" }}
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setInfoModal(true);
                                                }}
                                                disabled={event.feedbackGiven}  
                                            >
                                                {event.feedbackGiven ? "Feedback Given" : "Feedback"}
                                            </MDBBtn>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center">No Events attended yet.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <MDBModal show={infoModal} setShow={setInfoModal} tabIndex="-1">
                <MDBModalDialog style={{ borderRadius: "20px" }} size="lg">
                    <MDBModalContent id="card">
                        <MDBModalHeader>
                            <MDBModalTitle>Give Feedback</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={() => setInfoModal(false)}></MDBBtn>
                        </MDBModalHeader>
                        <form  id="feedbackForm"
                            onSubmit={e => {
                                e.preventDefault();
                                handleSubmitFeedback(selectedEvent.eventId, e.target.feedback.value);
                            }}
                        >
                            <MDBModalBody>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Your Feedback</p>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="feedback"
                                        placeholder="Feedback"
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
    );
}
