import React, { useEffect, useState } from "react";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
const { ipcRenderer } = window.require("electron");

export default function Home() {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState(0);
  const [jobs, setJobs] = useState(0);
  const [events, setEvents] = useState(0);
  const [brandAmbassador, setBrandAmbassador] = useState(0);
  const [announcements, setAnnouncements] = useState(0);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
  
    // Fetch data from Electron backend using invoke
    ipcRenderer.invoke("get-dashboard-stats").then((data) => {
      setUsers(data.usersCount);
      setJobs(data.activitiesCount);
      setEvents(data.eventsCount);
      setBrandAmbassador(data.brandAmbassadorCount);
      setAnnouncements(data.announcementsCount);
    }).catch((err) => {
      console.error("Error fetching dashboard stats:", err);
    });
  
  }, []);
  

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <MDBRow style={{ margin: "5px", marginTop: "30px" }}>
            <h1 className="dashboard" style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}>
              Dashboard
            </h1>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon icon="users" className="mr-2" style={{ marginRight: "5px" }} />
                      Users
                    </div>
                    <h2>{users}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon icon="briefcase" className="mr-2" style={{ marginRight: "5px" }} />
                      Activities
                    </div>
                    <h2>{jobs}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon icon="calendar-alt" className="mr-2" style={{ marginRight: "5px" }} />
                      Events
                    </div>
                    <h2>{events}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon icon="money-bill-wave" className="mr-2" style={{ marginRight: "5px" }} />
                      Brand Ambassador
                    </div>
                    <h2>{brandAmbassador}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon icon="bullhorn" className="mr-2" style={{ marginRight: "5px" }} />
                      Announcements
                    </div>
                    <h2>{announcements}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </div>
      </div>
    </div>
  );
}

