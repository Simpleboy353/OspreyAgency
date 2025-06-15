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

export default function Events() {
    const [show, setShow] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [data, setData] = useState([]);
    const [basicModal, setBasicModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [id, setId] = useState("");
    const [title, settitle] = useState("");
    const [description, setdescription] = useState("");
    const [venue, setvenue] = useState("");
    const [date, setdate] = useState("");
    const [infoModal, setInfoModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);
    const toggleUpdate = () => setUpdateModal(!updateModal);
    const toggleInfo = () => setInfoModal(!infoModal);
    const [eventData, setEventData] = useState(null);
    const [attendees, setAttendees] = useState([]);

    const [buttonText, setButtonText] = useState("Add Event");
    const [buttonColor, setButtonColor] = useState("");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    const [buttonState, setButtonState] = useState({
        bgColor: '#313a50',
        text: 'Update Event',
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
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const response = await ipcRenderer.invoke("fetchEvents");
            if (response.success) {
                setData(response.events);
            } else {
                console.error("Failed to fetch events");
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    async function fetchEventById(eventId) {
        try {
            const response = await ipcRenderer.invoke("fetchEventById", eventId);
            if (response.success) {
                setEventData(response.event);
                setInfoModal(true);
            } else {
                console.error("Failed to fetch event:", response.message);
            }
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    }


    const confirmDelete = (id) => {
        setSelectedDeleteId(id);
        setDeleteModalOpen(true);
    };
    const handleDelete = () => {
        if (selectedDeleteId !== null) {
            ipcRenderer.send("delete-event", selectedDeleteId);
            setData((prevEvent) => prevEvent.filter((event) => event.eventId !== selectedDeleteId));
        }
        setDeleteModalOpen(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmit(true);

        const formData = new FormData(e.target);
        const imageFile = formData.get('image');
        const title = formData.get('title');
        const description = formData.get('description');
        const venue = formData.get('venue');
        const date = formData.get('date');
        const status = "Active";

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageBase64 = reader.result.split(',')[1];

            const eventData = {
                image: imageBase64,
                title,
                description,
                venue,
                date,
                status
            };

            try {
                const response = await ipcRenderer.invoke('addEvent', eventData);
                if (response.success) {
                    e.target.reset();
                    setButtonText("Event Added");
                    setButtonColor("green");
                    setSubmit(false);
                    fetchEvents();
                    setTimeout(() => {
                        setButtonText("Add Event");
                        setButtonColor("");
                    }, 1500);
                } else {
                    setButtonText("Error Occurred");
                    setButtonColor("red");
                    setSubmit(false);
                    setTimeout(() => {
                        setButtonText("Add Event");
                        setButtonColor("");
                    }, 1500);
                }
            } catch (error) {
                console.error('Error adding event:', error);
                setButtonText("Error Occurred");
                setButtonColor("red");
                setSubmit(false);
                setTimeout(() => {
                    setButtonText("Add Event");
                    setButtonColor("");
                }, 1500);
            }
        };
        reader.readAsDataURL(imageFile);
    };

    const handleSwitchChange = async (currentStatus, eventId) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

        try {
            const result = await ipcRenderer.invoke('update-event-status', {
                eventId,
                status: newStatus
            });

            if (result.success) {
                setData((prevevents) =>
                    prevevents.map((event) =>
                        event.eventId === eventId ? { ...event, status: newStatus } : event
                    )
                );
            } else {
                console.error("Failed to update status in database");
            }
        } catch (error) {
            console.error("IPC error:", error);
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmit(true);

        const updatedData = {
            id,
            title,
            image: image || undefined,
            description,
            venue,
            date
        };

        try {
            const response = await ipcRenderer.invoke('updateEvent', updatedData);

            if (response.success) {
                setButtonState({ bgColor: 'green', text: 'Updated' });
                fetchEvents(); // Refresh event list

                setTimeout(() => {
                    setButtonState({ bgColor: '#313a50', text: 'Update Event' });
                }, 2000);
            } else {
                setButtonState({ bgColor: 'red', text: 'Error Occurred' });

                setTimeout(() => {
                    setButtonState({ bgColor: '#313a50', text: 'Update Event' });
                }, 2000);
            }
        } catch (error) {
            setButtonState({ bgColor: 'red', text: 'Error Occurred' });

            setTimeout(() => {
                setButtonState({ bgColor: '#313a50', text: 'Update Event' });
            }, 2000);
        } finally {
            setSubmit(false);
        }
    };


   


    const fetchEventAttendee = async () => {
        try {
            const response = await ipcRenderer.invoke("fetchEventAttendees", id);
            if (response.success) {
                setAttendees(Array.isArray(response.attendees) ? response.attendees : []);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error fetching attendees:", error);
        }
    };
    

    useEffect(() => {
        if (infoModal && id) {
            fetchEventAttendee();
        }
    }, [infoModal, id]);


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
                            Manage Events
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
                            Add Event
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
                                    <th scope="col" className="px-6 py-3">
                                        Sr
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Venue
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Edit Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Details
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Update
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="tablebody">
                                {data.map((event, index) => (
                                    <tr className="border-b" key={event.eventId}>
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium whitespace-nowrap"
                                        >
                                            {index + 1}
                                        </th>
                                        <td className="px-6 py-4">{event.title}</td>
                                        <td className="px-6 py-4">{event.venue}</td>
                                        <td className="px-6 py-4">{event.date}</td>
                                        <td className="px-6 py-4" style={{ color: event.status === 'Active' ? "" : "red" }}>
                                            {event.status}
                                        </td>
                                        <td className="px-6 py-4">
                                            <MDBSwitch
                                                checked={event.status === 'Active'} 
                                                onChange={() => handleSwitchChange(event.status, event.eventId)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                onClick={() => {
                                                    setId(event.eventId);
                                                    setdescription(event.description);
                                                    fetchEventById(event.eventId);
                                                    setInfoModal(true);
                                                }}
                                            >
                                                <i className="fa fa-eye" style={{ color: "orange" }}></i>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                onClick={() => {
                                                    setId(event.eventId);
                                                    settitle(event.title);
                                                    setdescription(event.description);
                                                    setvenue(event.venue);
                                                    setdate(event.date);
                                                    setUpdateModal(true);
                                                }}
                                            >
                                                <i className="fa fa-edit" style={{ color: "green" }}></i>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href="#"
                                                onClick={() => confirmDelete(event.eventId)}
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
                            <MDBModalTitle>Add Event</MDBModalTitle>
                            <MDBBtn
                                className="btn-close"
                                color="none"
                                onClick={toggleShow}
                            ></MDBBtn>
                        </MDBModalHeader>
                        <form onSubmit={handleAdd}>
                            <MDBModalBody>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Image</p>
                                    <Form.Control
                                        type="file"
                                        size="lg"
                                        name="image"
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Title</p>
                                    <Form.Control
                                        type="text"
                                        placeholder="Event Title"
                                        size="lg"
                                        name="title"
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Description</p>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Event Description"
                                        size="lg"
                                        name="description"
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Venue</p>
                                    <Form.Control
                                        type="text"
                                        placeholder="Event Venue"
                                        size="lg"
                                        name="venue"
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Date</p>
                                    <Form.Control
                                        type="date"
                                        size="lg"
                                        name="date"
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
                            <MDBModalTitle>Update Event</MDBModalTitle>
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
                                        placeholder="Event Title"
                                        size="lg"
                                        value={title}
                                        onChange={(e) => settitle(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Description</p>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Event Description"
                                        size="lg"
                                        value={description}
                                        onChange={(e) => setdescription(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Venue</p>
                                    <Form.Control
                                        type="text"
                                        placeholder="Event Venue"
                                        size="lg"
                                        value={venue}
                                        onChange={(e) => setvenue(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <p style={{ marginBottom: "0px", textAlign: "left" }}>Date</p>
                                    <Form.Control
                                        type="date"
                                        size="lg"
                                        value={date}
                                        onChange={(e) => setdate(e.target.value)}
                                        required
                                        style={{ borderRadius: '10px', color: "black" }}
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
                            <MDBModalTitle>Event Descriptions</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={() => setInfoModal(false)}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <img
                                src={eventData && eventData.image ? `data:image/png;base64,${eventData.image}` : "../Assets/user.png"}
                                className='img-fluid shadow-4' alt='...'
                                style={{ height: '1000px', width: '1000px', borderRadius: '20px' }} />
                            <p style={{ textAlign: 'center', marginTop: '5px' }}>{description} </p>
                            <h5 style={{ textAlign: 'left' }}>Status</h5>
                            <div
                                className="relative overflow-x-auto shadow-md sm:rounded-lg"
                                style={{
                                    borderRadius: "20px",
                                    marginTop: "30px",
                                    overflowY: "auto",
                                    maxHeight: "200px",
                                }}
                            >
                                <table className="w-full text-sm text-left text-gray">
                                    <thead className="uppercase" id="tablehead" style={{ padding: "10px", color: "#313a50" }}>
                                        <tr>
                                            <th color="red" scope="col" className="px-6 py-3">Sr</th>
                                            <th scope="col" className="px-6 py-3">Users</th>
                                            <th scope="col" className="px-6 py-3">Feedback</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody id="tablebody">
                                        {attendees.map((attendee, index) => (
                                            <tr className="border-b" key={attendee.userId}>
                                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                                    {index + 1}
                                                </th>
                                                <td>
                                                    <div className="d-flex align-items-right px-6 py-4">
                                                        <img
                                                            src={attendee.image ? `data:image/png;base64,${attendee.image}` : "../Assets/user.png"}
                                                            alt="User"
                                                            style={{ width: "45px", height: "45px" }}
                                                            className="rounded-circle"
                                                        />
                                                        <div className="ms-3">
                                                            <p className="fw-bold mb-1">{attendee.name}</p>
                                                            <p className="mb-0">{attendee.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                <td className="px-6 py-4">{attendee.feedback || "No Feedback"}</td>
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
